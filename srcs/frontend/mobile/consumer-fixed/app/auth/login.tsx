import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userRole, setUserRole, privyHandshake } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the role from URL params or use the current userRole
  const selectedRole = (params.role as 'consumer' | 'business') || userRole;

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate a successful authentication
      // In a real app, you would integrate with Privy or your auth provider
      
      // For demo purposes, we'll just set a mock token
      const mockToken = 'mock_privy_token_' + Date.now();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would normally be handled by your actual auth provider
      // await privyHandshake(mockToken);
      
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
    <View style={styles.container}>
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

        <Text style={styles.demoNote}>
          This is a demo login. In production, this would integrate with Privy or your preferred authentication provider.
        </Text>
      </View>
    </View>
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
}); 