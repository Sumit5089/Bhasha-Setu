import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image, Modal, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const languageOptions = [
  { code: 'en', name: 'English (US)' },
  { code: 'es', name: 'Spanish (Spain)' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'bn', name: 'Bengali' },
];

const Translate = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [threeDotModalVisible, setThreeDotModalVisible] = useState(false);
  const [selectedLanguage1, setSelectedLanguage1] = useState('en');
  const [selectedLanguage2, setSelectedLanguage2] = useState('es');
  const [isFullscreen, setIsFullscreen] = useState(false); // Add state for fullscreen mode
  const navigation = useNavigation();

  const handleUploadNavigation = async () => {
    navigation.navigate('UploadScreen');
  };

  const handleScanNavigation = () => {
    navigation.navigate('ScanScreen'); // Assuming you have a ScanScreen component
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
      } else {
        alert('Permission to access microphone is required!');
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      setRecording(null);
      // You can process the recorded audio further if needed
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleLanguageSelect = (language, type) => {
    if (type === 'from') {
      setSelectedLanguage1(language.code);
    } else {
      setSelectedLanguage2(language.code);
    }
    setModalVisible(false);
  };

  const swapLanguages = () => {
    const temp = selectedLanguage1;
    setSelectedLanguage1(selectedLanguage2);
    setSelectedLanguage2(temp);
  };

  const handleThreeDotClick = () => {
    setThreeDotModalVisible(true);
  };

  const clearText = (setText) => {
    setText('');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Translate</Text>
        <View style={[styles.translationBox, isFullscreen && styles.fullscreenBox]}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.languageText}>
              {languageOptions.find(lang => lang.code === selectedLanguage1)?.name || 'Select Language'}
            </Text>
          </TouchableOpacity>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter text"
              placeholderTextColor="#808080"
              value={text1}
              onChangeText={setText1}
            />
            {text1 ? (
              <TouchableOpacity onPress={() => clearText(setText1)}>
                <Icon name="close" size={wp("6%")} color="#ffffff" style={styles.clearIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                <Icon name="mic" size={wp("6%")} color="#ffffff" style={styles.microphoneIcon} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.swapContainer}>
            <View style={styles.line} />
            <TouchableOpacity onPress={swapLanguages}>
              <Icon name="swap-vert" size={wp("8%")} color="#5beeee" style={styles.swapIcon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.languageText, { color: '#5beeee' }]}>
              {languageOptions.find(lang => lang.code === selectedLanguage2)?.name || 'Select Language'}
            </Text>
          </TouchableOpacity>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Translation appears here"
              placeholderTextColor="#808080"
              value={text2}
              onChangeText={setText2}
            />
            {text2 ? (
              <TouchableOpacity onPress={() => clearText(setText2)}>
                <Icon name="close" size={wp("6%")} color="#5beeee" style={styles.clearIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                <Icon name="mic" size={wp("6%")} color="#5beeee" style={styles.microphoneIcon} />
              </TouchableOpacity>
            )}
          </View>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <TouchableOpacity
            style={styles.fullscreenButton}
            onPress={toggleFullscreen}
          >
            <Icon name={isFullscreen ? "fullscreen-exit" : "fullscreen"} size={wp("6%")} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
            <Icon name="translate" size={wp("8%")} color="#5beeee" />
            <Text style={styles.footerButtonText}>Translation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={handleScanNavigation}>
            <Icon name="camera-alt" size={wp("8%")} color="#5beeee" />
            <Text style={styles.footerButtonText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={handleUploadNavigation}>
            <Icon name="upload-file" size={wp("8%")} color="#5beeee" />
            <Text style={styles.footerButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    
      {/* Three Dot Icon */}
      <TouchableOpacity style={styles.threeDotContainer} onPress={handleThreeDotClick}>
        <Icon name="more-vert" size={wp("6%")} color="#ffffff" />
      </TouchableOpacity>

      {/* Modal for Language Selection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={languageOptions}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleLanguageSelect(item, selectedLanguage1 === 'en' ? 'from' : 'to')}
              >
                <Text style={styles.modalOptionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal for Three Dot Icon */}
      <Modal
        visible={threeDotModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setThreeDotModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {['Marathi', 'Hindi', 'English'].map((language, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOption}
              onPress={() => {
                // Handle language option click
                setThreeDotModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>{language}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setThreeDotModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark mode background
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: hp("5%"),
    paddingBottom: hp("10%"),
  },
  title: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "#fff", // White text color for dark mode
    alignSelf: "flex-start",
    marginLeft: wp("5%"),
  },
  translationBox: {
    width: wp("90%"),
    backgroundColor: "#1c1c1c", // Dark background for translation box
    marginVertical: hp("3%"),
    borderRadius: 10,
    padding: wp("5%"),
    position: 'relative',
  },
  fullscreenBox: {
    width: '80%',
    height: '80%',
    marginVertical: 0,
    borderRadius: 0,
    marginTop: hp("3%"),
    padding: wp("5%"),
  },
  languageText: {
    color: "#fff", // White text color for dark mode
    fontSize: wp("4%"),
    marginBottom: hp("1%"),
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: hp("10%"),
    paddingHorizontal: wp("2%"),
    backgroundColor: "#1c1c1c", // Dark background for text input
    color: "#fff", // White text color for dark mode
    fontSize: wp("4%"),
    borderRadius: 5,
  },
  clearIcon: {
    marginLeft: wp("2%"),
  },
  microphoneIcon: {
    marginLeft: wp("2%"),
  },
  swapIcon: {
    alignSelf: "center",
    marginVertical: hp("2%"),
    marginBottom: hp("4%"),
  },
  image: {
    width: "100%",
    height: hp("30%"),
    marginVertical: hp("2%"),
    borderRadius: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: hp("2%"),
    backgroundColor: "#000", // Dark background for footer
    paddingVertical: hp("1%"),
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    marginTop: hp("1%"),
    fontSize: wp("3%"),
    color: "#fff", // White text color for dark mode
  },
  threeDotContainer: {
    position: "absolute",
    top: hp("6%"),
    right: wp("5%"),
    padding: wp("2%"),
  },
  modalContainer: {
    flex: 1,
    paddingTop: hp("11%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
  },
  modalOption: {
    padding: wp("4%"),
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: hp("0.5%"),
    width: wp("80%"),
    alignItems: "center",
  },
  modalOptionText: {
    color: "#fff",
    fontSize: wp("4%"),
  },
  modalCloseButton: {
    padding: wp("3%"),
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginTop: hp("3%"),
    marginBottom: hp("20%"),
  },
  modalCloseText: {
    color: "#fff",
    fontSize: wp("4%"),
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: hp("0%"),
    right: hp("1.5%"),
    backgroundColor: '#1c1c1c',
    borderRadius: 50,
    padding: wp("2%"),
  },
});

export default Translate;
