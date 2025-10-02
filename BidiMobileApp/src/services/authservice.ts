import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('userToken'); // Matches web localStorage
      // Add API call to invalidate session if needed
    } catch (error: unknown) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Add login method if in web repo
  static async login(token: string): Promise<void> {
    await AsyncStorage.setItem('userToken', token);
  }
}