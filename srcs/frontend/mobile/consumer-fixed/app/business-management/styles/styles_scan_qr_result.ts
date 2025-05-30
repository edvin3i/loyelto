import { StyleSheet } from 'react-native';

const styles_scan_qr_result = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginVertical: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  customerCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customerInfo: {
    alignItems: 'center',
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  customerId: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0082FF',
    marginRight: 4,
    minHeight: 40,
    textAlignVertical: 'center',
    paddingVertical: 4,
  },
  pointsLabel: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  addPointsButton: {
    backgroundColor: '#0082FF',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  redeemButton: {
    backgroundColor: '#5C6BC0',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  scanAgainButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#0082FF',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#0082FF',
    fontWeight: '600',
  },
});

export default styles_scan_qr_result;