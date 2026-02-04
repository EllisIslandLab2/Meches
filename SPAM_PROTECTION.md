# Spam Protection Setup Guide

This guide explains how to configure and use the spam protection features for contact forms.

## Overview

The spam protection system includes:
- **reCAPTCHA v3** - Invisible bot detection (no user interaction required)
- **Rate Limiting** - Max 5 submissions per 15 minutes per IP
- **Email Validation** - Detects common spam email patterns
- **Message Quality Checks** - Filters gibberish and low-quality content
- **Content Filtering** - Blocks spam keywords and excessive links

## Setup Instructions

### 1. Get Google reCAPTCHA v3 Keys

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click **Register a new site**
3. Fill in the form:
   - **Label**: Your site name (e.g., "Meche's Crafts Contact Form")
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domain (e.g., `mechescreations.com`)
     - For testing, also add `localhost`
4. Accept terms and submit
5. Copy your **Site Key** and **Secret Key**

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Google reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Important**:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is public and can be exposed to the browser
- `RECAPTCHA_SECRET_KEY` must remain private (server-side only)

### 3. Deploy to Production

After adding the environment variables:

1. **Local Testing**: Run `npm run dev` and test form submissions
2. **Vercel Deployment**:
   - Go to your Vercel project settings
   - Navigate to **Environment Variables**
   - Add both reCAPTCHA keys
   - Redeploy your site

## How It Works

### Form Submission Flow

1. User fills out contact form
2. **Client-side**: reCAPTCHA v3 generates a token invisibly
3. Token is sent with form data to API
4. **Server-side checks**:
   - Verify reCAPTCHA token (score must be ≥ 0.5)
   - Check rate limits (IP-based)
   - Validate email format and patterns
   - Check message quality (minimum words, no gibberish)
   - Filter spam keywords and excessive links
5. If all checks pass, save to Airtable
6. If any check fails, reject with error message

### Spam Detection Rules

#### Email Validation
- ❌ Invalid format (missing @, domain, etc.)
- ❌ Excessive dots in username (e.g., `u.p.i.z.u.s.i.c.e@gmail.com`)
- ❌ Common spam domains (.ru, .tk, .ml, .ga, .cf, .gq)
- ❌ Many consecutive numbers in email

#### Message Quality
- ❌ Too short (< 10 characters)
- ❌ Too few words (< 3 words)
- ❌ Excessive gibberish (>50% words without vowels)
- ❌ Contains spam keywords (viagra, cialis, crypto, casino, etc.)
- ❌ Too many links (> 2 URLs)

#### Rate Limiting
- ❌ More than 5 submissions from same IP in 15 minutes

### reCAPTCHA Score Interpretation

reCAPTCHA v3 returns a score from 0.0 to 1.0:
- **1.0** - Very likely a legitimate user
- **0.5** - Threshold (configurable in `spamProtection.ts`)
- **0.0** - Very likely a bot

You can adjust the threshold in `/src/lib/spamProtection.ts`:

```typescript
if (data.score < 0.5) {  // Change 0.5 to adjust sensitivity
  return {
    success: false,
    score: data.score,
    message: 'Submission blocked by spam protection'
  };
}
```

Lower threshold = More strict (may block legitimate users)
Higher threshold = More permissive (may allow more spam)

## Testing

### Test Legitimate Submissions

1. Go to contact page
2. Fill out form with real information:
   - Valid email (e.g., `test@gmail.com`)
   - Meaningful message (e.g., "I'm interested in custom jewelry")
3. Submit
4. Should succeed and save to Airtable

### Test Spam Detection

Test each spam filter:

**1. Email Validation**
- Try: `u.p.i.z.u.s.i.c.e@gmail.com` (excessive dots)
- Expected: ❌ Blocked - "Email appears to be invalid"

**2. Message Quality**
- Try: `asdfghjkl` (gibberish)
- Expected: ❌ Blocked - "Message appears to be invalid"

