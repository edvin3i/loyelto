import { Image, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles } from './styles'

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
          <ThemedText style={styles.pointsLabel}>your points</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, index === 0 && styles.activeTab]}>
            <ThemedText style={[styles.tabText, index === 0 && styles.activeTabText]}>
              {tab}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Store List */}
      <ScrollView style={styles.storeList}>
        {MOCK_STORES.map((store) => (
          <TouchableOpacity key={store.id} style={styles.storeItem}>
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
