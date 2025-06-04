# Loyelto Mobile App (Consumer)

A React Native/Expo mobile application for the Loyelto loyalty platform, built with modern authentication using Privy and optimized for both iOS and Android.

## 📱 About

Loyelto is a loyalty platform mobile application that allows consumers to:
- Authenticate using Privy (Web3 authentication)
- Manage loyalty points and rewards
- Interact with businesses and their loyalty programs
- Swap points between different programs

## 🛠 Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

1. **Node.js** (version 20.11.0)
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use Node Version Manager (nvm):
     ```bash
     # Install nvm (macOS/Linux)
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     
     # Install and use the correct Node version
     nvm install 20.11.0
     nvm use 20.11.0
     ```

2. **npm** (comes with Node.js) or **yarn**
   ```bash
   # Check if npm is installed
   npm --version
   
   # Or install yarn globally (optional)
   npm install -g yarn
   ```

3. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

4. **Git**
   - Download from [git-scm.com](https://git-scm.com/)

### Mobile Development Setup

#### For iOS Development (macOS only)
1. **Xcode** (latest version from Mac App Store)
2. **iOS Simulator** (included with Xcode)
3. **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

#### For Android Development
1. **Android Studio** - [Download here](https://developer.android.com/studio)
2. **Android SDK** (installed through Android Studio)
3. **Android Emulator** (setup through Android Studio)

#### For Physical Device Testing
1. **Expo Go app** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd loyelto/srcs/frontend/mobile/consumer-fixed
```

### 2. Install Node.js Version
```bash
# If using nvm, the .nvmrc file will set the correct version
nvm use
```

### 3. Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 4. Environment Setup
Create environment configuration files if needed (check with your backend team for required environment variables).

## 🏃‍♂️ Running the Application

### Development Server
```bash
# Start the Expo development server
npm start

# Or with cache clearing
npm run start:clean

# For legacy Node.js compatibility
npm run start:legacy
```

This will open the Expo Developer Tools in your browser and show a QR code.

### Running on Different Platforms

#### On iOS Simulator (macOS only)
```bash
npm run ios
```

#### On Android Emulator
```bash
npm run android
```

#### On Physical Device
1. Install Expo Go app on your phone
2. Run `npm start`
3. Scan the QR code with:
   - **iOS**: Camera app or Expo Go app
   - **Android**: Expo Go app

#### Web Browser (for testing)
```bash
npm run web
```

## 📁 Project Structure 

## 🔧 Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type safety
- **Expo Router**: File-based navigation
- **Privy**: Web3 authentication
- **Tanstack Query**: Data fetching and caching
- **React Hook Form**: Form management
- **Zustand**: State management
- **Zod**: Schema validation

## 📱 Features

- **Authentication**: Secure Web3 authentication with Privy
- **Cross-platform**: Runs on iOS, Android, and web
- **Modern UI**: Native-feeling interface with Expo
- **Loyalty Management**: Points tracking and rewards
- **Business Integration**: Connect with loyalty programs
- **Offline Support**: Basic offline capabilities
- **Type Safety**: Full TypeScript support

## 🐛 Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
# Clear cache and restart
npm run start:clean
```

#### Node.js compatibility
```bash
# Use legacy OpenSSL provider
npm run start:legacy
```

#### iOS Simulator not working
```bash
# Reset iOS Simulator
xcrun simctl erase all
```

#### Android Emulator issues
1. Ensure Android Studio is properly installed
2. Check that ANDROID_HOME environment variable is set
3. Verify that an Android Virtual Device (AVD) is created

#### Dependency issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

1. **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev/)
2. **React Native Documentation**: [reactnative.dev](https://reactnative.dev/)
3. **Privy Documentation**: [docs.privy.io](https://docs.privy.io/)

## 🔄 Development Workflow

1. **Start Development Server**: `npm start`
2. **Make Changes**: Edit files in the `app/` directory
3. **Hot Reload**: Changes will automatically reflect in the app
4. **Test on Multiple Platforms**: Use iOS, Android, and web
5. **Build for Production**: Use `eas build` (requires Expo Application Services)

## 📦 Building for Production

For production builds, you'll need to set up Expo Application Services (EAS):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🤝 Contributing

1. Follow the existing code style and TypeScript patterns
2. Test on both iOS and Android before submitting
3. Ensure all TypeScript types are properly defined
4. Update documentation for new features

## 📄 License

[Your License Here]

---

**Happy coding! 🚀**

For additional help or questions, contact the development team.