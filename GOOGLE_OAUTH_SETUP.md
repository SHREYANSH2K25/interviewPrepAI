# Google OAuth Setup Guide

## Overview
This guide will help you configure Google OAuth 2.0 authentication for the InterviewPrepAI application.

## Prerequisites
- Google Account
- Application running locally (Backend on port 5000, Frontend on port 5175)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `InterviewPrepAI` (or your preferred name)
4. Click **Create**
5. Wait for project creation and select it

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API" or "Google People API"
3. Click on it and press **Enable**
4. Wait for the API to be enabled

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type (for testing)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: `InterviewPrepAI`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **Save and Continue**
6. **Scopes**: Click **Add or Remove Scopes**
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
7. Click **Save and Continue**
8. **Test users** (for External apps): Add your email addresses for testing
9. Click **Save and Continue**
10. Review and click **Back to Dashboard**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. Enter **Name**: `InterviewPrepAI Web Client`
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5175
   http://localhost:5000
   ```
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Click **Create**
8. **IMPORTANT**: Copy the **Client ID** and **Client Secret** from the popup

## Step 5: Update Environment Variables

### Backend (.env)
Open `backend/.env` and update:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
SESSION_SECRET=your-random-secret-key-here
```

**Generate a secure SESSION_SECRET** (use one of these methods):
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 32

# Option 3: Use a random string generator online (at least 32 characters)
```

### Frontend (.env)
Open `frontend/.env` and update:
```env
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

**Note**: Use the SAME Client ID in both frontend and backend.

## Step 6: Restart Servers

After updating environment variables, restart both servers:

### Backend
```bash
cd backend
# Stop the current server (Ctrl+C)
npm start
```

### Frontend
```bash
cd frontend
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 7: Test Google OAuth Flow

1. Open your browser and go to `http://localhost:5175`
2. Click **Login** or **Get Started**
3. Click **Sign in with Google** button
4. You should be redirected to Google's consent screen
5. Select your Google account
6. Grant permissions (email and profile access)
7. You should be redirected back to the application dashboard
8. Verify that you're logged in with your Google account

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution**: Make sure the redirect URI in Google Console exactly matches:
```
http://localhost:5000/api/auth/google/callback
```
No trailing slash, exact port number.

### Error: "invalid_client"
**Solution**: 
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Ensure there are no extra spaces or quotes in .env file
- Restart backend server after changing .env

### Error: "Access blocked: This app's request is invalid"
**Solution**:
- Complete OAuth consent screen configuration
- Add your email as a test user (for External apps)
- Wait a few minutes for Google to propagate changes

### Token not saving / Redirect loop
**Solution**:
- Check browser console for errors
- Verify AuthCallback.jsx is properly handling URL parameters
- Clear localStorage and cookies, try again

### CORS Errors
**Solution**:
- Verify backend CORS is configured for http://localhost:5175
- Check that CLIENT_URL in backend/.env is set to http://localhost:5175

## Production Deployment

When deploying to production:

1. Update Google Cloud Console:
   - Add production URLs to **Authorized JavaScript origins**: `https://yourdomain.com`
   - Add production redirect URI: `https://yourdomain.com/api/auth/google/callback`

2. Update environment variables with production URLs

3. Change OAuth consent screen to **Internal** (if using Google Workspace) or publish the app for **External** users

4. Enable secure cookies in production (already configured in code)

## Security Notes

- Never commit `.env` files to version control
- Keep your Client Secret secure
- Use HTTPS in production
- Regularly rotate your SESSION_SECRET
- Review OAuth scopes - only request what you need

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)

---

**Last Updated**: January 2025
**Application**: InterviewPrepAI v1.0
