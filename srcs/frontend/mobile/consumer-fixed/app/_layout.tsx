import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PrivyProvider } from './providers/PrivyProvider';

export default function RootLayout() {
  return (
    <PrivyProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login-choice" options={{ title: 'Login Choice' }} />
        <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
        <Stack.Screen name="business-management" options={{ headerShown: false }} />
        <Stack.Screen name="business/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="swap-points" options={{ title: 'Swap Points' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PrivyProvider>
  );
}
