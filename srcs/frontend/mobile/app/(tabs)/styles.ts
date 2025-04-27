import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      padding: 16,
      paddingTop: 60,
      backgroundColor: '#FFFFFF',
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F0F0F0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 24,
    },
    greeting: {
      fontSize: 24,
      fontWeight: '600',
    },
    pointsContainer: {
      alignItems: 'center',
      marginBottom: 8,
    },
    pointsValue: {
      fontSize: 36,
      fontWeight: 'bold',
    },
    pointsLabel: {
      fontSize: 14,
      color: '#666',
    },
    tabsContainer: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 4,
      height: 16,
    flexShrink: 1, // Prevents excessive expansion
    },
    tab: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      backgroundColor: '#F0F0F0',
    },
    activeTab: {
      backgroundColor: '#E8F5E9',
    },
    tabText: {
      color: '#666',
      fontSize: 13,
    },
    activeTabText: {
      color: '#4CAF50',
    },
    storeList: {
      flex: 1,
      padding: 16,
    },
    storeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    storeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    storeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F8F9FA',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    storeIconText: {
      fontSize: 20,
    },
    storeName: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    couponBadge: {
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    couponText: {
      color: '#4CAF50',
      fontSize: 12,
    },
    pointsRight: {
      alignItems: 'flex-end',
    },
    storePoints: {
      fontSize: 20,
      fontWeight: '600',
    },
  });
  