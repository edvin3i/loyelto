import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import styles from './styles/styles_business_nav_bar';

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
        style={[styles.navButton, isActive('scan_qr') && styles.activeButton]} 
        onPress={() => router.push('/business-management/scan_qr')}
      >
        <FontAwesome name="qrcode" size={20} color={isActive('scan_qr') ? "#0082FF" : "#666"} />
        <ThemedText style={[styles.navText, isActive('scan_qr') && styles.activeText]}>Scan QR</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, isActive('business-information') && styles.activeButton]} 
        onPress={() => router.push('/business-management/business-information')}
      >
        <FontAwesome name="user" size={20} color={isActive('business-information') ? "#0082FF" : "#666"} />
        <ThemedText style={[styles.navText, isActive('business-information') && styles.activeText]}>Profile</ThemedText>
      </TouchableOpacity>
    </View>
  );
}