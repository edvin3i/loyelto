import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Add this type definition
interface Shop {
  id: string;
  name: string;
  location: string;
  points: number;
}

// Mock data for shops - replace with actual data fetching logic later
const mockShops: Shop[] = [
  { id: '1', name: 'Coffee Shop', location: 'Downtown', points: 250 },
  { id: '2', name: 'Bookstore', location: 'Main Street', points: 150 },
  { id: '3', name: 'Bakery', location: 'West Avenue', points: 300 },
  { id: '4', name: 'Electronics Store', location: 'Tech Plaza', points: 500 },
  { id: '5', name: 'Clothing Boutique', location: 'Fashion District', points: 400 },
];

export default function ShopsList() {
  const colorScheme = useColorScheme();

  const renderShopItem = ({ item }: { item: Shop }) => (
    <View style={styles.shopItem}>
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <Text style={styles.shopLocation}>{item.location}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsValue}>{item.points}</Text>
        <Text style={styles.pointsLabel}>points</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>Nearby Shops</Text>
      <FlatList
        data={mockShops}
        renderItem={renderShopItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  listContainer: {
    padding: 16,
  },
  shopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  shopLocation: {
    fontSize: 14,
    color: '#666',
  },
  pointsContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#0066cc',
  },
});