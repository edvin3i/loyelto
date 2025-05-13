import { StyleSheet, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { getBusinessProfile, getVoucherTemplates, deleteVoucherTemplate, VoucherTemplate } from '../utils/business_profile';
import BusinessNavBar from './components/BusinessNavBar';

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
    router.push('./add-offer');
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
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </ThemedView>
    );
  }

  // Format balance with proper spacing for thousands
  const formattedBalance = '536 679';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Balance Header */}
        <ThemedView style={styles.balanceHeader}>
          <ThemedText type="title" style={styles.headerLabel}>My balance</ThemedText>
          <View style={styles.balanceContainer}>
            <ThemedText style={styles.balanceText}>{formattedBalance}</ThemedText>
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
            <FontAwesome name="info-circle" size={18} color="#999" />
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
        <ThemedView style={styles.section}>
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
                  <View style={styles.offerContent}>
                    <View>
                      <ThemedText type="subtitle">{item.title}</ThemedText>
                      <ThemedText style={styles.offerDescription}>
                        {item.description}
                      </ThemedText>
                      <ThemedText style={styles.offerStatus}>
                        Expires after: <ThemedText style={styles.greenText}>{item.expiry_days} days</ThemedText>
                      </ThemedText>
                    </View>
                    <View style={styles.pizzaIcon}>
                      <FontAwesome 
                        name={item.title.toLowerCase().includes('pizza') ? "cutlery" : "gift"} 
                        size={32} 
                        color="#C62828" 
                      />
                    </View>
                  </View>
                  <View style={styles.offerFooter}>
                    <TouchableOpacity 
                      style={styles.stopButton}
                      onPress={() => handleStopPromo(item.id)}
                    >
                      <ThemedText style={styles.stopButtonText}>Stop promo</ThemedText>
                    </TouchableOpacity>
                    <View style={styles.pointsContainer}>
                      <ThemedText style={styles.pointsValue}>{item.points_required}</ThemedText>
                      <ThemedText style={styles.smallPointsLabel}>points</ThemedText>
                    </View>
                  </View>
                </ThemedView>
              ))}
            </View>
          )}
        </ThemedView>
      </ScrollView>
      <BusinessNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    paddingTop: 16,
  },
  headerLabel: {
    fontSize: 18,
    textAlign: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  balanceText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  coinIcon: {
    marginLeft: 8,
  },
  balanceCaption: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  pillContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  pillText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ruleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  smallPillContainer: {
    backgroundColor: '#E8F5E9',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  smallPillText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#000',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  offersList: {
    marginTop: 8,
  },
  offerCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  offerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  offerStatus: {
    fontSize: 12,
  },
  greenText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  pizzaIcon: {
    marginLeft: 16,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  stopButton: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stopButtonText: {
    color: '#C62828',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  smallPointsLabel: {
    fontSize: 12,
    color: '#666',
  },
});