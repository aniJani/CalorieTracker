import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Themes } from '../App/Theme';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const executeSearch = async () => {
    if (!searchQuery.trim()) return;  // Avoid empty queries
    setIsLoading(true);
    setError(null);
    setIsLoading(false);
    navigation.navigate('SearchResults', { searchQuery: searchQuery })
    // try {
    //   const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchQuery)}&pageSize=1&api_key=ChBEanL4ik3vuOZlPG3hdsgIqImCBwOQ9pELsrV5`;
    //   const response = await fetch(apiUrl);
    //   if (!response.ok) throw new Error('Something went wrong!');
    //   const data = await response.json();

    //   // Extract calorie information from the first result
    //   const foodItem = data.foods[0];
    //   const calories = foodItem.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 'N/A';

    //   setResults([{ ...foodItem, calories }]);  // Update the state with the search results

    // } catch (error) {
    //   setError(error.message);
    //   Alert.alert('Error', error.message);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // const renderItem = ({ item }) => (
  //   <View style={styles.item}>
  //     <Text style={styles.itemText}>{item.description}</Text>
  //     <Text style={styles.itemText}>Calories: {item.calories}</Text>
  //   </View>


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CalorieTracker!</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleSearchChange}
        value={searchQuery}
        placeholder="Search here..."
        keyboardType="default"
        returnKeyType="search"
        onSubmitEditing={executeSearch}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!isLoading && !error && results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.fdcId.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    ...Themes.heading,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
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
