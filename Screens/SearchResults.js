import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Themes } from '../App/Theme';
import { addFoodToLog as addFoodToLogDB, fetchLocalResults, fetchTodayCalories, fetchTodayLogItems } from '../Database';

export default function SearchResults({ route, navigation }) {
    const { searchQuery } = route.params;
    const [localResults, setLocalResults] = useState([]);
    const [apiResults, setApiResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [servings, setServings] = useState(1);
    const [todayCalories, setTodayCalories] = useState(0);
    const [connectionError, setConnectionError] = useState(false);

    const loadLocalResults = async () => {
        await fetchLocalResults(searchQuery, setLocalResults);
    };

    const fetchApiResults = async (pageNum) => {
        if (!searchQuery.trim()) return;
        if (pageNum === 1) {
            setIsLoading(true);
        } else {
            setIsFetchingMore(true);
        }
        setError(null);
        setConnectionError(false);
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
                setApiResults(newResults);
            } else {
                setApiResults(prevResults => [...prevResults, ...newResults]);
            }

        } catch (error) {
            setError(error.message);
            setConnectionError(true);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadLocalResults();
        fetchApiResults(page);
        fetchTodayCalories(setTodayCalories);
    }, [page]);

    const loadMoreResults = () => {
        if (!isFetchingMore && !isLoading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setPage(1);
        loadLocalResults();
        fetchApiResults(1);
    };

    const addFoodToLog = () => {
        addFoodToLogDB(selectedFood.description, selectedFood.calories, servings, (caloriesToAdd) => {
            setTodayCalories(prevCalories => prevCalories + caloriesToAdd);
        });
        setSelectedFood(null);
        setServings(1);
    };

    const renderLocalItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedFood(item)}>
            <View style={styles.item}>
                <Text style={styles.itemText}>{item.foodName}</Text>
                <Text style={styles.itemText}>Calories: {item.calories}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderApiItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedFood(item)}>
            <View style={styles.item}>
                <Text style={styles.itemText}>{item.description}</Text>
                <Text style={styles.itemText}>Calories: {item.calories}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.pageContainer}>
            {isLoading && !isRefreshing ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <ImageBackground source={require('../assets/icons/search-06.png')} style={styles.resultsContainer} imageStyle={styles.imageStyle}>
                    <View>
                        {isLoading && !isRefreshing && <ActivityIndicator size="large" color="#0000ff" />}
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        <Text style={styles.sectionTitle}>Previous Foods</Text>
                        {localResults.length > 0 ? (
                            <FlatList
                                data={localResults}
                                renderItem={renderLocalItem}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        ) : (
                            <Text>No previous foods found.</Text>
                        )}
                        <Text style={styles.sectionTitle}>API Search Results</Text>
                        {connectionError ? (
                            <Text>Connection failure. Unable to fetch API search results.</Text>
                        ) : (
                            !isLoading && !error && apiResults.length > 0 && (
                                <FlatList
                                    data={apiResults}
                                    renderItem={renderApiItem}
                                    keyExtractor={(item) => item.fdcId.toString()}
                                    onEndReached={loadMoreResults}
                                    onEndReachedThreshold={0.5}
                                    ListFooterComponent={isFetchingMore && <ActivityIndicator size="large" color="#0000ff" />}
                                    refreshing={isRefreshing}
                                    onRefresh={handleRefresh}
                                />
                            )
                        )}
                        {selectedFood && (
                            <ImageBackground source={require('../assets/icons/serving-04.png')} style={styles.foodDetail} imageStyle={styles.imageStyle}>
                                <View>
                                    <Text style={styles.input}>{selectedFood.description || selectedFood.foodName}</Text>
                                    <View style={styles.servingsControl}>
                                        <TouchableOpacity onPress={() => setServings(Math.max(1, servings - 1))}>
                                            <Image source={require('../assets/icons/buttons-03.png')} />
                                        </TouchableOpacity>
                                        <Text style={Themes.titles}>{servings}</Text>
                                        <TouchableOpacity onPress={() => setServings(Math.max(1, servings + 1))}>
                                            <Image source={require('../assets/icons/buttons-01.png')} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.addFoodToLog}>
                                    <TouchableOpacity onPress={addFoodToLog}>
                                        <Image source={require('../assets/icons/buttons-02.6.png')} style={styles.buttonImage} />
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        )}
                        <ImageBackground source={require('../assets/icons/todays-06.png')} style={styles.todayCalories} imageStyle={styles.imageStyle}>
                            <View>
                                <Text style={styles.itemText}>Today's Calorie: {todayCalories}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                </ImageBackground>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    resultsContainer: {
        flex: 1,
        margin: 20,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    sectionTitle: {
        ...Themes.heading,
        marginVertical: 10,
    },
    addFoodToLog: {
        margin: 10,
    },
    input: {
        ...Themes.regular,
        height: 40,
        width: '95%',
        padding: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    item: {
        marginHorizontal: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        ...Themes.regular,
    },
    servingsControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    todayCalories: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 20,
    },
    imageStyle: {
        resizeMode: 'contain'
    },
    buttonImage: {
        alignSelf: "center",
        width: "110%",  // Set your desired width
        margin: -10,
        //height: 45, // Set your desired height
        resizeMode: 'contain',
    },
    todayCaloriesText: {
        ...Themes.regular,
    },
    foodDetail: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        padding: 20,

    },
    foodDetailText: {
        fontSize: 18,
        marginBottom: 10,
    }
});