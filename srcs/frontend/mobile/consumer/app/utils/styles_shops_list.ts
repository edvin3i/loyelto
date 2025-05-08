import { StyleSheet } from 'react-native';

const styles_shops_list = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
    },
    balanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F8FF',
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#E1F5FE',
    },
    balanceTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 10,
      flex: 1,
    },
    pointsSection: {
      alignItems: 'flex-end',
    },
    pointsValue: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    pointsLabel: {
      fontSize: 14,
      color: '#666',
    },
    filtersContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    searchButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E1F5FE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    filtersScroll: {
      flexGrow: 1,
    },
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
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    sortText: {
      fontSize: 14,
      marginRight: 5,
    },
    listContainer: {
      padding: 16,
    },
    shopItemContainer: {
      marginBottom: 8,
      borderRadius: 12,
      overflow: 'hidden',
    },
    shopItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    shopName: {
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 10,
    },
    couponContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    promotionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    couponBadge: {
      backgroundColor: '#CCFFCC',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      marginRight: 10,
    },
    couponText: {
      fontSize: 14,
      fontWeight: '500',
      color: 'gray',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 14,
      marginLeft: 5,
      color: 'gray',
    },
    promotionText: {
      fontSize: 14,
      color: 'black',
    },
  });

export default styles_shops_list;