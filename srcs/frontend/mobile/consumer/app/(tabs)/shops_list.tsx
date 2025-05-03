import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import styles_shops_list from '../utils/styles_shops_list';

// Update the interface with a string type for icon
interface Shop {
  id: string;
  name: string;
  icon: string; // Changed from SFSymbols6_0 to string
  coupons: number;
  rating: number;
  promotions: number;
  backgroundColor: string;
}

// Mock data for shops - replace with actual data fetching logic later
const mockShops: Shop[] = [
  { 
    id: '1', 
    name: 'Pizza place Paris', 
    icon: 'fork.knife', // Changed from 'wifi' to a valid SF Symbol
    coupons: 2, 
    rating: 4.9, 
    promotions: 5,
    backgroundColor: '#FFF2CC' 
  },
  { 
    id: '2', 
    name: 'Best Coffee Shop Clichy', 
    icon: 'cup.and.saucer.fill', // This one is already valid
    coupons: 4, 
    rating: 4.7, 
    promotions: 4,
    backgroundColor: '#FFCCC9' 
  },
  { 
    id: '3', 
    name: 'Grocery Store 24Shop', 
    icon: 'cart.fill', // Changed from 'bag.fill' to ensure it's valid
    coupons: 1, 
    rating: 4.5, 
    promotions: 3,
    backgroundColor: '#E6CCFF' 
  },
];

export default function ShopsList() {
  const colorScheme = useColorScheme();
  const [activeFilter, setActiveFilter] = useState('most recent');
  const [sortOption, setSortOption] = useState('less points left');

  const renderShopItem = ({ item }: { item: Shop }) => (
    <View style={styles_shops_list.shopItemContainer}>
      <View style={[styles_shops_list.shopItem, { backgroundColor: item.backgroundColor }]}>
        <IconSymbol size={24} name={item.icon} color="black" />
        <Text style={styles_shops_list.shopName}>{item.name}</Text>
      </View>
      
      <View style={styles_shops_list.couponContainer}>
        <View style={styles_shops_list.couponBadge}>
          <Text style={styles_shops_list.couponText}>{item.coupons} coupons</Text>
        </View>
        <View style={styles_shops_list.ratingContainer}>
          <IconSymbol size={16} name="star.fill" color="black" />
          <Text style={styles_shops_list.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles_shops_list.promotionButton}>
        <Text style={styles_shops_list.promotionText}>{item.promotions} Promotions available</Text>
        <IconSymbol size={16} name="chevron.right" color="#007AFF" />
      </TouchableOpacity>
    </View>
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
        keyExtractor={item => item.id}
        contentContainerStyle={styles_shops_list.listContainer}
      />
    </View>
  );
}
