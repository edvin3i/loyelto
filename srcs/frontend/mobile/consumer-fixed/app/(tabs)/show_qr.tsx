import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

const scan_qr = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text>SHOW MY QR</Text>
    </SafeAreaView>
  );
}

export default scan_qr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});