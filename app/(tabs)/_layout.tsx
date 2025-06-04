import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="show_qr"
        options={{
          title: 'Show QR',
          tabBarIcon: ({ color }) => (
            <View style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 6,
              padding: 4
            }}>
              <IconSymbol size={28} name="qrcode" color={color} />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="shops_list"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />
        }}
      />
    </Tabs>
  );
} 