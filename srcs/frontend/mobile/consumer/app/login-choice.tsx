import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo's built-in icons instead
import { useAuth } from '@/providers/AuthProvider';

export default function LoginChoiceScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleCustomerLogin = () => {
    router.push('/(tabs)');
  };

  const handleBusinessLogin = () => {
    router.push('/business-management');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.userHeader}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.email || user?.phone || 'User'}
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>LoyelTo</Text>
        <Text style={styles.tagline}>Your Loyalty, Your Rewards</Text>
      </View>
      
      <View style={styles.choiceContainer}>
        <Text style={styles.choiceTitle}>Choose your account type</Text>
        
        <TouchableOpacity 
          style={styles.choiceButton}
          onPress={handleCustomerLogin}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="user" size={40} color="#0082FF" />
          </View>
          <View style={styles.choiceTextContainer}>
            <Text style={styles.choiceButtonTitle}>Customer</Text>
            <Text style={styles.choiceButtonDescription}>
              Collect points, redeem rewards, and discover local businesses
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.choiceButton}
          onPress={handleBusinessLogin}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="building" size={40} color="#0082FF" />
          </View>
          <View style={styles.choiceTextContainer}>
            <Text style={styles.choiceButtonTitle}>Business</Text>
            <Text style={styles.choiceButtonDescription}>
              Manage your loyalty program, create offers, and grow your customer base
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footerText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
    justifyContent: 'space-between',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0082FF',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  choiceContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 40,
  },
  choiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  choiceButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#F0F7FF',
    borderRadius: 30,
  },
  choiceTextContainer: {
    flex: 1,
  },
  choiceButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  choiceButtonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
});