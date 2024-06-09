import React, { useState } from 'react';
import { FlatList, StyleSheet, Text,  View } from 'react-native';
import { Themes } from '../App/Theme';

export default function LogList() {
const [data, setData] = useState([
    { id: '1', title: 'Log Item 1' },
    { id: '2', title: 'Log Item 2' },
    { id: '3', title: 'Log Item 3' },
    ]);

    const renderItem = ({ item }) => (
    <View style={styles.item}>
        <Text style={styles.itemText}>{item.title}</Text>
    </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});
