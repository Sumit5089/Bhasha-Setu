// Navigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Translate from './translate/Translate'; // Your existing Translate component
import UploadScreen from './document/UploadScreen';// New screen component
import TtsScreen from './TTS/TtsScreen';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Translate">
        <Stack.Screen name="Document Scanning And Beyond" component={Translate} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen name="TtsScreen" component={TtsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
