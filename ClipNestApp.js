import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { DMmono_300Light, DMmono_400Regular, DMmono_500Medium } from '@expo-google-fonts/dm-mono';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMmono: DMmono_400Regular,
    PlayfairDisplay: PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <Text style={{color: '#e8e0d0', marginTop: 50, textAlign: 'center'}}>Loading ClipNest...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e0f" />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  },
  loading: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  }
});
