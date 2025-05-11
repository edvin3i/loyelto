import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Analytics</ThemedText>
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statCard}>
          <ThemedText style={styles.statLabel}>This Month</ThemedText>
          <ThemedText style={styles.statValue}>52,540</ThemedText>
          <ThemedText style={styles.statCaption}>points distributed</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText style={styles.statLabel}>This Month</ThemedText>
          <ThemedText style={styles.statValue}>43</ThemedText>
          <ThemedText style={styles.statCaption}>new customers</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="subtitle">Popular Offers</ThemedText>
      </ThemedView>

      <ThemedView style={styles.offersList}>
        <ThemedView style={styles.offerItem}>
          <View style={styles.offerRank}>
            <ThemedText style={styles.rankText}>1</ThemedText>
          </View>
          <View style={styles.offerInfo}>
            <ThemedText style={styles.offerName}>Free Pizza Margarita</ThemedText>
            <ThemedText style={styles.offerRedemptions}>152 redemptions</ThemedText>
          </View>
          <FontAwesome name="arrow-right" size={16} color="#999" />
        </ThemedView>

        <ThemedView style={styles.offerItem}>
          <View style={styles.offerRank}>
            <ThemedText style={styles.rankText}>2</ThemedText>
          </View>
          <View style={styles.offerInfo}>
            <ThemedText style={styles.offerName}>Free Coffee</ThemedText>
            <ThemedText style={styles.offerRedemptions}>98 redemptions</ThemedText>
          </View>
          <FontAwesome name="arrow-right" size={16} color="#999" />
        </ThemedView>

        <ThemedView style={styles.offerItem}>
          <View style={styles.offerRank}>
            <ThemedText style={styles.rankText}>3</ThemedText>
          </View>
          <View style={styles.offerInfo}>
            <ThemedText style={styles.offerName}>10% Off Next Order</ThemedText>
            <ThemedText style={styles.offerRedemptions}>76 redemptions</ThemedText>
          </View>
          <FontAwesome name="arrow-right" size={16} color="#999" />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="subtitle">Customer Activity</ThemedText>
      </ThemedView>

      <ThemedView style={styles.chartPlaceholder}>
        <ThemedText style={styles.chartText}>Activity Chart</ThemedText>
        <ThemedText style={styles.chartCaption}>Daily customer activity over the last 30 days</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCaption: {
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  offersList: {
    paddingHorizontal: 16,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  offerRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontWeight: 'bold',
  },
  offerInfo: {
    flex: 1,
  },
  offerName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  offerRedemptions: {
    fontSize: 12,
    color: '#666',
  },
  chartPlaceholder: {
    margin: 16,
    backgroundColor: '#f5f5f5',
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartCaption: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
}); 