import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper'; // Optional: For Material UI, add "npm install react-native-paper"
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => (
  <PaperProvider>
    <AppNavigator />
  </PaperProvider>
);

export default App;