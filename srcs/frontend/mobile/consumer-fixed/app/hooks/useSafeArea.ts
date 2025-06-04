import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export function useSafeArea() {
  const insets = useSafeAreaInsets();
  
  return {
    // Raw insets
    insets,
    
    // Computed safe area values
    safeAreaTop: insets.top,
    safeAreaBottom: insets.bottom,
    safeAreaLeft: insets.left,
    safeAreaRight: insets.right,
    
    // Platform-specific helpers
    statusBarHeight: Platform.OS === 'ios' ? insets.top : 0,
    homeIndicatorHeight: Platform.OS === 'ios' ? insets.bottom : 0,
    
    // Common padding values
    paddingTop: Math.max(insets.top, 20), // Minimum 20px padding
    paddingBottom: Math.max(insets.bottom, 20),
    paddingHorizontal: Math.max(insets.left, insets.right, 16),
    
    // Style objects for common use cases
    safeAreaStyle: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    
    headerStyle: {
      paddingTop: insets.top + 10,
      paddingHorizontal: Math.max(insets.left, insets.right, 16),
    },
    
    contentStyle: {
      paddingHorizontal: Math.max(insets.left, insets.right, 16),
    },
    
    footerStyle: {
      paddingBottom: insets.bottom + 10,
      paddingHorizontal: Math.max(insets.left, insets.right, 16),
    },
  };
}

export default useSafeArea; 