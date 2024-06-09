import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Themes } from '../App/Theme';
import Indicator from './Indicator';

const Statistics = ({eaten, goal}) => {
  return (
    <View style={styles.container}>

        <Text style={styles.text}>Statistics</Text>
        <View style={styles.statistics}>
          <View style={styles.sides}>         
            <Text style={Themes.titles}>Eaten {eaten}</Text>
          </View>
          <Indicator 
          size={100}
          strokeWidth={10}
          progress={goal - eaten}
          color="#3b5998"/>
          <View style={styles.sides}>  
            <Text style={Themes.titles}>Goal {goal}</Text>
          </View>

        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
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
    paddingHorizontal: 20, // Adjust as needed for padding
  },
  text: {
    ...Themes.subHeading,
    textAlign: 'center',
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
