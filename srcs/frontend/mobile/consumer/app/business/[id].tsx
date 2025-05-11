import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import business_profile_styles from '../utils/business_profile';

// Define types for our data
interface BusinessOffer {
  id: string;
  name: string;
  description: string;
  price: number;
  pointsType: string;
}

interface BusinessData {
  id: string;
  name: string;
  logo: string;
  rating: number;
  address: string;
  hours: string;
  info: string;
  offers: BusinessOffer[];
}

// Mock data - replace with actual API call later
const getMockBusinessData = (id: string): BusinessData => {
  // Coffee shop data
  if (id === '2') {
    return {
      id,
      name: 'Best Coffee Shop Clichy',
      logo: 'https://img.freepik.com/premium-vector/coffee-shop-logo-template-with-coffee-cup-beans_165143-578.jpg',
      rating: 4.7,
      address: '45 Avenue de Clichy, Paris, France',
      hours: 'Mon-Fri: 7:00-20:00, Sat-Sun: 8:00-19:00',
      info: 'Specialty coffee shop serving ethically sourced beans. We offer a variety of brewing methods and homemade pastries.',
      offers: [
        {
          id: '1',
          name: 'Specialty Latte',
          description: 'Smooth espresso with steamed milk and your choice of flavor syrup',
          price: 180,
          pointsType: 'Coffee_brand points'
        },
        {
          id: '2',
          name: 'Pastry Combo',
          description: 'Any coffee drink with a freshly baked pastry of your choice',
          price: 250,
          pointsType: 'Coffee_brand points'
        },
        {
          id: '3',
          name: 'Coffee Beans',
          description: '250g bag of our signature house blend coffee beans',
          price: 350,
          pointsType: 'Coffee_brand points'
        },
        {
          id: '4',
          name: 'Loyalty Reward',
          description: 'Free coffee after collecting 500 points',
          price: 0,
          pointsType: 'Coffee_brand points'
        }
      ]
    };
  }
  
  // Default pizza place data
  if (id === '1') {
    return {
        id,
        name: 'Pizza Place Paris',
        logo: 'https://www.creativefabrica.com/wp-content/uploads/2022/04/17/Pizza-Logo-Design-Graphics-29132095-2-580x387.jpg',
        rating: 4.9,
        address: '123 Main Street, Paris, France',
        hours: 'Mon-Fri: 10:00-22:00, Sat-Sun: 11:00-23:00',
        info: 'Authentic Italian pizza made with fresh ingredients. Family owned since 1985.',
        offers: [
          {
            id: '1',
            name: 'Pizza Margarita',
            description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
            price: 250,
            pointsType: 'Pizza_brand points'
          },
          {
            id: '2',
            name: 'Pizza Pepperoni',
            description: 'Tomato sauce, mozzarella, and pepperoni slices',
            price: 300,
            pointsType: 'Pizza_brand points'
          },
          {
            id: '3',
            name: 'Free Drink',
            description: 'Get a free soft drink with any pizza purchase',
            price: 100,
            pointsType: 'Pizza_brand points'
          }
        ]
      };
  }

  // Default return for any other ID
  return {
    id,
    name: 'Grocery Store 24Shop',
    logo: 'https://img.freepik.com/free-vector/supermarket-logo-template-with-shopping-cart_23-2148470293.jpg',
    rating: 4.5,
    address: '78 Rue de Commerce, Paris, France',
    hours: 'Mon-Sun: 8:00-22:00',
    info: 'Your neighborhood grocery store with fresh produce, pantry essentials, and household items.',
    offers: [
      {
        id: '1',
        name: 'Fresh Produce Bundle',
        description: 'Selection of seasonal fruits and vegetables at a discounted price',
        price: 200,
        pointsType: 'Grocery_points'
      },
      {
        id: '2',
        name: 'Loyalty Discount',
        description: '10% off your next purchase when you reach 500 points',
        price: 0,
        pointsType: 'Grocery_points'
      }
    ]
  };
};

export default function BusinessProfileScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [showInfo, setShowInfo] = useState(false);
  
  // In a real app, you would fetch this data from an API
  const business = getMockBusinessData(id as string);
  
  // Define renderOfferItem BEFORE using it
  const renderOfferItem = ({ item }: { item: BusinessOffer }) => (
    <View style={business_profile_styles.offerItem}>
      {/* Left Container */}
      <View style={business_profile_styles.offerLeftContainer}>
        <View>
          <Text style={business_profile_styles.offerName}>{item.name}</Text>
          <Text style={business_profile_styles.offerDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity style={business_profile_styles.buyButton}>
          <Text style={business_profile_styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
      
      {/* Right Container */}
      <View style={business_profile_styles.offerRightContainer}>
        <Image 
          source={{ uri: 'https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.webp' }} // Replace with actual image
          style={business_profile_styles.offerImage}
          resizeMode="cover"
        />
        <View style={business_profile_styles.priceContainer}>
          <Text style={business_profile_styles.offerPrice}>{item.price}</Text>
          <Text style={business_profile_styles.pointsType}>points</Text>
        </View>
      </View>
    </View>
  );
  
  return (
    <>
      <Stack.Screen options={{ 
        title: business.name,
        headerBackTitle: "Back"
        }} 
      />
      <ScrollView style={[business_profile_styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {/* Business Logo/Image */}
        <Image 
          source={{ uri: business.logo }} 
          style={business_profile_styles.logo} 
          resizeMode="cover"
        />
        
        {/* Business Name */}
        <Text style={business_profile_styles.businessName}>{business.name}</Text>
        
        {/* Rating and Address */}
        <View style={business_profile_styles.ratingAddressContainer}>
          <View style={business_profile_styles.ratingContainer}>
            <IconSymbol size={16} name="star.fill" color="#FFD700" />
            <Text style={business_profile_styles.ratingText}>{business.rating}</Text>
          </View>
          <Text style={business_profile_styles.addressText}>{business.address}</Text>
        </View>
        
        {/* Hours and Info (Expandable) */}
        <TouchableOpacity 
          style={business_profile_styles.infoButton}
          onPress={() => setShowInfo(!showInfo)}
        >
          <Text style={business_profile_styles.infoButtonText}>Tap for hours and info</Text>
          <IconSymbol 
            size={16} 
            name={showInfo ? "chevron.up" : "chevron.down"} 
            color={Colors[colorScheme ?? 'light'].text} 
          />
        </TouchableOpacity>
        
        {showInfo && (
          <View style={business_profile_styles.expandedInfo}>
            <Text style={business_profile_styles.hoursText}>Hours: {business.hours}</Text>
            <Text style={business_profile_styles.infoText}>{business.info}</Text>
          </View>
        )}
        
        {/* Offers List */}
        <View style={business_profile_styles.offersSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={business_profile_styles.offersSectionTitle}>Available offers</Text>
            <View style={business_profile_styles.offerCountBadge}>
              <Text style={business_profile_styles.offerCountText}>{business.offers.length}</Text>
            </View>
          </View>
          
          <FlatList
            data={business.offers}
            renderItem={renderOfferItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </>
  );
}
