import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function HomeScreen() {
  useEffect(() => {
    // Automatically redirect to the main tabs interface
    // You can add authentication logic here later
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1000); // Show loading for 1 second

    return () => clearTimeout(timer);
  }, []);

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