import { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { getBusinessProfile, updateBusinessProfile, Business, BusinessUpdate } from '../utils/business_profile';
import BusinessNavBar from './components/BusinessNavBar';
import styles from './styles/styles_business_information';
import { useAuthStore } from '../../utils/providers/stores/authStore';
import { usePrivy } from '@privy-io/expo';

export default function BusinessInformationScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { logout: privyLogout } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState<BusinessUpdate>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadBusinessProfile();
  }, []);

  const loadBusinessProfile = async () => {
    try {
      setLoading(true);
      const data = await getBusinessProfile();
      setBusiness(data);
      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description,
        country: data.country,
        city: data.city,
        address: data.address,
        zip_code: data.zip_code,
        owner_email: data.owner_email,
      });
    } catch (error) {
      console.error('Failed to load business profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const updatedBusiness = await updateBusinessProfile(formData);
      setBusiness(updatedBusiness);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update business profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof BusinessUpdate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 [LOGOUT] Starting complete logout...');
              
              // 1. Logout from Privy first
              console.log('🔄 [LOGOUT] Logging out from Privy...');
              await privyLogout();
              
              // 2. Clear app state
              console.log('🔄 [LOGOUT] Clearing app authentication state...');
              await logout();
              
              console.log('✅ [LOGOUT] Complete logout successful');
              router.replace('/login-choice');
            } catch (error) {
              console.error('❌ [LOGOUT] Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <BusinessNavBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Page Header with Edit and Logout Buttons */}
        <View style={styles.pageHeader}>
          <ThemedText type="title" style={styles.pageTitle}>
            Profile
          </ThemedText>
          <View style={styles.headerActions}>
            {isEditing ? (
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setIsEditing(false)}
                >
                  <FontAwesome name="times" size={18} color="#666" />
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleUpdateProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <FontAwesome name="check" size={18} color="#fff" />
                      <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => setIsEditing(true)}
                >
                  <FontAwesome name="edit" size={18} color="#4CAF50" />
                  <ThemedText style={styles.editButtonText}>Edit</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.logoutButton} 
                  onPress={handleLogout}
                >
                  <FontAwesome name="sign-out" size={18} color="#FF4444" />
                  <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Dashboard Button */}
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={() => router.push('/business-management/business_dashboard')}
        >
          <FontAwesome name="dashboard" size={18} color="#fff" />
          <ThemedText style={styles.dashboardButtonText}>View Dashboard</ThemedText>
        </TouchableOpacity>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            General Information
          </ThemedText>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Business Name</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Business Name"
              />
            ) : (
              <ThemedText style={styles.value}>{business?.name}</ThemedText>
            )}
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Slug</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.slug}
                onChangeText={(value) => handleInputChange('slug', value)}
                placeholder="Slug"
              />
            ) : (
              <ThemedText style={styles.value}>{business?.slug}</ThemedText>
            )}
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Description"
                multiline
                numberOfLines={3}
              />
            ) : (
              <ThemedText style={styles.value}>{business?.description}</ThemedText>
            )}
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.owner_email}
                onChangeText={(value) => handleInputChange('owner_email', value)}
                placeholder="Email"
                keyboardType="email-address"
              />
            ) : (
              <ThemedText style={styles.value}>{business?.owner_email}</ThemedText>
            )}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Location
          </ThemedText>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Country</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.country}
                onChangeText={(value) => handleInputChange('country', value)}
                placeholder="Country"
              />
            ) : (
              <ThemedText style={styles.value}>{business?.country}</ThemedText>
            )}
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>City</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="City"
              />
            ) : (
              <ThemedText style={styles.value}>{business?.city}</ThemedText>
            )}
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Address</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Address"
              />
            ) : (
              <ThemedText style={styles.value}>{business?.address}</ThemedText>
            )}
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>ZIP Code</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.zip_code}
                onChangeText={(value) => handleInputChange('zip_code', value)}
                placeholder="ZIP Code"
              />
            ) : (
              <ThemedText style={styles.value}>{business?.zip_code}</ThemedText>
            )}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Additional Information
          </ThemedText>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Created At</ThemedText>
            <ThemedText style={styles.value}>
              {business?.created_at ? new Date(business.created_at).toLocaleDateString() : ''}
            </ThemedText>
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Last Updated</ThemedText>
            <ThemedText style={styles.value}>
              {business?.updated_at ? new Date(business.updated_at).toLocaleDateString() : ''}
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
      <BusinessNavBar />
    </SafeAreaView>
  );
}