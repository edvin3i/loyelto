import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivyProvider } from '@privy-io/expo';
import { Slot } from 'expo-router';
import config from './config/environment';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PrivyProvider appId={config.PRIVY_APP_ID} clientId={config.PRIVY_CLIENT_ID}>
        <Slot />
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login-choice" options={{ title: 'Login Choice' }} />
          <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
          <Stack.Screen name="business-management" options={{ headerShown: false }} />
          <Stack.Screen name="business/[id]" options={{ headerShown: true }} />
          <Stack.Screen name="swap-points" options={{ title: 'Swap Points' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PrivyProvider>
    </SafeAreaProvider>
  );
}
