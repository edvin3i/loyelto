import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import BusinessNavBar from './components/BusinessNavBar';
import styles_business_dashboard from './styles/styles_business_dashboard';

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
      <ScrollView style={[styles_business_dashboard.container, { backgroundColor: '#EDF7FF' }]}>
        {/* Business Stats Overview */}
        <View style={styles_business_dashboard.statsContainer}>
          <Text style={styles_business_dashboard.sectionTitle}>Business Overview</Text>
          
          <View style={styles_business_dashboard.statsGrid}>
            <View style={styles_business_dashboard.statCard}>
              <Text style={styles_business_dashboard.statValue}>{businessStats.totalCustomers}</Text>
              <Text style={styles_business_dashboard.statLabel}>Total Customers</Text>
            </View>
            
            <View style={styles_business_dashboard.statCard}>
              <Text style={styles_business_dashboard.statValue}>{businessStats.pointsIssued}</Text>
              <Text style={styles_business_dashboard.statLabel}>Points Issued</Text>
            </View>
            
            <View style={styles_business_dashboard.statCard}>
              <Text style={styles_business_dashboard.statValue}>{businessStats.activePromotions}</Text>
              <Text style={styles_business_dashboard.statLabel}>Active Promotions</Text>
            </View>
          </View>
        </View>
        
        {/* Recent Transactions */}
        <View style={styles_business_dashboard.transactionsContainer}>
          <Text style={styles_business_dashboard.sectionTitle}>Recent Transactions</Text>
          
          {businessStats.recentTransactions.map(transaction => (
            <View key={transaction.id} style={styles_business_dashboard.transactionItem}>
              <View>
                <Text style={styles_business_dashboard.customerName}>{transaction.customer}</Text>
                <Text style={styles_business_dashboard.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles_business_dashboard.pointsContainer}>
                <Text style={styles_business_dashboard.pointsValue}>{transaction.points}</Text>
                <Text style={styles_business_dashboard.pointsLabel}>points</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles_business_dashboard.viewAllButton}>
            <Text style={styles_business_dashboard.viewAllText}>View All Transactions</Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View style={styles_business_dashboard.actionsContainer}>
          <Text style={styles_business_dashboard.sectionTitle}>Quick Actions</Text>
          
          <View style={styles_business_dashboard.actionsGrid}>
            <TouchableOpacity style={styles_business_dashboard.actionButton}>
              <IconSymbol size={24} name="plus.circle" color="#0082FF" />
              <Text style={styles_business_dashboard.actionText}>New Offer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles_business_dashboard.actionButton}>
              <IconSymbol size={24} name="qrcode" color="#0082FF" />
              <Text style={styles_business_dashboard.actionText}>Scan Customer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles_business_dashboard.actionButton}>
              <IconSymbol size={24} name="chart.bar" color="#0082FF" />
              <Text style={styles_business_dashboard.actionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BusinessNavBar />
    </View>
  );
}

// Remove the styles constant from here