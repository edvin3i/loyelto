import { StyleSheet, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { getBusinessProfile, Business } from '@/services/business';
import { getVoucherTemplates, VoucherTemplate, deleteVoucherTemplate } from '@/services/voucher';

export default function HomeScreen() {
  const [coinImageError, setCoinImageError] = useState(false);
  const [pizzaImageError, setPizzaImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [vouchers, setVouchers] = useState<VoucherTemplate[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [businessData, vouchersData] = await Promise.all([
        getBusinessProfile(),
        getVoucherTemplates()
      ]);
      setBusiness(businessData);
      setVouchers(vouchersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToAddOffer = () => {
    router.push('/add-offer');
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
  const formattedBalance = '536 679'; // This would come from the business data in a real implementation

  return (
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
    marginBottom: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    height: 60,
  },
  balanceText: {
    fontSize: 38,
    fontWeight: 'bold',
    marginRight: 8,
    lineHeight: 48,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  coinIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCaption: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pillContainer: {
    backgroundColor: '#86CC93',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  pillText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallPillContainer: {
    backgroundColor: '#86CC93',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  smallPillText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  ruleCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsDisplay: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#C4E9C8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    marginRight: 4,
    fontWeight: '600',
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  offerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  offerDescription: {
    color: '#666',
    fontSize: 14,
    marginVertical: 4,
    maxWidth: '80%',
  },
  offerStatus: {
    fontSize: 14,
  },
  greenText: {
    color: '#66BB6A',
    fontWeight: '600',
  },
  pizzaIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFCDD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FFCDD2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  smallPointsLabel: {
    fontSize: 10,
    color: '#666',
  },
  offersList: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  emptyStateText: {
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
    fontWeight: '600',
  },
});
