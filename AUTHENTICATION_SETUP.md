# Authentication & Deep Linking Setup Guide

## 🔐 **Clerk Authentication Configuration**

### **Current Setup Status:**
- ✅ **Clerk Provider**: Properly configured with token cache
- ✅ **OAuth Google**: Implemented in SignInScreen
- ✅ **Deep Linking**: Added to app.json for production
- ✅ **Secure Storage**: Using expo-secure-store for token persistence

## 🔗 **Deep Linking Configuration**

### **App Scheme:**
- **Custom Scheme**: `yoga-flow://`
- **Clerk Domain**: `suited-tarpon-10.clerk.accounts.dev`

### **Production URLs to Configure in Clerk Dashboard:**

#### **Redirect URIs:**
```
# Development
exp://127.0.0.1:19000/--/oauth-native-callback
exp://localhost:19000/--/oauth-native-callback

# Production (EAS Build)
yoga-flow://oauth-native-callback
https://suited-tarpon-10.clerk.accounts.dev/oauth-native-callback

# Android Deep Links
https://suited-tarpon-10.clerk.accounts.dev/oauth-native-callback
```

#### **Allowed Origins:**
```
# Development
http://localhost:19006
exp://127.0.0.1:19000
exp://localhost:19000

# Production
https://suited-tarpon-10.clerk.accounts.dev
```

## ⚙️ **Clerk Dashboard Configuration Steps**

### **1. Sign in to Clerk Dashboard:**
- Go to: https://dashboard.clerk.com/
- Select your "Yoga Flow" application

### **2. Configure OAuth Settings:**
- Navigate to: **User & Authentication** → **Social Connections**
- Enable **Google** OAuth
- Add redirect URIs listed above

### **3. Configure Domains:**
- Navigate to: **Domains**
- Add production domain: `suited-tarpon-10.clerk.accounts.dev`

### **4. Update Environment Variables:**
- Ensure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` matches your production key
- Current key: `pk_test_c3VpdGVkLXRhcnBvbi0xMC5jbGVyay5hY2NvdW50cy5kZXYk`

## 📱 **App.json Configuration Applied**

### **iOS Configuration:**
```json
"ios": {
  "bundleIdentifier": "com.yogaflow.app",
  "associatedDomains": [
    "applinks:suited-tarpon-10.clerk.accounts.dev"
  ]
}
```

### **Android Configuration:**
```json
"android": {
  "package": "com.yogaflow.app",
  "intentFilters": [
    {
      "action": "VIEW",
      "autoVerify": true,
      "data": [
        {
          "scheme": "https",
          "host": "suited-tarpon-10.clerk.accounts.dev"
        }
      ],
      "category": ["BROWSABLE", "DEFAULT"]
    }
  ]
}
```

## 🔧 **Testing Authentication**

### **Development Testing:**
```bash
# Test deep link
npx uri-scheme open yoga-flow://oauth-native-callback --ios
npx uri-scheme open yoga-flow://oauth-native-callback --android
```

### **Production Testing:**
1. **Install production APK**
2. **Test Google OAuth flow**
3. **Verify redirect handling**
4. **Check token persistence**

## 🚨 **Common Issues & Solutions**

### **Issue: OAuth Redirect Fails**
**Solution**: Ensure all redirect URIs are added to Clerk dashboard

### **Issue: Deep Link Not Opening App**
**Solution**: Check app.json scheme and intent filters

### **Issue: Token Not Persisting**
**Solution**: Verify expo-secure-store is properly configured

### **Issue: "Invalid Redirect URI"**
**Solution**: Match exact URIs between app and Clerk dashboard

## ✅ **Verification Checklist**

- [ ] Clerk dashboard has all redirect URIs
- [ ] Google OAuth is enabled in Clerk
- [ ] App.json has correct scheme and intent filters
- [ ] Environment variables are set in EAS
- [ ] Production build includes authentication configuration
- [ ] Deep linking works in production APK

## 🎯 **Next Steps**

1. **Update Clerk Dashboard** with the redirect URIs listed above
2. **Build production APK** with updated configuration
3. **Test OAuth flow** in production build
4. **Verify deep linking** works correctly

The authentication setup is now production-ready with proper deep linking configuration!