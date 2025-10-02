import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthService } from '../services/AuthService';

// Define stack params (extend as you add screens)
type RootStackParamList = {
  Dashboard: undefined;
  EnterToken: undefined;
  ManualSale: undefined;
  History: undefined;
  Reports: undefined;
  Settings: undefined;
  Login: undefined;
};

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const { width } = Dimensions.get('window');
const tileWidth = (width - 48) / 2; // Responsive 2-column grid

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const handleLogout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  const navigateTo = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  const renderTile = (title: string, iconName: string, screen: keyof RootStackParamList) => (
    <TouchableOpacity
      style={[styles.tile, { width: tileWidth }]}
      onPress={() => navigateTo(screen)}
      activeOpacity={0.7}
    >
      <View style={styles.tileContent}>
        <Icon name={iconName as any} size={48} color="#007AFF" />
        <Text style={styles.tileTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.welcomeText}>Welcome, Pump Attendant</Text>
        <View style={styles.grid}>
          {renderTile('Enter Token', 'qr-code', 'EnterToken')}
          {renderTile('Manual Sale', 'sell', 'ManualSale')}
          {renderTile('History', 'history', 'History')}
          {renderTile('Reports', 'assessment', 'Reports')}
          {renderTile('Settings', 'settings', 'Settings')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007AFF',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  logoutButton: { padding: 8 },
  body: { flex: 1 },
  bodyContent: { padding: 16 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tileContent: { alignItems: 'center', padding: 20 },
  tileTitle: { marginTop: 8, fontSize: 16, fontWeight: '500', textAlign: 'center' },
});

export default DashboardScreen;