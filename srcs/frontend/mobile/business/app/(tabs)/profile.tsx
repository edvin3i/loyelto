import { StyleSheet, ScrollView, TouchableOpacity, View, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>

      <ThemedView style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImagePlaceholder}>
            <FontAwesome name="user" size={40} color="#4CAF50" />
          </View>
          <TouchableOpacity style={styles.editImageButton}>
            <FontAwesome name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.businessName}>
          Pizza Palace
        </ThemedText>
        <ThemedText style={styles.businessEmail}>
          manager@pizzapalace.com
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.settingsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Business Settings
        </ThemedText>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="building" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Business Information</ThemedText>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="credit-card" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Payment Methods</ThemedText>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="users" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Team Management</ThemedText>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="sliders" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Loyalty Program Settings</ThemedText>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.settingsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          App Settings
        </ThemedText>

        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="bell" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Notifications</ThemedText>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#e0e0e0', true: '#C4E9C8' }}
            thumbColor={notificationsEnabled ? '#4CAF50' : '#f5f5f5'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="moon-o" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Dark Mode</ThemedText>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#e0e0e0', true: '#C4E9C8' }}
            thumbColor={darkModeEnabled ? '#4CAF50' : '#f5f5f5'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="lock" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Privacy & Security</ThemedText>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <FontAwesome name="question-circle" size={20} color="#4CAF50" style={styles.settingIcon} />
            <ThemedText>Help & Support</ThemedText>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </TouchableOpacity>
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton}>
        <FontAwesome name="sign-out" size={18} color="#D32F2F" style={styles.logoutIcon} />
        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  businessEmail: {
    color: '#666',
  },
  settingsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 30,
    marginRight: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
}); 