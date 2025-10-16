# Production Debug Guide

## 🚨 **Common Production Issues Fixed**

### **1. Error Boundaries Added**
- **Global Error Boundary**: Catches all React errors
- **Graceful Fallbacks**: Shows user-friendly error messages
- **Retry Functionality**: Allows users to recover from errors

### **2. Environment Variable Validation**
- **Runtime Validation**: Checks all required env vars on startup
- **Clear Error Messages**: Shows exactly which variables are missing
- **Fallback Handling**: Prevents crashes from missing config

### **3. Video Loading Protection**
- **Error Handling**: Catches video loading failures
- **Fallback Background**: Shows colored background if video fails
- **Automatic Skip**: Continues to app even if video fails

### **4. Service Initialization Safety**
- **Supabase**: Safe initialization with null checks
- **Clerk**: Proper validation before provider creation
- **Graceful Degradation**: App continues even with service failures

## 🔧 **Debugging Steps**

### **Step 1: Check Environment Variables**
Ensure these are set in EAS:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### **Step 2: Verify EAS Build Configuration**
Check `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your_url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your_key",
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "your_key"
      }
    }
  }
}
```

### **Step 3: Test Video Asset**
- Ensure `yoga.mp4` is in `src/assets/`
- Check file size (should be < 50MB for mobile)
- Verify video format compatibility (MP4 H.264)

### **Step 4: Check Build Logs**
```bash
eas build --platform android --profile production
```
Look for:
- Environment variable warnings
- Asset bundling errors
- Dependency resolution issues

## 🛠 **Quick Fixes Applied**

### **1. Safe Environment Loading**
```typescript
// Before (crashes if missing)
const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

// After (safe with validation)
const key = config.clerk.publishableKey;
const validation = validateEnvironment();
```

### **2. Error Boundary Wrapper**
```typescript
// All components now wrapped in ErrorBoundary
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### **3. Video Error Handling**
```typescript
// Added error handlers for video loading
onError={handleVideoError}
onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
```

## 📱 **Testing Production Build**

### **Local Testing:**
```bash
# Build locally
eas build --platform android --profile production --local

# Install and test
adb install your-app.apk
```

### **Remote Testing:**
```bash
# Build on EAS
eas build --platform android --profile production

# Download and test APK
```

## 🔍 **Common Error Patterns**

### **1. "App has a bug" - Usually means:**
- Missing environment variables
- Uncaught JavaScript errors
- Network configuration issues
- Asset loading failures

### **2. "Configuration Error" - Check:**
- EAS environment variables
- Build profile settings
- Asset bundling

### **3. Video Not Playing:**
- File format compatibility
- File size limits
- Asset path resolution

## ✅ **Verification Checklist**

- [ ] All environment variables set in EAS
- [ ] Error boundaries implemented
- [ ] Video error handling added
- [ ] Service initialization protected
- [ ] Build completes without warnings
- [ ] APK installs successfully
- [ ] App launches without crashes
- [ ] All screens accessible
- [ ] Authentication works
- [ ] Database connections successful

## 🚀 **Next Steps**

1. **Rebuild with fixes**: `eas build --platform android --profile production`
2. **Test thoroughly**: Install APK and test all features
3. **Monitor logs**: Check for any remaining issues
4. **Deploy confidently**: Upload to Play Store

The app should now be production-ready with comprehensive error handling and graceful fallbacks!