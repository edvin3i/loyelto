import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import BusinessNavBar from './components/BusinessNavBar';

export default function BusinessDashboard() {
  const colorScheme = useColorScheme();
  
  // Mock data - would come from API in real app
  const businessStats = {
    totalCustomers: 1245,
    pointsIssued: 45600,
    activePromotions: 3,
    recentTransactions: [
      { id: '1', customer: 'John D.', points: 150, date: '2023-05-15' },
      { id: '2', customer: 'Sarah M.', points: 200, date: '2023-05-14' },
      { id: '3', customer: 'Alex K.', points: 75, date: '2023-05-13' },
    ]
  };
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: '#EDF7FF' }]}>
        {/* Business Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{businessStats.totalCustomers}</Text>
              <Text style={styles.statLabel}>Total Customers</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{businessStats.pointsIssued}</Text>
              <Text style={styles.statLabel}>Points Issued</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{businessStats.activePromotions}</Text>
              <Text style={styles.statLabel}>Active Promotions</Text>
            </View>
          </View>
        </View>
        
        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {businessStats.recentTransactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View>
                <Text style={styles.customerName}>{transaction.customer}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsValue}>{transaction.points}</Text>
                <Text style={styles.pointsLabel}>points</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Transactions</Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol size={24} name="plus.circle" color="#0082FF" />
              <Text style={styles.actionText}>New Offer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol size={24} name="qrcode" color="#0082FF" />
              <Text style={styles.actionText}>Scan Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol size={24} name="chart.bar" color="#0082FF" />
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BusinessNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  statsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0082FF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  transactionsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0082FF',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    color: '#0082FF',
    fontWeight: '500',
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
});