import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Themes } from '../App/Theme';

const Statistics = () => {
  return (
    <View style={styles.container}>

        <Text style={styles.text}>Statistics</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "90%",
    position: "fixed",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    height: "auto", // Set fixed height here
  },
  text: {
    ...Themes.subHeading,
    textAlign: 'center',
    margin: 10,
  },
  title: {
    ...Themes.heading,
    marginBottom: 20,
  },
});

export default Statistics;
