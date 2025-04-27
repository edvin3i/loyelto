import { Image, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
          <ThemedText style={styles.pointsValue}>123</ThemedText>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 4,
    height: 16,
  flexShrink: 1, // Prevents excessive expansion
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  tabText: {
    color: '#666',
    fontSize: 13,
  },
  activeTabText: {
    color: '#4CAF50',
  },
  storeList: {
    flex: 1,
    padding: 16,
  },
  storeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeIconText: {
    fontSize: 20,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  couponBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  couponText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  pointsRight: {
    alignItems: 'flex-end',
  },
  storePoints: {
    fontSize: 20,
    fontWeight: '600',
  },
});
