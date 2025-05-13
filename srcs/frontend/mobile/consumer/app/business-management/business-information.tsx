import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, ActivityIndicator, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getBusinessProfile, updateBusinessProfile, Business, BusinessUpdate } from '../utils/business_profile';

export default function BusinessInformationScreen() {
  const router = useRouter();
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

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: 'Business Information',
          headerRight: () => (
            isEditing ? (
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={handleUpdateProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => setIsEditing(true)}
              >
                <FontAwesome name="edit" size={18} color="#4CAF50" />
              </TouchableOpacity>
            )
          ),
        }}
      />
      <ScrollView style={styles.container}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  headerButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});