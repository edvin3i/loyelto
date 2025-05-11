import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AddOfferScreen() {
  const [offerName, setOfferName] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [pointsCost, setPointsCost] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const handleCreateOffer = () => {
    // Here you would typically save the offer to your database
    // For demo purposes, we'll just navigate back to the home screen
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title">Add New Offer</ThemedText>
        <View style={{ width: 20 }} />
      </ThemedView>

      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Offer name</ThemedText>
          <TextInput
            style={styles.input}
            value={offerName}
            onChangeText={setOfferName}
            placeholder="e.g. Free Pizza Margarita"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={offerDescription}
            onChangeText={setOfferDescription}
            placeholder="Describe your offer"
            multiline
            numberOfLines={4}
          />
        </ThemedView>

        <ThemedView style={styles.rowInputs}>
          <ThemedView style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <ThemedText style={styles.label}>Points cost</ThemedText>
            <TextInput
              style={styles.input}
              value={pointsCost}
              onChangeText={setPointsCost}
              placeholder="15"
              keyboardType="numeric"
            />
          </ThemedView>

          <ThemedView style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <ThemedText style={styles.label}>Quantity</ThemedText>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="300"
              keyboardType="numeric"
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.uploadSection}>
          <ThemedText style={styles.label}>Offer image</ThemedText>
          <TouchableOpacity style={styles.uploadButton}>
            <FontAwesome name="camera" size={24} color="#666" />
            <ThemedText style={styles.uploadText}>Upload image</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateOffer}
        >
          <ThemedText style={styles.createButtonText}>Create Offer</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
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
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 