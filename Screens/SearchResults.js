import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

export default function SearchResults({ route, navigation }) {
    const { searchQuery } = route.params;
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchResults = async (pageNum) => {
        if (!searchQuery.trim()) return;
        if (pageNum === 1) {
            setIsLoading(true);
        } else {
            setIsFetchingMore(true);
        }
        setError(null);
        try {
            const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchQuery)}&pageSize=10&pageNumber=${pageNum}&api_key=ChBEanL4ik3vuOZlPG3hdsgIqImCBwOQ9pELsrV5`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Something went wrong!');
            const data = await response.json();

            const newResults = data.foods.map(food => ({
                ...food,
                calories: food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 'N/A',
            }));

            if (pageNum === 1) {
                setResults(newResults);
            } else {
                setResults(prevResults => [...prevResults, ...newResults]);
            }

        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchResults(page);
    }, [page]);

    const loadMoreResults = () => {
        if (!isFetchingMore && !isLoading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setPage(1);
        fetchResults(1);
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.description}</Text>
            <Text style={styles.itemText}>Calories: {item.calories}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {isLoading && !isRefreshing && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {!isLoading && !error && results.length > 0 && (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.fdcId.toString()}
                    onEndReached={loadMoreResults}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={isFetchingMore && <ActivityIndicator size="large" color="#0000ff" />}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
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
