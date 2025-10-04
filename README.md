# Yoga Flow 🧘‍♀️

A complete React Native app inspired by Rishikesh, the yoga capital of the world. Join live classes, watch yoga videos, chat with the community, read blogs, and explore free asanas.

## 🌟 Features

- **Onboarding Animation**: Beautiful Lottie animation on first launch
- **Live & Recorded Classes**: Join real-time sessions or watch recordings
- **Real-time Community Chat**: Connect with fellow practitioners
- **Blog & Research**: Read insights and ancient wisdom
- **Free Asanas Library**: Learn poses with detailed guides
- **Contact Form**: Get in touch with instructors
- **Authentication**: Secure sign-in with Clerk
- **Real-time Updates**: Powered by Supabase Realtime

## 🛠️ Tech Stack

- **Frontend**: Expo (React Native)
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Authentication**: Clerk
- **Backend**: Supabase (Storage + Realtime + Auth)
- **Database**: Prisma ORM with PostgreSQL
- **Video**: expo-av
- **Animation**: lottie-react-native
- **Styling**: NativeWind (Tailwind for React Native)

## 📱 Screens

1. **Home/About Us** - Hero section with mission, vision, and features
2. **Classes** - Live and recorded yoga classes
3. **Community** - Real-time chat rooms
4. **Blog & Research** - Articles and insights
5. **Asanas** - Free yoga poses library
6. **Contact** - Contact form and information
7. **Onboarding** - First-time user experience

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

1. **Clone and setup**:
   ```bash
   cd Yogaflow
   npm install --legacy-peer-deps
   ```

2. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Add your Supabase and Clerk credentials (see Environment Variables section)

3. **Database Setup**:
   - The app uses Prisma ORM for database management
   - Run `npx prisma db push` to sync the schema with your Supabase database
   - Run `npx prisma db seed` to populate sample data (if seed script is available)

4. **Start the app**:
   ```bash
   npm start
   ```

5. **Run on device**:
   - Scan QR code with Expo Go app
   - Or press `i` for iOS simulator, `a` for Android emulator

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
```

### Getting API Keys

#### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy your Project URL and anon public key
4. The database schema is managed by Prisma - no manual SQL setup required
5. Go to Storage → Create bucket named "videos" (private)

#### Clerk Setup
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Copy Publishable Key and Secret Key
4. Add your app's scheme to Allowed Origins in Clerk dashboard

## 📁 Project Structure

```
src/
├── assets/              # Images and Lottie animations
├── components/          # Reusable UI components
├── screens/            # App screens
│   ├── HomeScreen.tsx
│   ├── ClassesScreen.tsx
│   ├── CommunityScreen.tsx
│   ├── BlogScreen.tsx
│   ├── AsanasScreen.tsx
│   ├── ContactScreen.tsx
│   └── OnboardingScreen.tsx
├── services/           # API and external services
│   ├── supabase.ts     # Supabase client (auth & storage)
│   ├── database.ts     # Prisma database service
│   ├── clerk.ts
│   └── uploads.ts
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
└── utils/             # Utility functions
```

## 🗄️ Database Schema

The app uses Prisma ORM with the following PostgreSQL tables:

- **users** - User profiles synced with Clerk
- **classes** - Live and recorded yoga classes
- **videos** - Video metadata and storage paths
- **asanas** - Yoga poses with instructions
- **blog_posts** - Articles and insights
- **messages** - Community chat messages
- **contact_messages** - Contact form submissions

## 🔐 Authentication Flow

1. Users sign up/in through Clerk
2. User data is synced to Supabase `users` table
3. Row Level Security policies control data access
4. Real-time subscriptions work with authenticated users

## 💬 Real-time Features

- **Community Chat**: Live messaging with Supabase Realtime
- **Class Updates**: Real-time class status changes
- **New Content**: Instant updates for new blog posts and asanas

## 🎨 Design System

- **Colors**: Calming greens and earth tones
- **Typography**: Clean and minimal
- **Theme**: Peaceful yoga aesthetic
- **Background**: River and jungle imagery from Rishikesh

## 📱 Platform Support

- ✅ iOS
- ✅ Android  
- ✅ Web (Expo Web)

## 🧪 Testing

Run the app in development:

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

## 🚀 Deployment

### Building for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for app stores
eas build --platform all
```

### Environment for Production

Make sure to:
1. Update environment variables for production
2. Configure Clerk for production domains
3. Set up Supabase production database
4. Test all real-time features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the spiritual beauty of Rishikesh
- Built with love for the global yoga community
- Thanks to all the amazing open-source libraries used

## 🔧 Troubleshooting

### Common Issues

**Metro bundler errors:**
```bash
npx expo start --clear
```

**Dependency conflicts:**
```bash
npm install --legacy-peer-deps
```

**Missing expo-web-browser error:**
```bash
npm install --legacy-peer-deps expo-web-browser expo-crypto expo-auth-session
```

**TypeScript errors:**
```bash
npx tsc --noEmit
```

**Environment variables not loading:**
- Make sure `.env` file is in the root directory
- Restart the development server after changing `.env`

## 📞 Support

For questions or support:
- Email: hello@yogaflow.com
- Create an issue in this repository
- Join our community chat in the app

---

**Namaste** 🙏

*Experience authentic yoga with modern convenience*