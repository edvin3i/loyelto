import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { QueryProvider } from './utils/providers/QueryProvider';

// Enable screens
enableScreens();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <Slot />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

