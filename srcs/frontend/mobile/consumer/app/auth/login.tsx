import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/login-choice');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login();
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>LoyelTo</Text>
        <Text style={styles.tagline}>Your Loyalty, Your Rewards</Text>
      </View>
      
      <View style={styles.loginContainer}>
        <FontAwesome name="shield" size={80} color="#0082FF" style={styles.icon} />
        
        <Text style={styles.title}>Welcome to LoyelTo</Text>
        <Text style={styles.subtitle}>
          Connect your wallet and start earning loyalty rewards
        </Text>
        
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.description}>
          We use Privy to securely manage your wallet and authentication
        </Text>
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#0082FF',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
}); 