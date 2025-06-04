import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      padding: 16,
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
    pointsValueContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    coinIcon: {
      width: 32,
      height: 32,
      marginLeft: 4,
      marginTop: 2,
    },
    pointsContainer: {
      alignItems: 'center',
      marginBottom: 8,
      paddingTop: 2,    // Add this
      paddingBottom: 2, // And this
    },
    pointsValue: {
      fontSize: 40,
      fontWeight: 'bold',
      lineHeight: 36, // Add this for more space
      paddingBottom: 2, // Particularly helpful on Android
      paddingTop: 2,    // Particularly helpful on iOS
    },
    pointsLabel: {
      fontSize: 14,
      color: '#666',
    },
    tabsContainer: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 1, // Prevents excessive expansion
    },
    tab: {
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 16,
      marginRight: 6,
      backgroundColor: '#F0F0F0',
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: '#E8F5E9',
    },
    tabText: {
      color: '#666',
      fontSize: 12,
      lineHeight: 14,
    },
    activeTabText: {
      color: '#4CAF50',
    },
    storeList: {
      flex: 1,
      padding: 12,
      backgroundColor: 'white',
    },
    storeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#EDF7FF',
      padding: 12,
      borderRadius: 10,
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
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    couponDigit: {
      backgroundColor: '#ABE7B2',
      width: 24,           // Fixed width
      height: 24,          // Same as width to create a circle
      borderRadius: 12,    // Half of width/height
      fontSize: 16,
      textAlign: 'center', // Center text horizontally
      lineHeight: 24,      // Match height to center vertically
      overflow: 'hidden',  // Ensure content stays within the circle
      justifyContent: 'center',
      alignItems: 'center',
    },
    couponLabel: {
      color: 'black',
      fontSize: 16,
    },
    couponDetailsContainer: {
      backgroundColor: '#EDF7FF',
      marginTop: -8,
      marginBottom: 8,
      padding: 12,
      paddingTop: 0,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      borderTopWidth: 1,
      borderTopColor: '#D0E6FF',
    },
    couponDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#D0E6FF',
    },
    couponQuantity: {
      fontSize: 14,
      fontWeight: '600',
      marginRight: 8,
      backgroundColor: '#ABE7B2',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    couponName: {
      fontSize: 14,
      fontWeight: '500',
    },
    pointsRight: {
      alignItems: 'center',
    },
    storePoints: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 36,
      paddingBottom: 2, // Particularly helpful on Android
      paddingTop: 2,    // Particularly helpful on iOS
    },
    // Add these new styles
    filterItem: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#F0F0F0',
      borderRadius: 20,
      marginRight: 10,
    },
    activeFilterItem: {
      backgroundColor: '#E0E0E0',
    },
    filterText: {
      fontSize: 14,
    },
    activeFilterText: {
      fontWeight: 'bold',
    },
    filtersScroll: {
      flexGrow: 1,
    },
    expandedSwapButton: {
      backgroundColor: '#BEE2FF',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 12,
      width: '100%', // Make button take full width
      alignItems: 'center', // Center the text horizontally
    },
    expandedSwapButtonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: '500',
    },
  });
  
  export default styles;
