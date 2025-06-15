import { StyleSheet } from 'react-native';

const styles_api_test = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontFamily: 'monospace',
  },
  statusBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    flex: 1,
    maxWidth: 100,
  },
  testButton: {
    backgroundColor: '#007AFF',
  },
  discoveryButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#666',
  },
  backButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  resultEndpoint: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  dataPreview: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  errorDetails: {
    fontSize: 12,
    color: '#F44336',
    fontFamily: 'monospace',
    backgroundColor: '#FFF5F5',
    padding: 8,
    borderRadius: 4,
  },
});

export default styles_api_test; 