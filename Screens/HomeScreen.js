import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Themes } from '../App/Theme';
import Statistics from '../Components/Statistics';
import LogList from '../Components/TodayList';
import { fetchCalorieGoal, fetchTodayCalories, setCalorieGoal } from '../Database';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [calorieGoal, setCalorieGoalState] = useState('');
  const [eatenCalories, setEatenCalories] = useState(0);
  const [reload, setReload] = useState(false);

  const loadData = useCallback(() => {
    fetchCalorieGoal((goal) => {
      if (goal === null) {
        setIsModalVisible(true);
      } else {
        setCalorieGoalState(goal);
      }
    });

    fetchTodayCalories(setEatenCalories);
    setReload((prev) => !prev); // Toggle the reload state
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const executeSearch = async () => {
    if (!searchQuery.trim()) return;  // Avoid empty queries
    setIsLoading(true);
    setError(null);
    setIsLoading(false);
    navigation.navigate('SearchResults', { searchQuery: searchQuery });
  };

  const handleSetCalorieGoal = () => {
    const goal = parseInt(calorieGoal, 10);
    if (isNaN(goal) || goal <= 0) {
      Alert.alert('Invalid Calorie Goal', 'Please enter a valid number for the calorie goal.');
      return;
    }
    setCalorieGoal(goal, () => {
      setIsModalVisible(false);
      setReload((prev) => !prev); // Trigger reload after setting the goal
    });
  };

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -100) {
      navigation.navigate('History');
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
          onGestureEvent({ nativeEvent });
        }
      }}
    >
      <View style={styles.pageContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>TODAY</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Statistics
              eaten={eatenCalories}
              userGoal={calorieGoal} />
          </TouchableOpacity>
          <ImageBackground source={require('../assets/icons/todays-06.png')} style={styles.search} imageStyle={styles.imageStyle}>
            <TextInput
              onChangeText={handleSearchChange}
              value={searchQuery}
              placeholder="Search here..."
              keyboardType="default"
              returnKeyType="search"
              onSubmitEditing={executeSearch}
            />
          </ImageBackground>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <LogList reload={reload} onDelete={loadData} />
        </View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Your Calorie Goal</Text>
              <TextInput
                style={styles.input}
                onChangeText={setCalorieGoalState}
                value={calorieGoal}
                placeholder="Enter calorie goal"
                keyboardType="numeric"
              />
              <Button title="Set Goal" onPress={handleSetCalorieGoal} />
            </View>
          </View>
        </Modal>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20
  },
  title: {
    ...Themes.heading,
    marginVertical: 30,
  },
  imageStyle: {
    resizeMode: 'contain',

  },
  search: {
    alignItems: 'center',
    height: "auto",
    width: '105%',
    padding: 10,
  },
  input: {
    height: 40,
    width: '90%',
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});
