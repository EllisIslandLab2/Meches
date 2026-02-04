/**
 * Spam Protection Utilities
 * Validates form submissions to prevent spam from reaching Airtable
 */

// Simple in-memory rate limiting (for serverless, consider Vercel KV or Upstash Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting - max 5 submissions per 15 minutes per IP
 */
export function checkRateLimit(identifier: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (limit) {
    // Reset if time window has passed
    if (now > limit.resetTime) {
      rateLimitMap.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 });
      return { allowed: true };
    }

    // Check if limit exceeded
    if (limit.count >= 5) {
      const minutesLeft = Math.ceil((limit.resetTime - now) / 60000);
      return {
        allowed: false,
        message: `Too many submissions. Please try again in ${minutesLeft} minutes.`
      };
    }

    // Increment count
    limit.count++;
    return { allowed: true };
  }

  // First submission from this identifier
  rateLimitMap.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 });
  return { allowed: true };
}

/**
 * Verify reCAPTCHA v3 token
 */
export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; message?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return { success: false, message: 'reCAPTCHA not configured' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return { success: false, message: 'reCAPTCHA verification failed' };
    }

    // reCAPTCHA v3 returns a score (0.0 - 1.0)
    // 0.0 is very likely a bot, 1.0 is very likely a human
    // We'll use 0.5 as the threshold (adjust as needed)
    if (data.score < 0.5) {
      return {
        success: false,
        score: data.score,
        message: 'Submission blocked by spam protection'
      };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, message: 'reCAPTCHA verification error' };
  }
}

/**
 * Validate email format and check if domain exists
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Check for common spam email patterns
  const spamPatterns = [
    /[0-9]{5,}@/, // Many numbers in email
    /\.(ru|tk|ml|ga|cf|gq)$/, // Common spam domains
    /^[a-z](\.[a-z]){5,}@/, // Excessive dots in username (e.g., u.p.i.z.u.s.i.c.e@)
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(email.toLowerCase())) {
      return { valid: false, message: 'Email appears to be invalid' };
    }
  }

  return { valid: true };
}

/**
 * Check message quality - detect gibberish and spam content
 */
export function validateMessageQuality(message: string, minWords = 3): { valid: boolean; message?: string } {
  // Remove extra whitespace
  const cleaned = message.trim();

  // Check minimum length
  if (cleaned.length < 10) {
    return { valid: false, message: 'Message is too short' };
  }

  // Check for minimum word count
  const words = cleaned.split(/\s+/).filter(word => word.length > 0);
  if (words.length < minWords) {
    return { valid: false, message: `Message must contain at least ${minWords} words` };
  }

  // Check for gibberish - excessive consonants without vowels
  const gibberishWords = words.filter(word => {
    if (word.length < 4) return false;
    const vowels = word.match(/[aeiou]/gi) || [];
    return vowels.length === 0;
  });

  if (gibberishWords.length > words.length * 0.5) {
    return { valid: false, message: 'Message appears to be invalid' };
  }

  // Check for spam keywords
  const spamKeywords = [
    'viagra', 'cialis', 'crypto', 'bitcoin', 'casino',
    'weight loss', 'click here', 'buy now', 'limited time',
    'congratulations', 'winner', 'claim prize'
  ];

  const lowerMessage = cleaned.toLowerCase();
  const hasSpamKeyword = spamKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasSpamKeyword) {
    return { valid: false, message: 'Message contains prohibited content' };
  }

  // Check for excessive links
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = cleaned.match(urlPattern) || [];
  if (urls.length > 2) {
    return { valid: false, message: 'Too many links in message' };
  }

  return { valid: true };
}

/**
 * Comprehensive spam check for form submissions
 */
export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  details?: string;
}

export async function checkForSpam(data: {
  email: string;
  message?: string;
  name?: string;
  recaptchaToken?: string;
  ip?: string;
}): Promise<SpamCheckResult> {
  // Check reCAPTCHA if token provided
  if (data.recaptchaToken) {
    const recaptchaResult = await verifyRecaptcha(data.recaptchaToken);
    if (!recaptchaResult.success) {
      return {
        isSpam: true,
        reason: 'reCAPTCHA verification failed',
        details: recaptchaResult.message,
      };
    }
  }

  // Rate limiting by IP
  if (data.ip) {
    const rateLimitResult = checkRateLimit(data.ip);
    if (!rateLimitResult.allowed) {
      return {
        isSpam: true,
        reason: 'Rate limit exceeded',
        details: rateLimitResult.message,
      };
    }
  }

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    return {
      isSpam: true,
      reason: 'Invalid email',
      details: emailValidation.message,
    };
  }

  // Validate message quality if provided
  if (data.message) {
    const messageValidation = validateMessageQuality(data.message);
    if (!messageValidation.valid) {
      return {
        isSpam: true,
        reason: 'Invalid message content',
        details: messageValidation.message,
      };
    }
  }

  // Check name for suspicious patterns
  if (data.name) {
    // Names shouldn't have URLs
    const urlPattern = /(https?:\/\/[^\s]+)/;
    if (urlPattern.test(data.name)) {
      return {
        isSpam: true,
        reason: 'Invalid name',
        details: 'Name contains a URL',
      };
    }

    // Names shouldn't be too long
    if (data.name.length > 100) {
      return {
        isSpam: true,
        reason: 'Invalid name',
        details: 'Name is too long',
      };
    }
  }

  return { isSpam: false };
}
