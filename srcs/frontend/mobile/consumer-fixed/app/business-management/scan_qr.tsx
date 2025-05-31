import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
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
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ThemedView style={styles_scan_qr.container}>
        <ThemedView style={styles_scan_qr.header}>
          <ThemedText type="title" style={styles_scan_qr.headerTitle}>Scan Customer Code</ThemedText>
        </ThemedView>

        <ThemedView style={styles_scan_qr.scannerContainer}>
          {isScanning ? (
            <View style={styles_scan_qr.scannerActive}>
              <ThemedText style={styles_scan_qr.scanningText}>Scanning...</ThemedText>
              <View style={styles_scan_qr.scanCorners}>
                <View style={[styles_scan_qr.corner, styles_scan_qr.topLeft]} />
                <View style={[styles_scan_qr.corner, styles_scan_qr.topRight]} />
                <View style={[styles_scan_qr.corner, styles_scan_qr.bottomLeft]} />
                <View style={[styles_scan_qr.corner, styles_scan_qr.bottomRight]} />
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles_scan_qr.scanButton}
              onPress={handleStartScan}
            >
              <FontAwesome name="qrcode" size={64} color="#0082FF" />
              <ThemedText style={styles_scan_qr.scanButtonText}>Tap to scan customer code</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
      <BusinessNavBar />
    </SafeAreaView>
  );
}