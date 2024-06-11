import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, ImageBackground, TouchableOpacity } from 'react-native';
import { Themes } from '../App/Theme';
import { deleteAllFoods, deleteAllLogs, deleteTodayLogs, setCalorieGoal } from '../Database';

export default function Settings() {
    const [newCalorieGoal, setNewCalorieGoal] = useState('');

    const handleDeleteTodayLogs = () => {
        deleteTodayLogs(() => {
            Alert.alert('Success', 'Today\'s logs deleted successfully');
        });
    };

    const handleDeleteAllLogs = () => {
        deleteAllLogs(() => {
            Alert.alert('Success', 'All logs deleted successfully');
        });
    };

    const handleDeleteAllFoods = () => {
        deleteAllFoods(() => {
            Alert.alert('Success', 'All foods deleted successfully');
        });
    };

    const handleSetCalorieGoal = () => {
        const goal = parseInt(newCalorieGoal, 10);
        if (isNaN(goal) || goal <= 0) {
            Alert.alert('Invalid Calorie Goal', 'Please enter a valid number for the calorie goal.');
            return;
        }
        setCalorieGoal(goal, () => {
            Alert.alert('Success', 'Calorie goal set successfully');
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.resultsContainer}>
                
            <Text style={styles.title}>Settings</Text>
            
            
                <ImageBackground source={require('../assets/icons/todays-06.png')} style={styles.search} imageStyle={styles.imageStyle}>
                    <TextInput
                        onChangeText={setNewCalorieGoal}
                        value={newCalorieGoal}
                        placeholder="Enter new calorie goal"
                        keyboardType="numeric"
                    />
                </ImageBackground>

                <ImageBackground source={require('../assets/icons/todays-06.png')} style={styles.button} imageStyle={styles.imageStyle}>
                    <TouchableOpacity onPress={handleSetCalorieGoal} >  
                        <Text style={Themes.regular}>Set New Calorie Goal</Text>
                    </TouchableOpacity>
                </ImageBackground>

                <ImageBackground source={require('../assets/icons/todays-06.png')} style={styles.button} imageStyle={styles.imageStyle}>
                    <TouchableOpacity onPress={handleDeleteTodayLogs} >  
                        <Text style={Themes.regular}>Delete Today's Logs</Text>
                    </TouchableOpacity>
                </ImageBackground>

                <ImageBackground source={require('../assets/icons/todays-06.png')} style={styles.button} imageStyle={styles.imageStyle}>
                    <TouchableOpacity onPress={handleDeleteAllLogs} >  
                        <Text style={Themes.regular}>Delete All Logs</Text>
                    </TouchableOpacity>
                </ImageBackground>

                <ImageBackground source={require('../assets/icons/todays-06.png')} style={styles.button} imageStyle={styles.imageStyle}>
                    <TouchableOpacity onPress={handleDeleteAllFoods} >  
                        <Text style={Themes.regular}>Delete All Foods</Text>
                    </TouchableOpacity>
                </ImageBackground>

            </View>
            




        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
 
    },
    resultsContainer: {
        height: "100%",
        margin: 20,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding:10,
        position: "static",
    },
    title: {
        ...Themes.heading,
        marginBottom: 20,
    },
    search: {
        alignItems: 'center',
        justifyContent: "center",
        height: 50,
        width: '100%',
        alignSelf: "center"
    },

    imageStyle: {
        resizeMode: 'contain',
    },
    button: {
        width: '100%',
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    }
});
