# Yoga Flow - Deployment Guide 🚀

This guide covers deploying your Yoga Flow app to production.

## 📋 Pre-deployment Checklist

### 1. Environment Setup
- [ ] Production Supabase project created
- [ ] Production Clerk application configured
- [ ] All environment variables updated for production
- [ ] Database schema deployed to production Supabase
- [ ] Storage bucket created and configured
- [ ] Row Level Security policies tested

### 2. App Configuration
- [ ] App name and bundle identifier updated in app.json
- [ ] App icons and splash screen created
- [ ] Version number updated
- [ ] EAS project ID configured

### 3. Testing
- [ ] All features tested on iOS
- [ ] All features tested on Android
- [ ] Real-time chat functionality verified
- [ ] Video upload/playback tested
- [ ] Authentication flow tested
- [ ] Database operations verified

## 🏗️ Build Setup

### Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Login to Expo
```bash
eas login
```

### Configure Build
```bash
eas build:configure
```

This creates `eas.json` with build configurations.

### Example eas.json
```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-prod-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-prod-anon-key",
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_live_your-prod-key"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 📱 Building for App Stores

### iOS Build
```bash
# Build for App Store
eas build --platform ios --profile production

# Build for TestFlight
eas build --platform ios --profile preview
```

### Android Build
```bash
# Build for Google Play
eas build --platform android --profile production

# Build APK for testing
eas build --platform android --profile preview
```

### Build Both Platforms
```bash
eas build --platform all --profile production
```

## 🌐 Web Deployment

### Build for Web
```bash
npx expo export --platform web
```

### Deploy to Netlify
1. Build the web version
2. Upload `dist` folder to Netlify
3. Configure redirects for SPA routing

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📤 App Store Submission

### iOS App Store
```bash
# Submit to App Store Connect
eas submit --platform ios
```

Requirements:
- Apple Developer Account ($99/year)
- App Store Connect app configured
- App icons (1024x1024 for App Store)
- Screenshots for all device sizes
- App description and metadata

### Google Play Store
```bash
# Submit to Google Play Console
eas submit --platform android
```

Requirements:
- Google Play Developer Account ($25 one-time)
- Play Console app configured
- Feature graphic (1024x500)
- Screenshots for phones and tablets
- App description and metadata

## 🔧 Production Configuration

### Supabase Production Setup
1. Create new Supabase project for production
2. Run `supabase-schema.sql` in SQL Editor
3. Configure RLS policies
4. Set up storage bucket with proper permissions
5. Update environment variables

### Clerk Production Setup
1. Create production Clerk application
2. Configure allowed origins for your domains
3. Set up social sign-in providers
4. Update webhook endpoints if using
5. Update environment variables

### Environment Variables for Production
```env
# Production Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Production Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-production-key
CLERK_SECRET_KEY=sk_live_your-production-secret

# Optional: Analytics, Crash Reporting
EXPO_PUBLIC_ANALYTICS_KEY=your-analytics-key
```

## 📊 Monitoring & Analytics

### Recommended Services
- **Crash Reporting**: Sentry, Bugsnag
- **Analytics**: Amplitude, Mixpanel
- **Performance**: Flipper, Reactotron
- **User Feedback**: Instabug, Shake

### Setup Example (Sentry)
```bash
npm install @sentry/react-native
```

Add to App.tsx:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: eas build --platform all --non-interactive
```

## 🚀 Post-Deployment

### 1. Testing in Production
- [ ] Download app from stores
- [ ] Test all critical user flows
- [ ] Verify real-time features work
- [ ] Check analytics are tracking
- [ ] Monitor crash reports

### 2. User Onboarding
- [ ] Create user documentation
- [ ] Set up customer support
- [ ] Prepare marketing materials
- [ ] Plan user acquisition strategy

### 3. Monitoring
- [ ] Set up error alerts
- [ ] Monitor app performance
- [ ] Track user engagement
- [ ] Monitor server costs

## 🔧 Troubleshooting

### Common Build Issues
1. **Metro bundler errors**: Clear cache with `npx expo start --clear`
2. **Dependency conflicts**: Use `--legacy-peer-deps` flag
3. **iOS build fails**: Check provisioning profiles and certificates
4. **Android build fails**: Verify keystore and signing config

### Common Runtime Issues
1. **Supabase connection**: Check URL and API keys
2. **Clerk authentication**: Verify allowed origins
3. **Real-time not working**: Check RLS policies
4. **Images not loading**: Verify storage bucket permissions

## 📞 Support

For deployment issues:
- Check Expo documentation
- Review Supabase guides
- Consult Clerk documentation
- Join community forums

---

**Ready to share yoga with the world!** 🧘‍♀️✨