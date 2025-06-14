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
    offersSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    offerItem: {
      backgroundColor: 'white',
      borderRadius: 10,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: 'row',
    },
    offerLeftContainer: {
      flex: 3,
      marginRight: 0,
      justifyContent: 'space-between',
      borderWidth: 2,
      borderRightWidth: 0.3,
      borderColor: '#BEE2FF',
      borderRadius: 10,
      padding: 10,
    },
    offerRightContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 2,
      borderLeftWidth: 0.3,
      borderColor: '#BEE2FF',
      borderRadius: 10,
      padding: 10,
    },
    offerName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    offerDescription: {
      fontSize: 16,
      color: '#666',
      marginBottom: 12,
    },
    buyButton: {
      backgroundColor: '#BEE2FF',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignSelf: 'stretch',
      marginTop: 'auto',
    },
    buyButtonText: {
      color: 'black',
      fontWeight: '600',
      fontSize: 18,
      textAlign: 'center',
    },
    offerImage: {
      width: '100%',
      height: 120,
      borderRadius: 8,
      marginBottom: 16,
    },
    priceContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    offerPrice: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#0082FF',
    },
    pointsType: {
      fontSize: 16,
      color: '#666',
    },
    offersSectionTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    offerCountBadge: {
      backgroundColor: '#ABE7B2',
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    offerCountText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
    },
});

export default business_profile_styles;