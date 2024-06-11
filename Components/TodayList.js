import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Themes } from '../App/Theme';
import { deleteLogById, fetchTodayLogItems } from '../Database';

export default function LogList({ reload, onDelete }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTodayLogItems(setData);
  }, [reload]);

  const handleDelete = (id) => {
    deleteLogById(id, () => {
      fetchTodayLogItems(setData); // Refresh the list after deletion
      onDelete(); // Trigger the reload of statistics
    });
  };

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(id)}>
         <Image source={require('../assets/icons/delete-07.png')}/>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      onSwipeableClose={() => { }}
    >
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.foodName}</Text>
        <Text style={styles.itemText}>Calories: {item.calories}</Text>
      </View>
    </Swipeable>
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
  deleteButton: {
    
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },

});
