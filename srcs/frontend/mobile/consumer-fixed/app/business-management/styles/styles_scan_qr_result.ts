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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
    alignItems: 'flex-start',
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
    justifyContent: 'flex-end',
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
    flexDirection: 'column',
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  addPointsButton: {
    backgroundColor: '#ABE7B2',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  redeemButton: {
    backgroundColor: '#F6CCCA',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 8,
  },
  vouchersSection: {
    width: '100%',
    marginTop: 8,
  },
  vouchersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vouchersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  vouchersBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vouchersBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  voucherCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  voucherContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  voucherInfo: {
    flex: 1,
    paddingRight: 12,
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  voucherImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  voucherImage: {
    width: 60,
    height: 60,
  },
  useVoucherButton: {
    backgroundColor: '#B3D9FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useVoucherText: {
    color: '#0066CC',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default styles_scan_qr_result;