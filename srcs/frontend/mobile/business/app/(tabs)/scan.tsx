import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';

export default function ScanScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  const handleStartScan = () => {
    setIsScanning(true);
    // In a real app, we would integrate with camera/scanner APIs here
    
    // Simulate a scan after 2 seconds
    setTimeout(() => {
      const mockScanData = {
        customerId: 'CUST-12345',
        name: 'Julien',
        points: 256,
        timestamp: new Date().toISOString()
      };
      
      setLastScan(mockScanData);
      setIsScanning(false);
    }, 2000);
  };

  const handleAddPoints = () => {
    // In a real app, this would open a points-adding dialog
    alert('Points would be added to the customer account');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Scan Customer Code</ThemedText>
      </ThemedView>

      <ThemedView style={styles.scannerContainer}>
        {isScanning ? (
          <View style={styles.scannerActive}>
            <ThemedText style={styles.scanningText}>Scanning...</ThemedText>
            <View style={styles.scanCorners}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleStartScan}
          >
            <FontAwesome name="qrcode" size={64} color="#4CAF50" />
            <ThemedText style={styles.scanButtonText}>Tap to scan customer code</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {lastScan && (
        <ThemedView style={styles.resultContainer}>
          <ThemedView style={styles.resultHeader}>
            <ThemedText type="subtitle">Last Scan Result</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.customerCard}>
            <View style={styles.customerInfo}>
              <ThemedText style={styles.customerName}>{lastScan.name}</ThemedText>
              <ThemedText style={styles.customerId}>ID: {lastScan.customerId}</ThemedText>
              <View style={styles.pointsContainer}>
                <ThemedText style={styles.pointsValue}>{lastScan.points}</ThemedText>
                <ThemedText style={styles.pointsLabel}>points</ThemedText>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.addPointsButton}
              onPress={handleAddPoints}
            >
              <ThemedText style={styles.addPointsText}>Add Points</ThemedText>
              <FontAwesome name="plus" size={12} color="#fff" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanButton: {
    alignItems: 'center',
    padding: 20,
  },
  scanButtonText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  scannerActive: {
    width: 250,
    height: 250,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanningText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scanCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  resultContainer: {
    padding: 16,
    marginBottom: 20,
  },
  resultHeader: {
    marginBottom: 8,
  },
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerId: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  addPointsButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPointsText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 