import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import BusinessNavBar from './components/BusinessNavBar';
import styles_scan_qr from './styles/styles_scan_qr';

export default function ScanQRScreen() {
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
        pathname: '/business-management/scan_qr_result',
        params: mockScanData
      });
      
      // Reset scanning state
      setIsScanning(false);
    }, 2000);
  };

  return (
    <View style={{ flex: 1 }}>
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
              <FontAwesome name="qrcode" size={64} color="#0082FF" />
              <ThemedText style={styles.scanButtonText}>Tap to scan customer code</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
      <BusinessNavBar />
    </View>
  );
}

// Remove the styles constant from here