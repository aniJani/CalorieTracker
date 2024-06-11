import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Themes } from '../App/Theme';
import { fetchHistory } from '../Database';

export default function History({ navigation }) {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        fetchHistory(setHistoryData);
    }, []);

    const renderHistoryItem = ({ item }) => (

        <View>
            <ImageBackground source={require("../assets/icons/history-08.png")} style={styles.historyBox} imageStyle={styles.imageStyle}>
                <Text style={styles.historyText}>{item.date}</Text>
                <Text style={styles.historyText}>{item.totalCalories} kcal</Text>
            </ImageBackground>

        </View>
    );

    const onGestureEvent = (event) => {
        if (event.nativeEvent.translationX > 100) {
            navigation.navigate('Home');
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
            <View style={styles.container}>
                <Text style={styles.title}>History</Text>
                <FlatList
                    data={historyData}
                    renderItem={renderHistoryItem}
                    keyExtractor={(item) => item.date}
                    numColumns={5}
                    contentContainerStyle={styles.historyContainer}
                />
            </View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    title: {
        ...Themes.heading,
        marginVertical: 30,
    },
    historyContainer: {

        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        resizeMode: "contain",
    },

    historyBox: {

        height: 70,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#f0f0f0',

    },
    historyText: {
        ...Themes.regular,
        textAlign: 'center',
    },
});
