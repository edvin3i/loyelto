import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ScanScreen() {
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // In a real app, we would integrate with camera/scanner APIs here
    
    // Simulate a scan after 2 seconds
    setTimeout(() => {
      const mockScanData = {
        customerId: 'CUST-12345',
        name: 'Julien',
        points: '256',
      };
      
      // Navigate to scan result page with the scan data
      router.push({
        pathname: '/scan-result',
        params: mockScanData
      });
      
      // Reset scanning state
      setIsScanning(false);
    }, 2000);
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
}); 