import { Image, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import styles from '../utils/styles';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const MOCK_STORES = [
  { id: 1, name: 'Pizza place Paris', points: 65, coupons: 2, icon: '🍕' },
  { id: 2, name: 'Best Coffee Shop Clichy', points: 27, coupons: 2, icon: '☕' },
  { id: 3, name: 'Airlines Worldwide', points: 17, coupons: 0, icon: '✈️' },
  { id: 4, name: 'Grocery Store 24Shop', points: 15, coupons: 0, icon: '🛒' },
  { id: 5, name: 'Sport Store Athletic', points: 13, coupons: 0, icon: '🏃' },
  { id: 6, name: 'Pharmacy Strauss', points: 12, coupons: 0, icon: '💊' },
];

const TABS = ['most recent', 'favourites', 'near me', 'less'];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('most recent');
  const router = useRouter();
  
  const renderFilterItem = (title: string) => (
    <TouchableOpacity 
      key={title}
      style={[
        styles.filterItem, 
        activeFilter === title && styles.activeFilterItem
      ]}
      onPress={() => setActiveFilter(title)}
    >
      <ThemedText style={[styles.filterText, activeFilter === title && styles.activeFilterText]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>😊</ThemedText>
          </View>
          <ThemedText style={styles.greeting}>Hello, Julien!</ThemedText>
        </View>
        <ThemedView style={styles.pointsContainer}>
          <ThemedText style={styles.pointsValue}>11123</ThemedText>
          <ThemedText style={styles.pointsLabel}>your LOYL</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {TABS.map((tab) => renderFilterItem(tab))}
        </ScrollView>
      </View>

      {/* Store List */}
      <ScrollView style={styles.storeList}>
        {MOCK_STORES.map((store) => (
          <TouchableOpacity 
            key={store.id} 
            style={styles.storeItem}
            onPress={() => router.push(`../business/${store.id}`)}
          >
            <View style={styles.storeLeft}>
              <View style={styles.storeIcon}>
                <ThemedText style={styles.storeIconText}>{store.icon}</ThemedText>
              </View>
              <View>
                <ThemedText style={styles.storeName}>{store.name}</ThemedText>
                {store.coupons > 0 && (
                  <View style={styles.couponBadge}>
                    <ThemedText style={styles.couponText}>{store.coupons} coupons</ThemedText>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.pointsRight}>
              <ThemedText style={styles.storePoints}>{store.points}</ThemedText>
              <ThemedText style={styles.pointsLabel}>points</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
