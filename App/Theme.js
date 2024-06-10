import { Platform } from 'react-native';
import * as Font from 'expo-font';

export const Themes = {

    color: {
        primary: '#E63946',
        secondary1: '#F1FAEE',
        secondary2: '#F97988',
    },

    // Text Styles
    heading :{
        fontFamily: 'bold',
        
        fontSize: 30,
    },

    subHeading: {
        fontFamily: 'semibold',
        fontSize: 28,
    },

    titles: {
        fontFamily: 'medium',
        fontSize: 22,
    },

    regular: {
        fontFamily: 'regular',
        fontSize: 18,
    },

    // Effect styles
    shadowStyles: Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 10,
        },
      }),
  };



  // Load custom fonts and then use them
  export const loadFonts = async () => {
    await Font.loadAsync({
      // 'regular': require('../assets/fonts/WestEnglandRegular-24Y3.ttf'),
      'regular': require('../assets/fonts/Pixelifysans/PixelifySans-Regular.ttf'),
      'bold': require('../assets/fonts/Pixelifysans/PixelifySans-Bold.ttf'),
      'medium': require('../assets/fonts/Pixelifysans/PixelifySans-Medium.ttf'),
      'semibold': require('../assets/fonts/Pixelifysans/PixelifySans-SemiBold.ttf'),
      'variable': require('../assets/fonts/Pixelifysans/PixelifySans-VariableFont_wght.ttf'),
    });
  };

  // Call loadFonts to load the fonts and then use them
loadFonts().then(() => {
    // Fonts are loaded, you can now safely use them in your app
  });