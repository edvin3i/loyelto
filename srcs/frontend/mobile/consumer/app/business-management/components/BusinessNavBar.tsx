import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function BusinessNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.navButton, isActive('/business-management/index') && styles.activeButton]} 
        onPress={() => router.push('/business-management')}
      >
        <FontAwesome name="home" size={20} color={isActive('/business-management/index') ? "#0082FF" : "#666"} />
        <ThemedText style={[styles.navText, isActive('/business-management/index') && styles.activeText]}>Home</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, isActive('business_dashboard') && styles.activeButton]} 
        onPress={() => router.push('/business-management/business_dashboard')}
      >
        <FontAwesome name="dashboard" size={20} color={isActive('business_dashboard') ? "#0082FF" : "#666"} />
        <ThemedText style={[styles.navText, isActive('business_dashboard') && styles.activeText]}>Dashboard</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, isActive('scan_qr') && styles.activeButton]} 
        onPress={() => router.push('/business-management/scan_qr')}
      >
        <FontAwesome name="qrcode" size={20} color={isActive('scan_qr') ? "#0082FF" : "#666"} />
        <ThemedText style={[styles.navText, isActive('scan_qr') && styles.activeText]}>Scan QR</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, isActive('business_offers') && styles.activeButton]} 
        onPress={() => router.push('/business-management/business_offers')}
      >
        <FontAwesome name="gift" size={20} color={isActive('business_offers') ? "#0082FF" : "#666"} />
        <ThemedText style={[styles.navText, isActive('business_offers') && styles.activeText]}>Offers</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#0082FF',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeText: {
    color: '#0082FF',
    fontWeight: '500',
  }
});