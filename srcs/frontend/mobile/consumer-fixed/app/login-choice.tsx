import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo's built-in icons instead
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../utils/providers/stores/authStore';
import ApiTest from './components/ApiTest';
import styles from './utils/styles_login_choice';

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
    </SafeAreaView>
  );
}