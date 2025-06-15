import { StyleSheet } from 'react-native';

const styles_login_choice = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
    justifyContent: 'space-between',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0082FF',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  choiceContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 40,
  },
  choiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  choiceButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#F0F7FF',
    borderRadius: 30,
  },
  choiceLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  choiceTextContainer: {
    flex: 1,
  },
  choiceButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  choiceButtonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  apiTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  apiTestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles_login_choice; 