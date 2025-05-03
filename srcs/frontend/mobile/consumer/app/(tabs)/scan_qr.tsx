import { StyleSheet, View, Text } from 'react-native';
import React from 'react';

const scan_qr = () => {
  return (
    <View style={styles.container}>
      <Text>SHOW MY QR</Text>
    </View>
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