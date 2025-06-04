import { useEffect } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useAuthStore } from '../utils/providers/stores/authStore';

export default function HomeScreen() {
  const { isAuthenticated, userRole, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if user is already authenticated
      await checkAuthStatus();
      
      // Navigate based on authentication and role status
      setTimeout(() => {
        if (isAuthenticated && userRole) {
          // User is authenticated and has selected a role
          if (userRole === 'consumer') {
            router.replace('/(tabs)');
          } else if (userRole === 'business') {
            router.replace('/business-management');
          }
        } else {
          // User needs to authenticate or choose role
          router.replace('/login-choice');
        }
      }, 1500); // Show loading for 1.5 seconds
    };

    initializeAuth();
  }, [isAuthenticated, userRole, checkAuthStatus]);

  return (
    <ThemedView style={{ 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
      backgroundColor: '#F5F8FF' 
    }}>
      <ThemedText style={{ 
        fontSize: 32, 
    fontWeight: 'bold',
    color: '#0082FF',
        marginBottom: 20 
      }}>
        Loyelto
      </ThemedText>
      <ActivityIndicator size="large" color="#0082FF" />
      <ThemedText style={{ 
    fontSize: 16,
    color: '#666',
        marginTop: 20 
      }}>
        Loading your loyalty experience...
      </ThemedText>
    </ThemedView>
  );
}