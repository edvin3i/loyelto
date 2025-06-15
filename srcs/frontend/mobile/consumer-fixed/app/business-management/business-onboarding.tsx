import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { createBusinessProfile, BusinessCreate } from '../utils/business_profile';
import { useAuthStore } from '../../utils/providers/stores/authStore';
import { usePrivy } from '@privy-io/expo';
import styles from './styles/styles_business_information';

interface FormData {
  name: string;
  slug: string;
  description: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  rate_loyl: number;
}

interface FormErrors {
  [key: string]: string;
}


export default function BusinessOnboardingScreen() {
  const router = useRouter();
  const { user } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    country: '',
    city: '',
    address: '',
    zip_code: '',
    rate_loyl: 1.0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Get user email from Privy
  const getUserEmail = (): string => {
    if (!user?.linked_accounts) return '';
    
    const emailAccount = user.linked_accounts.find(
      (account: any) => account.type === 'email'
    );
    
    return emailAccount?.address || '';
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Business name is required';
      }
      if (!formData.slug.trim()) {
        newErrors.slug = 'Business slug is required';
      } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Business description is required';
      }
    }

    if (step === 2) {
      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.zip_code.trim()) {
        newErrors.zip_code = 'ZIP code is required';
      }
    }

    if (step === 3) {
      if (formData.rate_loyl < 0.1 || formData.rate_loyl > 100) {
        newErrors.rate_loyl = 'Loyalty rate must be between 0.1 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    if (field === 'rate_loyl') {
      // Ensure rate_loyl is always a proper decimal number
      let numValue: number;
      if (typeof value === 'string') {
        numValue = parseFloat(value);
        // If parseFloat returns NaN, default to 1.0
        if (isNaN(numValue)) {
          numValue = 1.0;
        }
      } else {
        numValue = Number(value);
      }
      
      // Ensure it's a proper decimal (not integer)
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    handleInputChange('name', value);
    // Auto-generate slug if it's empty or matches the previous auto-generated slug
    if (!formData.slug || formData.slug === generateSlugFromName(formData.name)) {
      handleInputChange('slug', generateSlugFromName(value));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    const userEmail = getUserEmail();
    if (!userEmail) {
      Alert.alert('Error', 'Unable to get user email. Please try logging in again.');
      return;
    }

    try {
      setLoading(true);
      
      // Ensure rate_loyl is sent as a proper decimal by parsing it as float
      const businessData: BusinessCreate = {
        ...formData,
        rate_loyl: parseFloat(formData.rate_loyl.toString()), // Force decimal conversion
        owner_email: userEmail,
        logo_url: null, // Can be added later
      };

      console.log('🚀 [ONBOARDING] Creating business profile:', businessData);
      console.log('🔍 [ONBOARDING] rate_loyl type:', typeof businessData.rate_loyl, 'value:', businessData.rate_loyl);
      console.log('🔍 [ONBOARDING] rate_loyl as string:', businessData.rate_loyl.toString());
      
      await createBusinessProfile(businessData);
      
      console.log('✅ [ONBOARDING] Business profile created successfully');
      
      Alert.alert(
        'Success!',
        'Your business profile has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/business-management'),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ [ONBOARDING] Failed to create business profile:', error);
      
      // Handle specific error cases
      if (error?.status === 400 || error?.message?.includes('duplicate') || error?.message?.includes('already exists')) {
        Alert.alert(
          'Business Name Already Exists',
          'A business with this name already exists. Please choose a different name.',
          [{ text: 'OK' }]
        );
        // Go back to step 1 to change the name
        setCurrentStep(1);
      } else {
        Alert.alert(
          'Error',
          'Failed to create your business profile. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              step <= currentStep ? styles.progressStepActive : styles.progressStepInactive,
            ]}
          />
        ))}
      </View>
      <ThemedText style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </ThemedText>
    </View>
  );

  const renderStep1 = () => (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Business Information
      </ThemedText>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Business Name *</ThemedText>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          value={formData.name}
          onChangeText={handleNameChange}
          placeholder="Enter your business name"
          autoCapitalize="words"
        />
        {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Business Slug *</ThemedText>
        <TextInput
          style={[styles.input, errors.slug ? styles.inputError : null]}
          value={formData.slug}
          onChangeText={(value) => handleInputChange('slug', value)}
          placeholder="business-slug"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ThemedText style={styles.helperText}>
          This will be used in your business URL. Only lowercase letters, numbers, and hyphens allowed.
        </ThemedText>
        {errors.slug && <ThemedText style={styles.errorText}>{errors.slug}</ThemedText>}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Business Description *</ThemedText>
        <TextInput
          style={[styles.textArea, errors.description ? styles.inputError : null]}
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          placeholder="Describe your business..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {errors.description && <ThemedText style={styles.errorText}>{errors.description}</ThemedText>}
      </View>
    </ThemedView>
  );

  const renderStep2 = () => (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Business Location
      </ThemedText>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Country *</ThemedText>
        <TextInput
          style={[styles.input, errors.country ? styles.inputError : null]}
          value={formData.country}
          onChangeText={(value) => handleInputChange('country', value)}
          placeholder="Enter country"
          autoCapitalize="words"
        />
        {errors.country && <ThemedText style={styles.errorText}>{errors.country}</ThemedText>}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>City *</ThemedText>
        <TextInput
          style={[styles.input, errors.city ? styles.inputError : null]}
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
          placeholder="Enter city"
          autoCapitalize="words"
        />
        {errors.city && <ThemedText style={styles.errorText}>{errors.city}</ThemedText>}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Address *</ThemedText>
        <TextInput
          style={[styles.input, errors.address ? styles.inputError : null]}
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
          placeholder="Enter full address"
          autoCapitalize="words"
        />
        {errors.address && <ThemedText style={styles.errorText}>{errors.address}</ThemedText>}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>ZIP Code *</ThemedText>
        <TextInput
          style={[styles.input, errors.zip_code ? styles.inputError : null]}
          value={formData.zip_code}
          onChangeText={(value) => handleInputChange('zip_code', value)}
          placeholder="Enter ZIP code"
          autoCapitalize="characters"
        />
        {errors.zip_code && <ThemedText style={styles.errorText}>{errors.zip_code}</ThemedText>}
      </View>
    </ThemedView>
  );

  const renderStep3 = () => (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Loyalty Settings
      </ThemedText>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Loyalty Rate *</ThemedText>
        <TextInput
          style={[styles.input, errors.rate_loyl ? styles.inputError : null]}
          value={formData.rate_loyl.toString()}
          onChangeText={(value) => {
            // Handle empty string case
            if (value === '' || value === '.') {
              handleInputChange('rate_loyl', 0.0);
              return;
            }
            
            // Parse the value and ensure it's a decimal
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              handleInputChange('rate_loyl', numValue);
            }
          }}
          placeholder="1.0"
          keyboardType="decimal-pad"
        />
        <ThemedText style={styles.helperText}>
          Points earned per dollar spent (e.g., 1.0 = 1 point per $1)
        </ThemedText>
        {errors.rate_loyl && <ThemedText style={styles.errorText}>{errors.rate_loyl}</ThemedText>}
      </View>

      <View style={styles.summaryContainer}>
        <ThemedText type="subtitle" style={styles.summaryTitle}>
          Summary
        </ThemedText>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>Business:</ThemedText>
          <ThemedText style={styles.summaryValue}>{formData.name}</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>Location:</ThemedText>
          <ThemedText style={styles.summaryValue}>{formData.city}, {formData.country}</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>Email:</ThemedText>
          <ThemedText style={styles.summaryValue}>{getUserEmail()}</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>Loyalty Rate:</ThemedText>
          <ThemedText style={styles.summaryValue}>{formData.rate_loyl.toFixed(1)} points/$</ThemedText>
        </View>
      </View>
    </ThemedView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.pageHeader}>
            <ThemedText type="title" style={styles.pageTitle}>
              Welcome to LoyelTo!
            </ThemedText>
            <ThemedText style={styles.pageSubtitle}>
              Let's set up your business profile
            </ThemedText>
          </View>

          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Current Step Content */}
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {currentStep > 1 && (
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBack}
                disabled={loading}
              >
                <FontAwesome name="chevron-left" size={16} color="#666" />
                <ThemedText style={styles.backButtonText}>Back</ThemedText>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.nextButton, 
                loading && styles.buttonDisabled,
                currentStep === 1 && styles.nextButtonFullWidth
              ]} 
              onPress={handleNext}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <ThemedText style={styles.nextButtonText}>
                    {currentStep === totalSteps ? 'Create Business' : 'Next'}
                  </ThemedText>
                  {currentStep < totalSteps && (
                    <FontAwesome name="chevron-right" size={16} color="#fff" />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
