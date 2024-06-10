import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Themes } from '../App/Theme';
import { fetchTodayLogItems } from '../Database';

export default function LogList({ reload }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTodayLogItems(setData);
  }, [reload]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.foodName}</Text>
      <Text style={styles.itemText}>Calories: {item.calories}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "90%",
    height: "auto",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    ...Themes.regular,
    fontSize: 20,
  },
  list: {
    width: '100%',
  },
});
