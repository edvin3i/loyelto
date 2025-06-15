import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useAuthStore } from '../../utils/providers/stores/authStore';
import styles from './styles_wallet_info';

export default function WalletInfo() {
  const { user } = useAuthStore();
  
  // Get the first wallet address if available
  const wallet = user?.wallets?.[0]?.address;
  
  if (!wallet) return null;

  const truncatedAddress = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(wallet);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      Alert.alert('Error', 'Failed to copy address');
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="wallet" size={20} color="#0082FF" />
      <Text style={styles.address}>{truncatedAddress}</Text>
      <TouchableOpacity onPress={copyToClipboard}>
        <FontAwesome name="copy" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );
} 