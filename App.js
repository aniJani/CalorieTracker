import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationStack from "./App/NavigationContainer"
import { loadFonts } from './App/Theme';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const loadApp = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };

    loadApp();
  }, []);
  if (setFontsLoaded){
    return (
      <NavigationStack />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
