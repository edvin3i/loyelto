import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import BusinessNavBar from './components/BusinessNavBar';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginVertical: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  customerCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customerInfo: {
    alignItems: 'center',
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  customerId: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 4,
    color: '#0082FF',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  addPointsButton: {
    backgroundColor: '#0082FF',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  redeemButton: {
    backgroundColor: '#5C6BC0',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  scanAgainButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#0082FF',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#0082FF',
    fontWeight: '600',
  },
});