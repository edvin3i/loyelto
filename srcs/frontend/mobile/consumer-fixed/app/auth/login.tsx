import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { usePrivyAuth } from '../hooks/usePrivyAuth';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userRole, setUserRole, privyHandshake } = useAuthStore();
  const { 
    ready, 
    authenticated, 
    login, 
    loginWithEmailAndPassword, 
    loginWithPhoneNumber,
    isLoading: privyLoading 
  } = usePrivyAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'demo'>('email');
  
  // Get the role from URL params or use the current userRole
  const selectedRole = (params.role as 'consumer' | 'business') || userRole;

  // Handle successful Privy authentication
  useEffect(() => {
    if (ready && authenticated) {
      // Set the user role if it was passed as parameter
      if (selectedRole) {
        setUserRole(selectedRole);
      }

      // Navigate based on role
      if (selectedRole === 'consumer') {
        router.replace('/(tabs)');
      } else if (selectedRole === 'business') {
        router.replace('/business-management');
      } else {
        router.replace('/login-choice');
      }
    }
  }, [ready, authenticated, selectedRole]);

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await loginWithEmailAndPassword(email);
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your email and try again');
      console.error('Email login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    setIsLoading(true);
    try {
      await loginWithPhoneNumber(phone);
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your phone number and try again');
      console.error('Phone login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivyLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again');
      console.error('Privy login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll just set a mock token
      const mockToken = 'mock_privy_token_' + Date.now();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll manually set authentication state
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: 'demo_user',
          privy_id: 'demo_privy_id',
          email: 'demo@loyelto.com',
          phone: '+1234567890',
          created_at: new Date().toISOString(),
          role: selectedRole
        },
        privyToken: mockToken
      });

      // Set the user role if it was passed as parameter
      if (selectedRole) {
        setUserRole(selectedRole);
      }

      // Navigate based on role
      if (selectedRole === 'consumer') {
        router.replace('/(tabs)');
      } else if (selectedRole === 'business') {
        router.replace('/business-management');
      } else {
        router.replace('/login-choice');
      }
      
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = () => {
    if (selectedRole === 'consumer') return 'Consumer';
    if (selectedRole === 'business') return 'Business';
    return 'User';
  };

  const getRoleIcon = () => {
    if (selectedRole === 'consumer') return 'user';
    if (selectedRole === 'business') return 'building';
    return 'user-circle';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <FontAwesome name="chevron-left" size={24} color="#0082FF" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>LoyelTo</Text>
        <Text style={styles.subtitle}>Welcome to your loyalty experience</Text>
        
        <View style={styles.roleIndicator}>
          <FontAwesome name={getRoleIcon()} size={30} color="#0082FF" />
          <Text style={styles.roleText}>Logging in as {getRoleDisplay()}</Text>
        </View>

        {/* Login Method Selector */}
        <View style={styles.methodSelector}>
          <TouchableOpacity 
            style={[styles.methodButton, loginMethod === 'email' && styles.methodButtonActive]}
            onPress={() => setLoginMethod('email')}
          >
            <Text style={[styles.methodButtonText, loginMethod === 'email' && styles.methodButtonTextActive]}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.methodButton, loginMethod === 'phone' && styles.methodButtonActive]}
            onPress={() => setLoginMethod('phone')}
          >
            <Text style={[styles.methodButtonText, loginMethod === 'phone' && styles.methodButtonTextActive]}>Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.methodButton, loginMethod === 'demo' && styles.methodButtonActive]}
            onPress={() => setLoginMethod('demo')}
          >
            <Text style={[styles.methodButtonText, loginMethod === 'demo' && styles.methodButtonTextActive]}>Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Email Login */}
        {loginMethod === 'email' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[styles.button, (isLoading || privyLoading) && styles.buttonDisabled]}
              onPress={handleEmailLogin}
              disabled={isLoading || privyLoading}
            >
              {(isLoading || privyLoading) ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Continue with Email</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Phone Login */}
        {loginMethod === 'phone' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[styles.button, (isLoading || privyLoading) && styles.buttonDisabled]}
              onPress={handlePhoneLogin}
              disabled={isLoading || privyLoading}
            >
              {(isLoading || privyLoading) ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Continue with Phone</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Demo Login */}
        {loginMethod === 'demo' && (
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleTestLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Continue with Demo Login</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Privy Universal Login */}
        <TouchableOpacity 
          style={[styles.privyButton, (isLoading || privyLoading) && styles.buttonDisabled]}
          onPress={handlePrivyLogin}
          disabled={isLoading || privyLoading || !ready}
        >
          {(isLoading || privyLoading) ? (
            <ActivityIndicator color="#0082FF" />
          ) : (
            <Text style={styles.privyButtonText}>Login with Privy</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.demoNote}>
          Choose your preferred login method. Privy provides secure authentication with multiple options.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0082FF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  roleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    backgroundColor: '#0082FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  demoNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  methodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#0082FF',
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  privyButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#0082FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  privyButtonText: {
    color: '#0082FF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 