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
  logo_url: string;
  description: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  average_spend: number;
  points_per_spend: number;
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
    logo_url: '',
    description: '',
    country: '',
    city: '',
    address: '',
    zip_code: '',
    average_spend: 0,
    points_per_spend: 1,
  });

  const [errors, setErrors] = useState<FormErrors>({});

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
      if (!formData.description.trim()) {
        newErrors.description = 'Business description is required';
      }
      // Logo URL is optional, but if provided, should be a valid URL
      if (formData.logo_url.trim() && !isValidUrl(formData.logo_url)) {
        newErrors.logo_url = 'Please enter a valid URL for the logo';
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
      if (formData.average_spend <= 0) {
        newErrors.average_spend = 'Average spend must be greater than 0';
      }
      if (formData.points_per_spend <= 0) {
        newErrors.points_per_spend = 'Points per spend must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    if (field === 'average_spend' || field === 'points_per_spend') {
      // Handle numeric fields
      let numValue: number;
      if (typeof value === 'string') {
        numValue = parseFloat(value);
        if (isNaN(numValue)) {
          numValue = 0;
        }
      } else {
        numValue = Number(value);
      }
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
      
      // Calculate rate_loyl from points_per_spend (assuming 1:1 ratio for now)
      const businessData: BusinessCreate = {
        name: formData.name,
        slug: generateSlugFromName(formData.name),
        logo_url: formData.logo_url || null,
        owner_email: userEmail,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        zip_code: formData.zip_code,
        rate_loyl: formData.points_per_spend, // Using points_per_spend as rate_loyl
      };

      console.log('🚀 [ONBOARDING] Creating business profile:', businessData);
      
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
      
      if (error?.status === 400 || error?.message?.includes('duplicate') || error?.message?.includes('already exists')) {
        Alert.alert(
          'Business Name Already Exists',
          'A business with this name already exists. Please choose a different name.',
          [{ text: 'OK' }]
        );
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

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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
          onChangeText={(value) => handleInputChange('name', value)}
          placeholder="Enter your business name"
          autoCapitalize="words"
        />
        {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Logo URL (Optional)</ThemedText>
        <TextInput
          style={[styles.input, errors.logo_url ? styles.inputError : null]}
          value={formData.logo_url}
          onChangeText={(value) => handleInputChange('logo_url', value)}
          placeholder="https://example.com/logo.png"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <ThemedText style={styles.helperText}>
          Enter a URL to your business logo image (optional)
        </ThemedText>
        {errors.logo_url && <ThemedText style={styles.errorText}>{errors.logo_url}</ThemedText>}
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
        <ThemedText style={styles.label}>Average Customer Spend *</ThemedText>
        <TextInput
          style={[styles.input, errors.average_spend ? styles.inputError : null]}
          value={formData.average_spend.toString()}
          onChangeText={(value) => {
            if (value === '' || value === '.') {
              handleInputChange('average_spend', 0);
              return;
            }
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              handleInputChange('average_spend', numValue);
            }
          }}
          placeholder="25.00"
          keyboardType="decimal-pad"
        />
        <ThemedText style={styles.helperText}>
          Average amount a customer spends per visit (in your local currency)
        </ThemedText>
        {errors.average_spend && <ThemedText style={styles.errorText}>{errors.average_spend}</ThemedText>}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Points per Spend *</ThemedText>
        <TextInput
          style={[styles.input, errors.points_per_spend ? styles.inputError : null]}
          value={formData.points_per_spend.toString()}
          onChangeText={(value) => {
            if (value === '' || value === '.') {
              handleInputChange('points_per_spend', 0);
              return;
            }
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              handleInputChange('points_per_spend', numValue);
            }
          }}
          placeholder="1.0"
          keyboardType="decimal-pad"
        />
        <ThemedText style={styles.helperText}>
          Points earned per unit of currency spent (e.g., 1.0 = 1 point per $1)
        </ThemedText>
        {errors.points_per_spend && <ThemedText style={styles.errorText}>{errors.points_per_spend}</ThemedText>}
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
          <ThemedText style={styles.summaryLabel}>Average Spend:</ThemedText>
          <ThemedText style={styles.summaryValue}>${formData.average_spend.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>Points Rate:</ThemedText>
          <ThemedText style={styles.summaryValue}>{formData.points_per_spend.toFixed(1)} points/unit</ThemedText>
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
