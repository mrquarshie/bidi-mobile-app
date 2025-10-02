import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
// Import other screens as you create them
// import EnterTokenScreen from '../screens/EnterTokenScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      {/* Add screens */}
      {/* <Stack.Screen name="EnterToken" component={EnterTokenScreen} /> */}
      <Stack.Screen name="Login" component={() => <Text>Login Screen Stub</Text>} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;