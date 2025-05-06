import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import styles_shops_list from '../utils/styles_shops_list';
import { useRouter } from 'expo-router';

// Define the Shop interface
interface Shop {
  id: string;
  name: string;
  backgroundColor: string;
  icon: string;
  coupons: number;
  rating: number;
  promotions: number;
}

// Mock data for shops
const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Pizza Place Paris',
    backgroundColor: '#FFE0E0',
    icon: 'fork.knife',
    coupons: 2,
    rating: 4.8,
    promotions: 3
  },
  {
    id: '2',
    name: 'Coffee Shop',
    backgroundColor: '#E0F0FF',
    icon: 'cup.and.saucer.fill',
    coupons: 1,
    rating: 4.5,
    promotions: 2
  },
  // Add more mock shops as needed
];

export default function ShopsList() {
  const colorScheme = useColorScheme();
  const [activeFilter, setActiveFilter] = useState('most recent');
  const [sortOption, setSortOption] = useState('less points left');
  const router = useRouter();

  const renderShopItem = ({ item: store }: { item: Shop }) => (
    <TouchableOpacity 
      style={styles_shops_list.shopItemContainer}
      onPress={() => router.push(`../business/${store.id}`)}
    >
      <View style={[styles_shops_list.shopItem, { backgroundColor: store.backgroundColor }]}>
        <IconSymbol size={24} name={store.icon} color="black" />
        <Text style={styles_shops_list.shopName}>{store.name}</Text>
      </View>
      
      <View style={styles_shops_list.couponContainer}>
        <View style={styles_shops_list.couponBadge}>
          <Text style={styles_shops_list.couponText}>{store.coupons} coupons</Text>
        </View>
        <View style={styles_shops_list.ratingContainer}>
          <IconSymbol size={16} name="star.fill" color="black" />
          <Text style={styles_shops_list.ratingText}>{store.rating}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles_shops_list.promotionButton}>
        <Text style={styles_shops_list.promotionText}>{store.promotions} Promotions available</Text>
        <IconSymbol size={16} name="chevron.right" color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFilterItem = (title: string) => (
    <TouchableOpacity 
      style={[
        styles_shops_list.filterItem, 
        activeFilter === title && styles_shops_list.activeFilterItem
      ]}
      onPress={() => setActiveFilter(title)}
    >
      <Text style={styles_shops_list.filterText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles_shops_list.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Balance Section */}
      <View style={styles_shops_list.balanceContainer}>
        <IconSymbol size={24} name="person.fill" color="#F6A623" />
        <Text style={styles_shops_list.balanceTitle}>My balance</Text>
        <View style={styles_shops_list.pointsSection}>
          <Text style={styles_shops_list.pointsValue}>1234</Text>
          <Text style={styles_shops_list.pointsLabel}>points</Text>
        </View>
      </View>
      
      {/* Filters Section */}
      <View style={styles_shops_list.filtersContainer}>
        <TouchableOpacity style={styles_shops_list.searchButton}>
          <IconSymbol size={20} name="magnifyingglass" color="black" />
        </TouchableOpacity>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles_shops_list.filtersScroll}>
          {renderFilterItem('most recent')}
          {renderFilterItem('favourites')}
          {renderFilterItem('near me')}
        </ScrollView>
      </View>
      
      {/* Sort Option */}
      <TouchableOpacity style={styles_shops_list.sortContainer} onPress={() => {
        setSortOption(sortOption === 'less points left' ? 'more points left' : 'less points left');
      }}>
        <Text style={styles_shops_list.sortText}>Sort by: {sortOption}</Text>
        <IconSymbol size={16} name="chevron.down" color="black" />
      </TouchableOpacity>
      
      {/* Shops List */}
      <FlatList
        data={mockShops}
        renderItem={renderShopItem}
        keyExtractor={store => store.id}
        contentContainerStyle={styles_shops_list.listContainer}
      />
    </View>
  );
}
