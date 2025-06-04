import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useState, useEffect } from 'react';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  // Removed header and backButton styles since we're using the default header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    fontSize: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  swapContainer: {
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  swapSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
    lineHeight: 34,
  },
  pointsInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 80,
    padding: 0,
    color: '#000',
  },
  pointsIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  maxPoints: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 8,
  },
  swapButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  swapButtonText: {
    fontSize: 20,
  },
  confirmButton: {
    backgroundColor: '#D8E0F0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});