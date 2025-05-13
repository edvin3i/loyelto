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
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  pillContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  pillText: {
    color: '#0082FF',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  sectionMyOffer: {
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ruleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
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
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  smallPillText: {
    color: '#0082FF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#000',
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
    gap: 12,
  },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  offerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  offerDescription: {
    color: '#666',
    marginVertical: 4,
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