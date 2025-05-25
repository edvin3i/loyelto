import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo's built-in icons instead
import { useAuthStore } from './stores/authStore';
import ApiTest from './components/ApiTest';

export default function LoginChoiceScreen() {
  const router = useRouter();
  const { isAuthenticated, setUserRole, logout } = useAuthStore();
  const [showApiTest, setShowApiTest] = useState(false);

  const handleConsumerLogin = () => {
    // Set user role as consumer
    setUserRole('consumer');
    
    if (isAuthenticated) {
      // If already authenticated, go directly to consumer interface
      router.replace('/(tabs)');
    } else {
      // If not authenticated, go to login first
      router.push('/auth/login?role=consumer');
    }
  };

  const handleBusinessLogin = () => {
    // Set user role as business
    setUserRole('business');
    
    if (isAuthenticated) {
      // If already authenticated, go directly to business interface
      router.replace('/business-management');
    } else {
      // If not authenticated, go to login first
      router.push('/auth/login?role=business');
    }
  };

  const handleLogout = async () => {
    await logout();
    // Stay on login choice screen after logout
  };

  // Show API test screen if requested
  if (showApiTest) {
    return <ApiTest onBack={() => setShowApiTest(false)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {isAuthenticated && (
      <View style={styles.userHeader}>
        <Text style={styles.welcomeText}>
            Welcome back! Choose your account type
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      )}
      
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>LoyelTo</Text>
        <Text style={styles.tagline}>Your Loyalty, Your Rewards</Text>
        
        {/* API Test Button */}
        <TouchableOpacity 
          style={styles.apiTestButton}
          onPress={() => setShowApiTest(true)}
        >
          <FontAwesome name="cog" size={16} color="white" />
          <Text style={styles.apiTestButtonText}> API Test</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.choiceContainer}>
        <Text style={styles.choiceTitle}>Choose your account type</Text>
        
        <TouchableOpacity 
          style={styles.choiceButton}
          onPress={handleConsumerLogin}
        >
          <View style={styles.choiceLeftContent}>
          <View style={styles.iconContainer}>
            <FontAwesome name="user" size={40} color="#0082FF" />
          </View>
          <View style={styles.choiceTextContainer}>
              <Text style={styles.choiceButtonTitle}>Consumer</Text>
            <Text style={styles.choiceButtonDescription}>
              Collect points, redeem rewards, and discover local businesses
            </Text>
          </View>
          </View>
          <FontAwesome name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.choiceButton}
          onPress={handleBusinessLogin}
        >
          <View style={styles.choiceLeftContent}>
          <View style={styles.iconContainer}>
            <FontAwesome name="building" size={40} color="#0082FF" />
          </View>
          <View style={styles.choiceTextContainer}>
            <Text style={styles.choiceButtonTitle}>Business</Text>
            <Text style={styles.choiceButtonDescription}>
              Manage your loyalty program, create offers, and grow your customer base
            </Text>
          </View>
          </View>
          <FontAwesome name="chevron-right" size={20} color="#ccc" />
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
    justifyContent: 'space-between',
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
  choiceLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  apiTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  apiTestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});