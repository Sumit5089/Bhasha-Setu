import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const UploadScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // Default language to Hindi
  const [translatedText, setTranslatedText] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false); // New state for translation loading

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'mr', name: 'Marathi' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'te', name: 'Telugu' },
    { code: 'ml', name: 'Malayalam' },
  ];

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setImageUri(uri);
      extractTextFromImage(uri);
    } else {
      Alert.alert('No image selected');
    }
  };

  const extractTextFromImage = async (uri) => {
    setLoading(true);
    try {
      const apiKey = 'K83589140488957'; // Replace with your API key
      const formData = new FormData();
      formData.append('apikey', apiKey);
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result && result.ParsedResults && result.ParsedResults.length > 0) {
        const extractedText = result.ParsedResults[0].ParsedText;
        setExtractedText(extractedText);
        translateText(extractedText);
      } else {
        Alert.alert('No text found in image.');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      Alert.alert('Error extracting text.');
    } finally {
      setLoading(false);
    }
  };

  const translateText = async (text) => {
    setTranslationLoading(true); // Start loader for translation
    try {
      const response = await axios.post('http://192.168.1.10:5000/translate', {
        text: text,
        from: 'en', // Assuming OCR extracts text in English
        to: selectedLanguage,
      });
      setTranslatedText(response.data.translation);
    } catch (error) {
      console.error('Error translating text:', error);
      Alert.alert('Error translating text.');
    } finally {
      setTranslationLoading(false); // Stop loader for translation
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Image</Text>

      {/* Translate To Button */}
      <TouchableOpacity
        style={styles.translateButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.translateButtonText}>Translate To</Text>
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Language</Text>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.languageOption}
                onPress={() => {
                  setSelectedLanguage(item.code);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.languageText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Upload Image Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
        <Text style={styles.uploadButtonText}>Upload Here</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      )}

      {loading && !translationLoading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : translationLoading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        extractedText ? (
          <Text style={styles.extractedText}>{translatedText}</Text>
        ) : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f1f1f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  translateButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  translateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 350,
    marginTop: 20,
    borderRadius: 10,
  },
  extractedText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalTitle: {
    fontSize: 24,
    color: '#fff',
    marginTop:60,
    marginBottom: 20,
  },
  languageOption: {
    padding: 20,
    backgroundColor: '#007BFF',
    marginBottom: 15,
    borderRadius: 5,
  },
  languageText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UploadScreen;
