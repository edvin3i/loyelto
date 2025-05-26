import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useLoginWithEmail } from '@privy-io/expo';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userRole, setUserRole } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Privy email login hook
  const { sendCode, loginWithCode } = useLoginWithEmail();
  
  // Get the role from URL params or use the current userRole
  const selectedRole = (params.role as 'consumer' | 'business') || userRole;

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await sendCode({ email });
      setCodeSent(true);
      Alert.alert('Code Sent', 'Please check your email for the verification code');
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
      console.error('Send code error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithCode = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    try {
      await loginWithCode({ code, email });
      
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
      Alert.alert('Login Failed', 'Invalid verification code. Please try again.');
      console.error('Login with code error:', error);
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

        {/* Email Login with OTP */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!codeSent}
          />
          
          {codeSent && (
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCorrect={false}
            />
          )}

          {!codeSent ? (
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Send Code</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLoginWithCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={() => {
                  setCodeSent(false);
                  setCode('');
                }}
              >
                <Text style={styles.resendButtonText}>Change Email</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Demo Login Option */}
        <TouchableOpacity 
          style={[styles.demoButton, isLoading && styles.buttonDisabled]}
          onPress={handleTestLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#0082FF" />
          ) : (
            <Text style={styles.demoButtonText}>Continue with Demo Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.demoNote}>
          Enter your email to receive a one-time password for secure login via Privy.
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
  button: {
    backgroundColor: '#0082FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 10,
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
  resendButton: {
    alignItems: 'center',
    padding: 10,
  },
  resendButtonText: {
    color: '#0082FF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#0082FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  demoButtonText: {
    color: '#0082FF',
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
}); 