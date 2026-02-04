# Quick reCAPTCHA Setup (5 minutes)

## Step 1: Get Your reCAPTCHA Keys

1. Go to https://www.google.com/recaptcha/admin
2. Click **+ Create** (or "Register a new site")
3. Fill out the form:
   ```
   Label: Meche's Crafts Contact Form
   reCAPTCHA type: ✓ reCAPTCHA v3 (IMPORTANT: Must be v3, not v2!)
   Domains:
     - mechescreations.com
     - www.mechescreations.com
     - localhost (for testing)
   ```
4. Accept terms and click **Submit**
5. You'll see two keys - copy them!

## Step 2: Add to Environment Variables

### Local Development (.env.local)

Add these lines to your `.env.local` file:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### Production (Vercel)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = your site key
   - `RECAPTCHA_SECRET_KEY` = your secret key
5. Click **Save**
6. Redeploy your site

## Step 3: Test It

### Test Locally
```bash
npm run dev
```

Go to http://localhost:3000/contact and try submitting a form.

### What Gets Blocked Now

✅ **Automatically Blocked:**
- Bots and automated spam (reCAPTCHA < 0.5 score)
- Gibberish messages like "asdfghjkl"
- Email patterns like `u.p.i.z.u.s.i.c.e@gmail.com` (excessive dots)
- Spam keywords (viagra, crypto, casino, etc.)
- Too many links in message (> 2)
- Too short messages (< 10 characters)
- Rate limiting (max 5 submissions per 15 min per IP)

✅ **Still Allowed:**
- Real users with legitimate inquiries
- Normal email addresses
- Meaningful messages

## That's It!

Your contact form is now protected. Check `SPAM_PROTECTION.md` for advanced configuration and troubleshooting.

## Monitoring Spam Attempts

In Vercel:
1. Go to your project
2. Click **Logs**
3. Search for "Spam submission blocked"

You'll see which spam attempts were blocked and why.
