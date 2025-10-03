# Bidi Mobile App

A React Native mobile application for Bidi services.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Install dependencies:**
   ```bash
   cd BidiMobileApp
   npm install
   ```

2. **iOS Setup (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Android Setup:**
   - Make sure Android Studio is installed
   - Set up Android SDK and emulator
   - No additional setup required for Android

### Running the App

**Start Metro bundler:**
```bash
npm start
```

**Run on Android:**
```bash
npm run android
```

**Run on iOS:**
```bash
npm run ios
```

### Project Structure

```
BidiMobileApp/
├── src/
│   ├── navigation/
│   │   └── appnavigator.tsx
│   ├── screens/
│   │   ├── dashboardscreen.tsx
│   │   ├── entertokenscreen.tsx
│   │   └── loginscreen.tsx
│   ├── services/
│   │   └── authservice.ts
│   └── types/
│       └── navigation.ts
├── android/
├── ios/
├── App.tsx
├── index.js
├── package.json
├── babel.config.js
├── metro.config.js
└── tsconfig.json
```

### Features

- **Login Screen**: Token-based authentication
- **Dashboard**: Main navigation hub with tiles for different features
- **Enter Token**: Screen for token input functionality
- **Navigation**: Stack-based navigation using React Navigation
- **Authentication**: AsyncStorage-based token management

### Dependencies

- React Native 0.75.4
- React Navigation 6.x
- React Native Paper (Material Design components)
- React Native Vector Icons
- AsyncStorage for data persistence

### Troubleshooting

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build issues**: Clean with `cd android && ./gradlew clean`
3. **iOS build issues**: Clean with `cd ios && xcodebuild clean`
4. **Vector icons not showing**: Make sure to run `npx react-native link react-native-vector-icons` (if needed)

### Development Notes

- The app starts with the Login screen
- After successful login, users are taken to the Dashboard
- All screens are properly typed with TypeScript
- Navigation is handled through React Navigation stack navigator
