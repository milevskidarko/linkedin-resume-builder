# Production Deployment Guide

## Required Environment Variables for Vercel

Make sure these environment variables are set in your Vercel project:

### NextAuth Configuration
```
AUTH_SECRET=f4bbb9787d5be8aee16def3a80cf10f36c600eee12cae8dad7e3df69ebc1d320
NEXTAUTH_SECRET=f4bbb9787d5be8aee16def3a80cf10f36c600eee12cae8dad7e3df69ebc1d320
NEXTAUTH_URL=https://your-production-domain.vercel.app
```

### Google OAuth
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Important:** Get your OAuth credentials from https://console.cloud.google.com/apis/credentials

**Important:** Add your production domain to Google OAuth authorized redirect URIs:
- Go to https://console.cloud.google.com/apis/credentials
- Select your OAuth 2.0 Client ID
- Add to "Authorized redirect URIs":
  - `https://your-production-domain.vercel.app/api/auth/callback/google`

### Database
```
DATABASE_URL=postgresql://postgres.hozwsrmujppnfpdhhszh:inter-milan1%40@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
```

## Vercel Setup Steps

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the variables listed above
4. Make sure to select all environments (Production, Preview, Development)
5. Redeploy your application

## Troubleshooting

### "No session found" error in production

This usually means:
1. ✅ Environment variables are not set in Vercel
2. ✅ Google OAuth redirect URI doesn't include your production domain
3. ✅ NEXTAUTH_URL doesn't match your actual domain
4. ✅ Cookies are being blocked (check browser settings)

### How to check if it's working:
1. Open browser DevTools → Network tab
2. Try to sign in
3. Look for `/api/auth/callback/google` request
4. Check the response - should be a redirect with session cookie

### Session cookies not persisting:
- Make sure NEXTAUTH_URL matches your exact production domain (including https://)
- Check that your domain supports secure cookies
- Verify no browser extensions are blocking cookies
