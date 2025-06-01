import { View, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { getBusinessProfile, getVoucherTemplates, deleteVoucherTemplate, VoucherTemplate } from '../utils/business_profile';
import BusinessNavBar from './components/BusinessNavBar';
import styles from './styles/styles_index';

export default function BusinessHomeScreen() {
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState<VoucherTemplate[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const vouchersData = await getVoucherTemplates();
      setVouchers(vouchersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToAddOffer = () => {
    router.push('../business-management/add-offer');
  };

  const handleStopPromo = async (id: string) => {
    try {
      await deleteVoucherTemplate(id);
      // Refresh vouchers list after deletion
      setVouchers(vouchers.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to delete voucher template:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  // Format balance with proper spacing for thousands
  const formattedBalance = '536 679';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Balance Header */}
        <ThemedView style={styles.balanceHeader}>
          <ThemedText type="title" style={styles.headerLabel}>My balance</ThemedText>
          <View style={styles.balanceContainer}>
            <ThemedText style={[styles.balanceText, { lineHeight: 40 }]}>{formattedBalance}</ThemedText>
            <View style={styles.coinIcon}>
              <FontAwesome name="circle" size={24} color="#FFD700" />
            </View>
          </View>
          <ThemedText style={styles.balanceCaption}>
            points that you've distributed to the customers
          </ThemedText>
        </ThemedView>

        {/* Customer Stats */}
        <ThemedView style={styles.statsRow}>
          <ThemedText type="subtitle">New customers:</ThemedText>
          <View style={styles.pillContainer}>
            <ThemedText style={styles.pillText}>386</ThemedText>
          </View>
          <FontAwesome name="info-circle" size={18} color="#999" />
        </ThemedView>

        {/* Loyalty Program */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">My loyalty program</ThemedText>
            <FontAwesome name="info-circle" size={18} color="#999" style={{ marginHorizontal: 4 }} />
          </View>
          
          <ThemedView style={styles.ruleCard}>
            <ThemedText>each 10€ spent =</ThemedText>
            <View style={styles.pointsDisplay}>
              <ThemedText type="title" style={styles.pointsValue}>5</ThemedText>
              <ThemedText style={styles.pointsLabel}>points</ThemedText>
            </View>
          </ThemedView>

          <ThemedView style={styles.ruleCard}>
            <ThemedText>more than 200€ spent =</ThemedText>
            <View style={styles.pointsDisplay}>
              <ThemedText type="title" style={styles.pointsValue}>200</ThemedText>
              <ThemedText style={styles.pointsLabel}>points</ThemedText>
            </View>
          </ThemedView>
        </ThemedView>

        {/* Active Offers */}
        <ThemedView style={styles.sectionMyOffer}>
          <View style={styles.sectionHeaderWithButton}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">My active offers:</ThemedText>
              <View style={styles.smallPillContainer}>
                <ThemedText style={styles.smallPillText}>{vouchers.length}</ThemedText>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={navigateToAddOffer}
            >
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
              <FontAwesome name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          {vouchers.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>No active offers</ThemedText>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={navigateToAddOffer}
              >
                <ThemedText style={styles.emptyStateButtonText}>Create your first offer</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <View style={styles.offersList}>
              {vouchers.map((item) => (
                <ThemedView key={item.id} style={styles.offerCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.leftContent}>
                      <ThemedText type="subtitle" style={styles.offerTitle}>{item.title}</ThemedText>
                      <ThemedText style={styles.offerDescription}>
                        {item.description}
                      </ThemedText>
                      
                      {/* Quantity left indicator */}
                      <View style={styles.quantityContainer}>
                        <ThemedText style={styles.quantityText}>
                          <ThemedText style={styles.quantityGreen}>150</ThemedText>/300 left
                        </ThemedText>
                      </View>
                      
                      <ThemedText style={styles.expiryText}>
                        Expires after: <ThemedText style={styles.expiryGreen}>{item.expiry_days} days</ThemedText>
                      </ThemedText>
                    </View>
                    
                    {/* Right side with just the image */}
                    <View style={styles.rightContent}>
                      <View style={styles.pizzaImageContainer}>
                        <Image 
                          source={{ uri: 'https://img.freepik.com/photos-gratuite/pizza-pizza-remplie-tomates-salami-olives_140725-1200.jpg?semt=ais_hybrid&w=740' }}
                          style={styles.pizzaImage}
                          resizeMode="cover"
                        />
                      </View>
                    </View>
                  </View>
                  
                  {/* Action buttons with points badge on the right */}
                  <View style={styles.actionButtons}>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => {/* Handle edit */}}
                      >
                        <ThemedText style={styles.editButtonText}>Edit promo</ThemedText>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleStopPromo(item.id)}
                      >
                        <FontAwesome name="trash" size={18} color="black" />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Points badge moved here */}
                    <View style={styles.pointsBadge}>
                      <ThemedText style={styles.pointsNumber}>{item.points_required}</ThemedText>
                      <ThemedText style={styles.pointsLabel}>points</ThemedText>
                    </View>
                  </View>
                </ThemedView>
              ))}
            </View>
          )}
        </ThemedView>
      </ScrollView>
      <BusinessNavBar />
    </SafeAreaView>
  );
}