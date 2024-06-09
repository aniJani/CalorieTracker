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
