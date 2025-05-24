import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { usePrivy } from '@privy-io/react-auth';

export default function WalletInfo() {
  const { user } = usePrivy();
  
  const wallet = user?.wallet?.address;
  
  if (!wallet) return null;

  const truncatedAddress = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

  return (
    <View style={styles.container}>
      <FontAwesome name="wallet" size={20} color="#0082FF" />
      <Text style={styles.address}>{truncatedAddress}</Text>
      <TouchableOpacity onPress={() => {/* Copy to clipboard */}}>
        <FontAwesome name="copy" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  address: {
    marginLeft: 8,
    marginRight: 8,
    fontFamily: 'monospace',
    fontSize: 14,
  },
}); 