# EAS Build Setup Guide

## 🚀 **Step-by-Step Build Process**

### **Step 1: Navigate to Project Directory**
```bash
cd "Yoga Flow/Yogaflow"
```

### **Step 2: Install EAS CLI (if not already installed)**
```bash
npm install -g @expo/eas-cli
```

### **Step 3: Login to EAS**
```bash
eas login
```

### **Step 4: Configure Environment Variables**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://ztkantfywkokupkoligq.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0a2FudGZ5d2tva3Vwa29saWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTQ5NDcsImV4cCI6MjA3NTEzMDk0N30.1iZrv3B48FYDP4fK5qo8n2Jml01F0zJ4ofAv1A0fAcM"
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_test_c3VpdGVkLXRhcnBvbi0xMC5jbGVyay5hY2NvdW50cy5kZXYk"
eas secret:create --scope project --name EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME --value "do0kmajvs"
eas secret:create --scope project --name EXPO_PUBLIC_CLOUDINARY_API_KEY --value "964236748542784"
eas secret:create --scope project --name EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET --value "yoga_flow_uploads"
```

### **Step 5: Build for Production**
```bash
# For APK (testing)
eas build --platform android --profile preview

# For Play Store (production)
eas build --platform android --profile production
```

## 🔧 **Updated EAS Configuration**

The `eas.json` file is already configured with:
- **Development**: For development builds
- **Preview**: For APK testing builds
- **Production**: For Play Store builds

## 📱 **Build Profiles Explained**

### **Preview Profile (APK for testing):**
- Generates APK file
- Can be installed directly on devices
- Good for testing before Play Store submission

### **Production Profile (AAB for Play Store):**
- Generates App Bundle (AAB)
- Optimized for Play Store
- Auto-increments version numbers

## 🛠 **Troubleshooting Commands**

### **Check EAS Status:**
```bash
eas whoami
eas project:info
```

### **List Environment Variables:**
```bash
eas secret:list
```

### **Delete and Recreate Secrets (if needed):**
```bash
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
# Then recreate with correct value
```

### **Build with Verbose Logging:**
```bash
eas build --platform android --profile production --verbose
```

## 🎯 **Quick Build Commands**

### **For Testing (APK):**
```bash
cd "Yoga Flow/Yogaflow"
eas build --platform android --profile preview
```

### **For Production (Play Store):**
```bash
cd "Yoga Flow/Yogaflow"
eas build --platform android --profile production
```

## ✅ **Pre-Build Checklist**

- [ ] Navigate to correct directory (`Yoga Flow/Yogaflow`)
- [ ] EAS CLI installed and logged in
- [ ] Environment variables configured
- [ ] App.json has correct package name
- [ ] All dependencies installed (`npm install`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)

## 🚨 **Common Issues & Solutions**

### **"Run this command inside a project directory"**
- **Solution**: Make sure you're in the `Yogaflow` directory, not the parent directory

### **"Missing environment variables"**
- **Solution**: Use `eas secret:create` commands above

### **"Build failed"**
- **Solution**: Check build logs for specific errors
- Run `eas build:list` to see recent builds and logs

### **"App crashes on device"**
- **Solution**: The error boundaries we added should now show specific error messages instead of generic crashes

## 🎉 **Success Indicators**

When the build succeeds, you'll get:
1. **Build URL**: Link to download APK/AAB
2. **QR Code**: For easy device installation
3. **Build ID**: For tracking and logs

The app should now install and run without the "app has a bug" error thanks to our comprehensive error handling!