# Email Verification Setup Guide

## Overview
Your application now includes email verification with OTP (One-Time Password) for signup and login. This prevents fake email registrations and ensures users have access to their email addresses.

## Features Implemented

### Backend
✅ OTP-based email verification
✅ 6-digit verification codes
✅ 10-minute OTP expiration
✅ Resend OTP functionality
✅ Professional HTML email templates
✅ Google OAuth users auto-verified

### Frontend
✅ OTP verification modal with 6-box input
✅ Auto-focus next input box
✅ Countdown timer showing expiration
✅ Resend OTP button (enabled after 1 minute)
✅ Paste support for OTP codes
✅ Integrated with SignUp and Login flows

## Gmail App Password Setup

To send OTP emails, you need to configure Gmail with an App Password:

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the prompts to enable 2-Step Verification

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Windows Computer** (or your device)
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Backend .env File
Open `backend/.env` and update these values:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

⚠️ **Important**: 
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `abcdefghijklmnop` with the 16-character App Password (remove spaces)
- Don't use your regular Gmail password

### Step 4: Restart Backend Server
```bash
cd backend
npm start
```

## Google OAuth Error Fix

### Error: origin_mismatch (Error 400)
This error occurs because your frontend URL is not authorized in Google Cloud Console.

### Solution:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Click your OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, click **+ ADD URI**
6. Add these URLs:
   ```
   http://localhost:5174
   http://localhost:5173
   ```
7. Click **SAVE**
8. Wait 5-10 minutes for changes to propagate
9. Try Google Sign-In again

## Testing the Email Verification

### Test Signup Flow
1. Navigate to the landing page
2. Click "Sign Up"
3. Enter name, email, and password
4. Click "Create Account"
5. Check your email inbox for the OTP
6. Enter the 6-digit code in the verification modal
7. You should be logged in and redirected to dashboard

### Test Login with Unverified Account
1. Try to login with an email that hasn't been verified
2. You should see the OTP verification modal
3. Enter the OTP from your email
4. You should be logged in successfully

### Test Resend OTP
1. During verification, wait for 1 minute
2. Click "Resend OTP"
3. Check your email for a new code
4. Timer should reset to 10:00

### Test OTP Expiration
1. Wait for 10 minutes after receiving an OTP
2. Try to verify with the expired code
3. You should see an error message
4. Click "Resend OTP" to get a new code

## Email Configuration Options

### Alternative Email Providers

#### Using Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Using Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

## Troubleshooting

### OTP Email Not Received
1. Check spam/junk folder
2. Verify `EMAIL_USER` and `EMAIL_PASSWORD` in .env
3. Ensure 2-Step Verification is enabled
4. Check backend console for email sending errors
5. Try sending a test email:
   ```javascript
   // In backend, create test.js
   const { sendOTPEmail } = require('./utils/emailService');
   sendOTPEmail('your-email@example.com', '123456', 'Test User');
   ```

### Google OAuth Still Shows Error 400
1. Double-check authorized origins in Google Cloud Console
2. Wait 10 minutes after saving changes
3. Clear browser cache and cookies
4. Try in incognito mode
5. Verify `VITE_GOOGLE_CLIENT_ID` matches the Client ID in Google Cloud Console

### Backend Crashes on Startup
1. Check all required environment variables are set
2. Verify nodemailer is installed: `npm list nodemailer`
3. Check for syntax errors in emailService.js
4. Review backend console logs for specific error messages

## Security Best Practices

✅ **Never commit .env file** - It's already in .gitignore
✅ **Use App Passwords** - Don't use your main Gmail password
✅ **Rotate App Passwords** - Change them periodically
✅ **Limit OTP Attempts** - Consider adding rate limiting (future enhancement)
✅ **Use HTTPS in Production** - Never send tokens over HTTP

## Production Deployment

When deploying to production:

1. **Update Environment Variables**:
   - Use production email service (e.g., SendGrid, AWS SES)
   - Set strong JWT secrets
   - Use production database

2. **Update Google OAuth**:
   - Add production domain to authorized origins
   - Add production callback URLs

3. **Email Service Recommendations**:
   - **SendGrid** - 100 emails/day free
   - **AWS SES** - 62,000 emails/month free
   - **Mailgun** - 5,000 emails/month free

## Support

If you encounter issues:
1. Check backend console logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test email service separately
5. Review Google Cloud Console settings

---

**Next Steps**: 
- Test the complete signup/login flow
- Configure Gmail App Password
- Fix Google OAuth authorized origins
- Deploy to production with production email service
