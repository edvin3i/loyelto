import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivyProvider } from '@privy-io/expo';
import config from './config/environment';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PrivyProvider 
        appId={config.PRIVY_APP_ID} 
        clientId={config.PRIVY_CLIENT_ID}
        config={{
          // Optimize initialization
          appearance: {
            theme: 'light',
            accentColor: '#0082FF',
          },
          // Reduce initial load by limiting login methods
          loginMethods: ['email'],
          // Skip wallet creation on login to speed up
          embeddedWallets: {
            createOnLogin: 'off',
          },
        }}
      >
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login-choice" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="business-management" options={{ headerShown: false }} />
          <Stack.Screen name="business/[id]" options={{ headerShown: true }} />
          <Stack.Screen name="swap-points" options={{ title: 'Swap Points' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PrivyProvider>
    </SafeAreaProvider>
  );
}
