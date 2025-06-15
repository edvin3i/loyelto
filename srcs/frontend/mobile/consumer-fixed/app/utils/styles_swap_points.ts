import { StyleSheet } from 'react-native';

const styles_swap_points = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    fontSize: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  swapContainer: {
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  swapSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
    lineHeight: 34,
  },
  pointsInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 80,
    padding: 0,
    color: '#000',
  },
  pointsIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  maxPoints: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 8,
  },
  swapButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  swapButtonText: {
    fontSize: 20,
  },
  confirmButton: {
    backgroundColor: '#D8E0F0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default styles_swap_points; 