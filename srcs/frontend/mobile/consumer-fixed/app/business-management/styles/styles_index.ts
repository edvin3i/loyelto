import { StyleSheet } from 'react-native';

const styles_index = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
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
    paddingBottom: 8,
  },
  headerLabel: {
    fontSize: 24,
    textAlign: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 8,
  },
  balanceCaption: {
    color: '#666',
    fontSize: 14,
  },
  coinIcon: {
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  pillContainer: {
    backgroundColor: '#ABE7B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  pillText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
  sectionMyOffer: {
    marginBottom: 8,
    backgroundColor: '#DFF1FF',
    borderRadius: 8,
    padding: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // This ensures vertical centering
    marginBottom: 8,
  },
  ruleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0082FF',
    marginRight: 4,
  },
  pointsLabel: {
    color: '#666',
  },
  smallPillContainer: {
    backgroundColor: '#ABE7B2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  smallPillText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ABE7B2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
  },
  addButtonText: {
    color: 'black',
    fontSize: 16,
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#0082FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  offersList: {
    gap: 8,
    marginTop: -8,
  },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leftContent: {
    flex: 1,
    paddingRight: 16,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  offerDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  quantityContainer: {
    marginBottom: 2,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
  },
  quantityGreen: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  expiryText: {
    fontSize: 14,
    color: '#666',
  },
  expiryGreen: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  pizzaImageContainer: {
    backgroundColor: '#FFEBEE',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    minHeight: 50,
  },
  pointsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0082FF',
    lineHeight: 38,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#BEE2FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  editButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#F6CCCA',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerStatus: {
    fontSize: 12,
    color: '#666',
  },
  greenText: {
    color: '#4CAF50',
  },
  pizzaIcon: {
    backgroundColor: '#FFEBEE',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  stopButton: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stopButtonText: {
    color: '#C62828',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  smallPointsLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default styles_index;