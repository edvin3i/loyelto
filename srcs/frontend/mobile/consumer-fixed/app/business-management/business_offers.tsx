import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useRouter } from 'expo-router';
import styles_business_offers from '../utils/styles_business_offers';
import BusinessNavBar from './components/BusinessNavBar';

// Define the Offer interface
interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  redemptions: number;
}

// Mock data for offers
const mockOffers: Offer[] = [
  {
    id: '1',
    name: 'Free Pizza Margarita',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 250,
    active: true,
    redemptions: 15
  },
  {
    id: '2',
    name: 'Pizza Pepperoni',
    description: 'Tomato sauce, mozzarella, and pepperoni slices',
    price: 300,
    active: true,
    redemptions: 8
  },
  {
    id: '3',
    name: 'Free Drink',
    description: 'Get a free soft drink with any pizza purchase',
    price: 100,
    active: false,
    redemptions: 22
  }
];

export default function BusinessOffers() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  const renderOfferItem = ({ item }: { item: Offer }) => (
    <View style={styles_business_offers.offerItem}>
      <View style={styles_business_offers.offerHeader}>
        <Text style={styles_business_offers.offerName}>{item.name}</Text>
        <View style={[styles_business_offers.statusBadge, { backgroundColor: item.active ? '#ABE7B2' : '#F0F0F0' }]}>
          <Text style={styles_business_offers.statusText}>{item.active ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      
      <Text style={styles_business_offers.offerDescription}>{item.description}</Text>
      
      <View style={styles_business_offers.offerFooter}>
        <View style={styles_business_offers.pointsContainer}>
          <Text style={styles_business_offers.pointsValue}>{item.price}</Text>
          <Text style={styles_business_offers.pointsLabel}>points</Text>
        </View>
        
        <View style={styles_business_offers.redemptionsContainer}>
          <Text style={styles_business_offers.redemptionsLabel}>Redemptions:</Text>
          <Text style={styles_business_offers.redemptionsValue}>{item.redemptions}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles_business_offers.editButton}
          onPress={() => router.push({
            pathname: '/business/[id]',
            params: { id: item.id }
          })}
        >
          <IconSymbol size={20} name="pencil" color="#0082FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles_business_offers.container, { backgroundColor: '#EDF7FF' }]}>
        <View style={styles_business_offers.header}>
          <Text style={styles_business_offers.headerTitle}>My Offers</Text>
          <TouchableOpacity 
            style={styles_business_offers.addButton}
            onPress={() => router.push('../business-management/add-offer')}
          >
            <IconSymbol size={20} name="plus" color="white" />
            <Text style={styles_business_offers.addButtonText}>New Offer</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockOffers}
          renderItem={renderOfferItem}
          keyExtractor={offer => offer.id}
          contentContainerStyle={styles_business_offers.listContainer}
        />
        <BusinessNavBar />
      </View>
    </View>
  );
}