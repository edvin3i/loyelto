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
      <ThemedView style={styles_scan_qr_result.container}>

        <ThemedView style={styles_scan_qr_result.content}>
          <View style={styles_scan_qr_result.successIcon}>
            <FontAwesome name="check-circle" size={64} color="#0082FF" />
          </View>
          
          <ThemedText style={styles_scan_qr_result.successText}>Customer identified!</ThemedText>
          
          <ThemedView style={styles_scan_qr_result.customerCard}>
            <View style={styles_scan_qr_result.customerInfo}>
              <ThemedText style={styles_scan_qr_result.customerName}>{name}</ThemedText>
              <ThemedText style={styles_scan_qr_result.customerId}>ID: {customerId}</ThemedText>
              <View style={styles_scan_qr_result.pointsContainer}>
                <ThemedText style={styles_scan_qr_result.pointsValue}>{points}</ThemedText>
                <ThemedText style={styles_scan_qr_result.pointsLabel}>points</ThemedText>
              </View>
            </View>
          </ThemedView>
          
          <View style={styles_scan_qr_result.actionsContainer}>
            <TouchableOpacity 
              style={styles_scan_qr_result.addPointsButton}
              onPress={handleAddPoints}
            >
              <ThemedText style={styles_scan_qr_result.buttonText}>Add Points</ThemedText>
              <FontAwesome name="plus" size={16} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles_scan_qr_result.redeemButton}
              onPress={() => alert('Redeem offer feature would open here')}
            >
              <ThemedText style={styles_scan_qr_result.buttonText}>Redeem Offer</ThemedText>
              <FontAwesome name="gift" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles_scan_qr_result.scanAgainButton}
            onPress={handleBackToScan}
          >
            <ThemedText style={styles_scan_qr_result.scanAgainText}>Scan Another Code</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <BusinessNavBar />
      </ThemedView>
    </>
  );
}

// Remove the styles constant from here