**3. Too Short**
- Try: `hi` (2 characters)
- Expected: ❌ Blocked - "Message is too short"

**4. Spam Keywords**
- Try: `Click here to win free bitcoin!`
- Expected: ❌ Blocked - "Message contains prohibited content"

**5. Rate Limiting**
- Submit 6 forms rapidly from same IP
- Expected: 6th submission ❌ Blocked - "Too many submissions"

### Monitoring Spam Attempts

Blocked spam attempts are logged to the console but NOT saved to Airtable:

```javascript
console.warn('Spam submission blocked:', {
  reason: spamCheck.reason,
  details: spamCheck.details,
  email: data.fields.Email,
  ip
});
```

In production, check your Vercel logs to see blocked spam attempts:
1. Go to Vercel Dashboard
2. Select your project
3. Click **Logs**
4. Search for "Spam submission blocked"

## Troubleshooting

### Forms Not Submitting (False Positives)

If legitimate users can't submit:

1. **Check reCAPTCHA score**: Lower the threshold in `spamProtection.ts`
2. **Check message requirements**: Reduce minimum word count
3. **Review logs**: See which rule is blocking legitimate users

### Still Getting Spam

If spam is getting through:

1. **Raise reCAPTCHA threshold**: Change from 0.5 to 0.6 or 0.7
2. **Add more spam patterns**: Update `spamKeywords` array in `spamProtection.ts`
3. **Stricter email validation**: Add more spam domain patterns
4. **Lower rate limits**: Change from 5 to 3 submissions per window

### reCAPTCHA Not Loading

1. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
2. Check browser console for errors
3. Ensure domain is registered in reCAPTCHA admin
4. Try clearing cache and hard refresh

## File Structure

```
src/
├── lib/
│   └── spamProtection.ts          # Spam detection logic
├── components/
│   └── ReCaptchaProvider.tsx      # reCAPTCHA wrapper component
├── app/
│   ├── layout.tsx                 # Wraps app with ReCaptchaProvider
│   ├── contact/
│   │   └── page.tsx               # Contact form with reCAPTCHA
│   └── api/
│       └── airtable/
│           └── route.ts           # API route with spam checks
```

## Customization

### Adjust Rate Limits

In `spamProtection.ts`, modify the `checkRateLimit` function:

```typescript
// Change 5 to desired limit
if (limit.count >= 5) {
  // ...
}

// Change 15 * 60 * 1000 to desired window (in ms)
rateLimitMap.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 });
```

### Add Custom Spam Patterns

In `spamProtection.ts`, update the arrays:

```typescript
// Email patterns
const spamPatterns = [
  /[0-9]{5,}@/,
  /\.(ru|tk|ml|ga|cf|gq)$/,
  /^[a-z](\.[a-z]){5,}@/,
  // Add your patterns here
  /example-spam-pattern/,
];

// Spam keywords
const spamKeywords = [
  'viagra', 'cialis', 'crypto',
  // Add your keywords here
  'your-spam-keyword',
];
```

### Disable Specific Checks

Comment out checks in `checkForSpam` function in `spamProtection.ts`:

```typescript
// Disable message quality check
// const messageValidation = validateMessageQuality(data.message);
// if (!messageValidation.valid) {
//   return { isSpam: true, ... };
// }
```

## Best Practices

1. **Monitor initially**: Check logs frequently after deployment
2. **Adjust gradually**: Make small threshold changes, then observe
3. **User feedback**: Provide helpful error messages
4. **Backup validation**: Keep multiple layers of protection
5. **Regular updates**: Review and update spam patterns monthly

## Support

If spam continues to be an issue after implementing these protections, consider:
- [Akismet API](https://akismet.com/) - Advanced spam filtering service
- [Cloudflare Bot Management](https://www.cloudflare.com/products/bot-management/) - Enterprise-grade bot protection
- Email validation services like [ZeroBounce](https://www.zerobounce.net/)
