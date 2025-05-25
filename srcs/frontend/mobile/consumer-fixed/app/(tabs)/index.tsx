import { Image, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import styles from '../utils/styles';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const MOCK_STORES = [
  { id: 1, name: 'Pizza place Paris', points: 1165, coupons: 2, icon: '🍕', couponDetails: [
    { id: 1, name: 'Free Pizza', quantity: 1 },
    { id: 2, name: '50% Off Drinks', quantity: 1 },
  ] },
  { id: 2, name: 'Best Coffee Shop Clichy', points: 27, coupons: 2, icon: '☕', couponDetails: [
    { id: 1, name: 'Free Coffee', quantity: 1 },
    { id: 2, name: 'Pastry Discount', quantity: 1 }
  ] },
  { id: 3, name: 'Airlines Worldwide', points: 17, coupons: 0, icon: '✈️' },
  { id: 4, name: 'Grocery Store 24Shop', points: 15, coupons: 0, icon: '🛒' },
  { id: 5, name: 'Sport Store Athletic', points: 13, coupons: 0, icon: '🏃' },
  { id: 6, name: 'Pharmacy Strauss', points: 12, coupons: 0, icon: '💊' },
];

const TABS = ['most recent', 'favourites', 'near me'];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('most recent');
  const [expandedStores, setExpandedStores] = useState<number[]>([]);
  const router = useRouter();
  
  const toggleStoreExpansion = (storeId: number, event: any) => {
    event.stopPropagation(); // Prevent navigation when expanding
    if (expandedStores.includes(storeId)) {
      setExpandedStores(expandedStores.filter(id => id !== storeId));
    } else {
      setExpandedStores([...expandedStores, storeId]);
    }
  };
  
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
          <View style={styles.pointsValueContainer}>
            <ThemedText style={styles.pointsValue}>11123</ThemedText>
            <Image 
              source={require('../../assets/images/coin_loyl.png')} 
              style={styles.coinIcon} 
            />
          </View>
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
          <View key={store.id}>
            <TouchableOpacity 
              style={styles.storeItem}
              onPress={(e) => {
                if (store.coupons > 0 && store.couponDetails) {
                  toggleStoreExpansion(store.id, e);
                } else if (store.coupons === 0) {
                  // Toggle expansion for stores with zero coupons
                  toggleStoreExpansion(store.id, e);
                }
              }}
            >
              <View style={styles.storeLeft}>
                <View style={styles.storeIcon}>
                  <ThemedText style={styles.storeIconText}>{store.icon}</ThemedText>
                </View>
                <View>
                  <ThemedText style={styles.storeName}>{store.name}</ThemedText>
                  {/* Conditional rendering of coupons */}
                  {store.coupons > 0 ? (
                    <View style={styles.couponBadge}>
                      <ThemedText style={styles.couponDigit}>{store.coupons}</ThemedText>
                      <ThemedText style={styles.couponLabel}> vouchers</ThemedText>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.pointsRight}>
                <ThemedText style={styles.storePoints}>{store.points}</ThemedText>
                <ThemedText style={styles.pointsLabel}>points</ThemedText>
              </View>
            </TouchableOpacity>
            
            {/* Expanded view for stores with coupons */}
            {expandedStores.includes(store.id) && store.couponDetails && (
              <View style={styles.couponDetailsContainer}>
                {store.couponDetails.map((coupon) => (
                  <View key={coupon.id} style={styles.couponDetailItem}>
                    <ThemedText style={styles.couponQuantity}>{coupon.quantity}x</ThemedText>
                    <ThemedText style={styles.couponName}>{coupon.name}</ThemedText>
                  </View>
                ))}
                
                {/* Swap Coins button in expanded view */}
                <TouchableOpacity 
                  style={styles.expandedSwapButton}
                  onPress={() => {
                    // Navigate to swap points screen with store data
                    router.push({
                      pathname: '/swap-points',
                      params: {
                        storeId: store.id,
                        storeName: store.name,
                        storeIcon: store.icon
                      }
                    });
                  }}
                >
                  <ThemedText style={styles.expandedSwapButtonText}>Swap Points</ThemedText>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Expanded view for stores without coupons */}
            {expandedStores.includes(store.id) && store.coupons === 0 && (
              <View style={styles.couponDetailsContainer}>
                <TouchableOpacity 
                  style={styles.expandedSwapButton}
                  onPress={() => {
                    // Navigate to swap points screen with store data
                    router.push({
                      pathname: '/swap-points',
                      params: {
                        storeId: store.id,
                        storeName: store.name,
                        storeIcon: store.icon
                      }
                    });
                  }}
                >
                  <ThemedText style={styles.expandedSwapButtonText}>Swap Coins</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
