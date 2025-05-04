import { StyleSheet } from 'react-native';

const business_profile_styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    logo: {
      width: '100%',
      height: 200,
    },
    businessName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 16,
      marginHorizontal: 16,
    },
    ratingAddressContainer: {
      marginHorizontal: 16,
      marginTop: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    ratingText: {
      marginLeft: 4,
      fontSize: 16,
    },
    addressText: {
      fontSize: 14,
      color: '#666',
    },
    infoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginTop: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#F0F0F0',
      borderRadius: 8,
    },
    infoButtonText: {
      fontSize: 16,
    },
    expandedInfo: {
      marginHorizontal: 16,
      marginTop: 8,
      padding: 16,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
    },
    hoursText: {
      fontSize: 14,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
    },
    offersSection: {
      marginTop: 24,
      marginHorizontal: 16,
      marginBottom: 24,
    },
    offersSectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    offerItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    offerName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    offerDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 12,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    offerPrice: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007AFF',
      marginRight: 4,
    },
    pointsType: {
      fontSize: 14,
      color: '#666',
    },
  });

  export default business_profile_styles;