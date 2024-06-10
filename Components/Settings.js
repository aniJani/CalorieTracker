import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
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
            <Text style={styles.title}>Settings</Text>
            <Button title="Delete Today's Logs" onPress={handleDeleteTodayLogs} color="black" />
            <Button title="Delete All Logs" onPress={handleDeleteAllLogs} color="black" />
            <Button title="Delete All Foods" onPress={handleDeleteAllFoods} color="black" />
            <TextInput
                style={styles.input}
                onChangeText={setNewCalorieGoal}
                value={newCalorieGoal}
                placeholder="Enter new calorie goal"
                keyboardType="numeric"
            />
            <Button title="Set New Calorie Goal" onPress={handleSetCalorieGoal} color="black" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        ...Themes.heading,
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});
