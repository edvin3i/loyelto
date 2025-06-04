# Safe Area Implementation Guide

## Overview
This app uses `react-native-safe-area-context` to handle safe areas across all devices, ensuring content is never hidden behind notches, status bars, or home indicators.

## Components Used

### 1. SafeAreaProvider
- Wraps the entire app in `app/_layout.tsx`
- Provides safe area context to all child components

### 2. SafeAreaView
- Used in individual screens to respect safe areas
- Replaces regular `View` components for screen containers

### 3. useSafeArea Hook
- Custom hook in `app/hooks/useSafeArea.ts`
- Provides computed safe area values and common style objects

## Usage Examples

### Basic Screen Layout
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Your content */}
    </SafeAreaView>
  );
}
```

### Using the Custom Hook
```tsx
import { useSafeArea } from '../hooks/useSafeArea';

export default function MyScreen() {
  const { headerStyle, contentStyle, footerStyle } = useSafeArea();
  
  return (
    <View style={styles.container}>
      <View style={[styles.header, headerStyle]}>
        {/* Header content */}
      </View>
      <View style={[styles.content, contentStyle]}>
        {/* Main content */}
      </View>
      <View style={[styles.footer, footerStyle]}>
        {/* Footer content */}
      </View>
    </View>
  );
}
```

## Edge Configuration

### Common Edge Configurations
- `edges={['top', 'bottom']}` - Full screen with safe areas
- `edges={['top']}` - Only top safe area (for screens with tab bars)
- `edges={['bottom']}` - Only bottom safe area
- `edges={[]}` - No automatic safe area (manual control)

### When to Use Each
- **Full screens**: `['top', 'bottom']`
- **Tab screens**: `['top']` (tab bar handles bottom)
- **Modal screens**: `['top', 'bottom']`
- **Custom layouts**: `[]` with manual padding

## Platform Differences

### iOS
- Handles notches (iPhone X and newer)
- Status bar integration
- Home indicator spacing
- Dynamic Island support

### Android
- Status bar handling
- Navigation bar spacing
- Gesture navigation support
- Various screen sizes and ratios

## Best Practices

1. **Always wrap root app** with `SafeAreaProvider`
2. **Use SafeAreaView** for screen containers
3. **Specify edges explicitly** based on screen type
4. **Test on various devices** including notched devices
5. **Use the custom hook** for complex layouts
6. **Consider tab bars** when setting bottom edges

## Testing Devices

Test safe areas on:
- iPhone 14 Pro (Dynamic Island)
- iPhone 13 mini (Notch)
- iPhone SE (No notch)
- Various Android devices
- iPad (Different aspect ratios)

## Troubleshooting

### Content Cut Off
- Check if `SafeAreaProvider` is at root level
- Verify `edges` configuration
- Test on actual devices, not just simulator

### Inconsistent Spacing
- Use the custom `useSafeArea` hook
- Apply consistent padding values
- Check platform-specific differences

### Tab Bar Issues
- Use `edges={['top']}` for tab screens
- Let tab bar handle bottom safe area
- Test with different tab bar configurations 