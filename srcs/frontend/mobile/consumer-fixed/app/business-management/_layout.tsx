import { Stack } from 'expo-router';
import React from 'react';

export default function BusinessManagementLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="business_dashboard" options={{ headerTitle: "Dashboard" }} />
      <Stack.Screen name="scan_qr" options={{ headerShown: false }} />
      <Stack.Screen name="scan_qr_result" options={{ headerShown: false }} />
      <Stack.Screen name="business-information" options={{ headerTitle: "Business Information" }} />
      <Stack.Screen name="add-offer" options={{ headerTitle: "Add New Offer" }} />
    </Stack>
  );
}