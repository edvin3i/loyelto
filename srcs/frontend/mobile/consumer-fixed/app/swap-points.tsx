import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import styles from './utils/styles_swap_points';

export default function SwapPointsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { storeId, storeName, storeIcon } = params;
  
  // This would come from your API in a real app
  const [availableSwaps, setAvailableSwaps] = useState([
    {
      id: 1,
      name: 'Pizza place Paris',
      icon: '🍕',
      maxPoints: 1165,
      givePoints: '100',
      getPoints: 50,
      getStore: 'Best Coffee Shop Clichy',
      getStoreIcon: '☕',
      exchangeRate: 0.5 // 1 point from source = 0.5 points in destination
    },
    // Add more swap options as needed
  ]);

  // Update getPoints when givePoints changes
  const updateSwapPoints = (id, newGivePoints) => {
    setAvailableSwaps(prevSwaps => 
      prevSwaps.map(swap => {
        if (swap.id === id) {
          // Ensure input is a valid number
          const numericValue = newGivePoints.replace(/[^0-9]/g, '');
          const givePointsNum = numericValue === '' ? 0 : parseInt(numericValue, 10);
          
          // Calculate new getPoints based on exchange rate
          const newGetPoints = Math.floor(givePointsNum * swap.exchangeRate);
          
          return {
            ...swap,
            givePoints: numericValue,
            getPoints: newGetPoints
          };
        }
        return swap;
      })
    );
  };
  
  return (
    <>
      {/* Configure the header to show the default back button */}
      <Stack.Screen 
        options={{ 
          title: "Swap Your Points",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '500',
          },
          headerBackTitle: "Back",  // This sets the back button text to "Back"
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Removed the custom header with back button */}
        
        {availableSwaps.map((swap) => (
          <View key={swap.id} style={styles.swapContainer}>
            <View style={styles.swapSection}>
              <ThemedText style={styles.sectionTitle}>You give</ThemedText>
              <View style={styles.pointsDisplay}>
                <TextInput
                  style={styles.pointsInput}
                  value={swap.givePoints}
                  onChangeText={(text) => updateSwapPoints(swap.id, text)}
                  keyboardType="numeric"
                  maxLength={5}
                  placeholder="0"
                />
                <ThemedText style={styles.pointsIcon}>{swap.icon}</ThemedText>
                <ThemedText style={styles.pointsLabel}>points</ThemedText>
              </View>
              <ThemedText style={styles.storeName}>{swap.name}</ThemedText>
              <ThemedText style={styles.maxPoints}>Max: {swap.maxPoints} points</ThemedText>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.swapSection}>
              <ThemedText style={styles.sectionTitle}>You will get</ThemedText>
              <View style={styles.pointsDisplay}>
                <ThemedText style={styles.pointsValue}>{swap.getPoints}</ThemedText>
                <ThemedText style={styles.pointsIcon}>{swap.getStoreIcon}</ThemedText>
                <ThemedText style={styles.pointsLabel}>points</ThemedText>
              </View>
              <ThemedText style={styles.storeName}>{swap.getStore}</ThemedText>
            </View>
            
            <TouchableOpacity style={styles.swapButton}>
              <ThemedText style={styles.swapButtonText}>↑↓</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => {
            // Add your confirmation logic here
            console.log('Swap confirmed:', availableSwaps);
            router.back();
          }}
        >
          <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}