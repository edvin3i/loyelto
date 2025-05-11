import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const navigateToAddOffer = () => {
    router.push('/(tabs)/add-offer');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Balance Header */}
      <ThemedView style={styles.balanceHeader}>
        <ThemedText type="title" style={styles.headerLabel}>My balance</ThemedText>
        <View style={styles.balanceContainer}>
          <ThemedText type="title" style={styles.balanceText}>536 679</ThemedText>
          <Image 
            source={require('@/assets/images/coin.png')} 
            style={styles.coinIcon}
            contentFit="contain"
          />
        </View>
        <ThemedText style={styles.balanceCaption}>
          points that you've distributed to the consumers
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
              <ThemedText style={styles.smallPillText}>5</ThemedText>
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

        {/* Offer Card */}
        <ThemedView style={styles.offerCard}>
          <View style={styles.offerContent}>
            <View>
              <ThemedText type="subtitle">Free Pizza Margarita</ThemedText>
              <ThemedText style={styles.offerDescription}>
                Classic pizza with tomato sauce, mozzarella, and fresh basil
              </ThemedText>
              <ThemedText style={styles.offerStatus}>
                <ThemedText style={styles.greenText}>150</ThemedText>/300 left
              </ThemedText>
            </View>
            <Image 
              source={require('@/assets/images/pizza-margarita.png')} 
              style={styles.offerImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.offerFooter}>
            <TouchableOpacity style={styles.stopButton}>
              <ThemedText style={styles.stopButtonText}>Stop promo</ThemedText>
            </TouchableOpacity>
            <View style={styles.pointsContainer}>
              <ThemedText style={styles.pointsValue}>15</ThemedText>
              <ThemedText style={styles.smallPointsLabel}>points</ThemedText>
            </View>
          </View>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginRight: 8,
  },
  coinIcon: {
    width: 32,
    height: 32,
  },
  balanceCaption: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
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
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
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
});
