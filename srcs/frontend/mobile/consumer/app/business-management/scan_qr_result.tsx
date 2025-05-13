import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import BusinessNavBar from './components/BusinessNavBar';
import styles_scan_qr_result from './styles/styles_scan_qr_result';

export default function ScanQRResultScreen() {
  // Get scan data from route params
  const params = useLocalSearchParams();
  const { 
    customerId = 'CUST-12345', 
    name = 'Julien', 
    points = '256' 
  } = params;

  const handleAddPoints = () => {
    // In a real app, this would open a points-adding dialog
    alert('Points would be added to the customer account');
  };

  const handleBackToScan = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={handleBackToScan} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <ThemedText type="title">Scan Result</ThemedText>
          <View style={{ width: 20 }} />
        </ThemedView>

        <ThemedView style={styles.content}>
          <View style={styles.successIcon}>
            <FontAwesome name="check-circle" size={64} color="#0082FF" />
          </View>
          
          <ThemedText style={styles.successText}>Customer identified!</ThemedText>
          
          <ThemedView style={styles.customerCard}>
            <View style={styles.customerInfo}>
              <ThemedText style={styles.customerName}>{name}</ThemedText>
              <ThemedText style={styles.customerId}>ID: {customerId}</ThemedText>
              <View style={styles.pointsContainer}>
                <ThemedText style={styles.pointsValue}>{points}</ThemedText>
                <ThemedText style={styles.pointsLabel}>points</ThemedText>
              </View>
            </View>
          </ThemedView>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.addPointsButton}
              onPress={handleAddPoints}
            >
              <ThemedText style={styles.buttonText}>Add Points</ThemedText>
              <FontAwesome name="plus" size={16} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.redeemButton}
              onPress={() => alert('Redeem offer feature would open here')}
            >
              <ThemedText style={styles.buttonText}>Redeem Offer</ThemedText>
              <FontAwesome name="gift" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={handleBackToScan}
          >
            <ThemedText style={styles.scanAgainText}>Scan Another Code</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <BusinessNavBar />
      </ThemedView>
    </>
  );
}

// Remove the styles constant from here