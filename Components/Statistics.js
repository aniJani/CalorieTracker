import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Themes } from '../App/Theme';
import Indicator from './Indicator';

const Statistics = ({eaten, userGoal}) => {
  const progress = userGoal > 0 ? eaten / userGoal * 100 : 0; // Fraction between 0 and 1
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/icons/serving-04.png')} style={styles.todayCalories} imageStyle={styles.imageStyle}>
        <Text style={styles.text}>Statistics</Text>
        <View style={styles.statistics}>
          <View style={styles.sides}>         
            <Text style={Themes.titles}>Eaten</Text>
            <Text style={Themes.titles}>{eaten} </Text>
          </View>
          <Indicator 
          size={100}
          strokeWidth={10}
          progress={progress}
          color="black"/>
          <View style={styles.sides}>  
            <Text style={Themes.titles}>Goal </Text>
            <Text style={Themes.titles}>{userGoal} </Text>
          </View>

        </View>
        </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    //padding: 10,
    width: "90%",
    position: "fixed",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    height: "auto", // Set fixed height here
  },
  statistics: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    width: "100%",
    padding: 20, // Adjust as needed for padding
    margin: 10,
  },
  imageStyle: {
    resizeMode: "stretch"
},
  text: {
    ...Themes.subHeading,
    textAlign: 'center',
    marginTop: 10
  },
  sides: {
    padding: 10,
    alignItems: "center",
  },
  title: {
    ...Themes.heading,
    marginBottom: 20,
  },
});

export default Statistics;
