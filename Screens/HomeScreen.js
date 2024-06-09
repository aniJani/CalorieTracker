import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Themes } from '../App/Theme';

export default function HomeScreen() {
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
    try {
      // Placeholder for API request - replace with your actual API call
      const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchQuery)}&api_key=ChBEanL4ik3vuOZlPG3hdsgIqImCBwOQ9pELsrV5`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Something went wrong!');
      const data = await response.json();
      // Handle the search results as needed
      
      Alert.alert('Search Results', JSON.stringify(data)); // Example of handling results
    } catch (error) {
      setError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CalorieTracker!</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleSearchChange}
        value={searchQuery}
        placeholder="Search here..."
        keyboardType="default"
        returnKeyType="search" // Changes the return key to say "Search"
        onSubmitEditing={executeSearch} // Triggers the search when "Done" is pressed
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
    marginBottom: 20,  // Added margin for better spacing
  },
  input: {
    height: 40,
    width: '80%',  // Specifies the width of the input field
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