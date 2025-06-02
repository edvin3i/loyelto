import { View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
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
      <SafeAreaView style={styles_scan_qr_result.container} edges={['top']}>
        <ThemedView style={{ flex: 1 }}>

        <ThemedView style={styles_scan_qr_result.content}>
          <ThemedView style={styles_scan_qr_result.customerCard}>
            <View style={styles_scan_qr_result.cardContent}>
              <View style={styles_scan_qr_result.customerInfo}>
                <ThemedText style={styles_scan_qr_result.customerName}>{name}</ThemedText>
                <ThemedText style={styles_scan_qr_result.customerId}>ID: {customerId}</ThemedText>
              </View>
              
              <View style={styles_scan_qr_result.pointsContainer}>
                <ThemedText style={styles_scan_qr_result.pointsValue}>
                  {points}
                </ThemedText>
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
              <FontAwesome name="plus" size={16} color="black" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles_scan_qr_result.redeemButton}
              onPress={() => alert('Redeem offer feature would open here')}
            >
              <ThemedText style={styles_scan_qr_result.buttonText}>Redeem points</ThemedText>
              <FontAwesome name="minus" size={16} color="black" />
            </TouchableOpacity>
          </View>
          
          {/* Available Vouchers Section */}
          <View style={styles_scan_qr_result.vouchersSection}>
            <View style={styles_scan_qr_result.vouchersHeader}>
              <ThemedText style={styles_scan_qr_result.vouchersTitle}>Available vouchers</ThemedText>
              <View style={styles_scan_qr_result.vouchersBadge}>
                <ThemedText style={styles_scan_qr_result.vouchersBadgeText}>1</ThemedText>
              </View>
            </View>
            
            <View style={styles_scan_qr_result.voucherCard}>
              <View style={styles_scan_qr_result.voucherContent}>
                <View style={styles_scan_qr_result.voucherInfo}>
                  <ThemedText style={styles_scan_qr_result.voucherTitle}>Free Pizza Margarita</ThemedText>
                  <ThemedText style={styles_scan_qr_result.voucherDescription}>
                    Classic pizza with tomato sauce, mozzarella, and fresh basil
                  </ThemedText>
                </View>
                
                <View style={styles_scan_qr_result.voucherImageContainer}>
                  <Image 
                    source={{ uri: 'https://img.freepik.com/photos-gratuite/pizza-pizza-remplie-tomates-salami-olives_140725-1200.jpg?semt=ais_hybrid&w=740' }}
                    style={styles_scan_qr_result.voucherImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
              
              <TouchableOpacity
                style={styles_scan_qr_result.useVoucherButton}
                onPress={() => alert('Use voucher feature would open here')}
              >
                <ThemedText style={styles_scan_qr_result.useVoucherText}>Use voucher</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
        <BusinessNavBar />
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

// Remove the styles constant from here