import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import BusinessNavBar from './components/BusinessNavBar';
import styles_add_offer from './styles/styles_add_offer';
import { createVoucherTemplate } from '../utils/business_profile';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OfferFormData {
  title: string;
  description: string;
  points_required: string;
  expiry_days: string;
  quantity: string;  // Add this line
}

export default function AddOfferScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    description: '',
    points_required: '',
    expiry_days: '30',
    quantity: '1',     // Add this line with default value
  });

  const handleInputChange = (field: keyof OfferFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateOffer = async () => {
    try {
      setLoading(true);
      
      // Validate form
      if (!formData.title || !formData.description || !formData.points_required || !formData.expiry_days) {
        alert('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      // Convert string values to numbers
      const voucherData = {
        ...formData,
        points_required: parseInt(formData.points_required, 10),
        expiry_days: parseInt(formData.expiry_days, 10),
        is_active: true
      };
      
      // Call the API
      await createVoucherTemplate(voucherData);
      
      setLoading(false);
      // Navigate back to the home screen
      router.back();
    } catch (error) {
      console.error('Failed to create offer:', error);
      alert('Failed to create offer. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <Stack.Screen 
        options={{
          headerTitle: 'Create New Offer',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles_add_offer.headerButton} 
              onPress={handleCreateOffer}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <ThemedText style={styles_add_offer.saveButtonText}>Save</ThemedText>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles_add_offer.container}>
        <ThemedView style={styles_add_offer.formContainer}>
          <View style={styles_add_offer.formGroup}>
            <ThemedText style={styles_add_offer.label}>Offer Title</ThemedText>
            <TextInput
              style={styles_add_offer.input}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="e.g. Free Pizza Margarita"
            />
          </View>
          
          <View style={styles_add_offer.formGroup}>
            <ThemedText style={styles_add_offer.label}>Description</ThemedText>
            <TextInput
              style={[styles_add_offer.input, styles_add_offer.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe your offer"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles_add_offer.formGroup}>
            <ThemedText style={styles_add_offer.label}>Points Required</ThemedText>
            <TextInput
              style={styles_add_offer.input}
              value={formData.points_required}
              onChangeText={(value) => handleInputChange('points_required', value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 250"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles_add_offer.formGroup}>
            <ThemedText style={styles_add_offer.label}>Expiry (days)</ThemedText>
            <TextInput
              style={styles_add_offer.input}
              value={formData.expiry_days}
              onChangeText={(value) => handleInputChange('expiry_days', value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 30"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles_add_offer.formGroup}>
            <ThemedText style={styles_add_offer.label}>Quantity</ThemedText>
            <TextInput
              style={styles_add_offer.input}
              value={formData.quantity}
              onChangeText={(value) => handleInputChange('quantity', value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 100"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles_add_offer.infoBox}>
            <FontAwesome name="info-circle" size={18} color="#0082FF" style={styles_add_offer.infoIcon} />
            <ThemedText style={styles_add_offer.infoText}>
              Customers will be able to redeem this offer once they collect the required number of points.
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
      <BusinessNavBar />
    </SafeAreaView>
  );
}

// Remove the styles constant from here