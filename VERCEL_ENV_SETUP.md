# Environment Variables Setup for Vercel

## Required Environment Variables

You need to set these environment variables in your Vercel dashboard:

### Frontend (https://vercel.com/your-project/settings/environment-variables)

1. **VITE_API_BASE_URL**
   - Value: Your deployed backend API URL (e.g., `https://your-backend.vercel.app/api`)
   - Environment: Production, Preview, Development

2. **VITE_GOOGLE_CLIENT_ID**
   - Value: Your Google OAuth Client ID
   - Environment: Production, Preview, Development

### Backend (https://vercel.com/your-backend-project/settings/environment-variables)

1. **FRONTEND_URL**
   - Value: Your deployed frontend URL (e.g., `https://your-frontend.vercel.app`)
   - Environment: Production, Preview, Development

2. **MONGODB_URI**
   - Value: Your MongoDB connection string

3. **JWT_SECRET**
   - Value: Your JWT secret key

4. **GOOGLE_CLIENT_ID**
   - Value: Your Google OAuth Client ID

5. **GOOGLE_CLIENT_SECRET**
   - Value: Your Google OAuth Client Secret

6. **CLOUDINARY_CLOUD_NAME**
   - Value: Your Cloudinary cloud name

7. **CLOUDINARY_API_KEY**
   - Value: Your Cloudinary API key

8. **CLOUDINARY_API_SECRET**
   - Value: Your Cloudinary API secret

9. **GEMINI_API_KEY**
   - Value: Your Google Gemini API key

10. **EMAIL_USER** (if using email service)
    - Value: Your email address

11. **EMAIL_PASS** (if using email service)
    - Value: Your email password/app password

## How to Set Environment Variables on Vercel

1. Go to your project on Vercel
2. Click on "Settings"
3. Navigate to "Environment Variables"
4. Add each variable with its value
5. Select the environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy your application for changes to take effect

## Important Notes

- After setting environment variables, you must redeploy your application
- The `VITE_` prefix is required for Vite to expose the variable to the client-side code
- Backend URL should end with `/api` for the frontend configuration
- Make sure Google OAuth redirect URIs are updated in Google Cloud Console
