import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { lowLiquidNotification, lowCandyNotification, lowResourcesNotification } from '../utils';


function TestingScreen({ navigate }) {
    const [date, setDate] = React.useState("No Fetch");
    useFocusEffect(React.useCallback(() => {
        AsyncStorage.getItem("FetchDate").then((value) => {
            if (value !== null) {
                setDate(value);
            }
        });
    }, [date]));
    return (
        <ImageBackground
            blurRadius={10}
            style={styles.background}
            source={require('../assets/background.jpg')}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}>Testing Screen</Text>
                <View style={styles.info}>
                    <View style={styles.row}>
                        <Text style={styles.title}>LATEST FETCH:</Text>
                        <Text style={styles.authText}>{date}</Text>
                    </View>
                </View>
                <View style={{ width: '60%' }}>
                    <AppButton title="Test Liquid Low" onPress={() => AsyncStorage.setItem("Liquid", "Low")} />
                </View>
                <View style={{ width: '60%' }}>
                    <AppButton title="Test Candy Low" onPress={() => AsyncStorage.setItem("Candy", "Low")} />
                </View>
                <View style={{ width: '60%' }}>
                    <AppButton title="Test Both Low" onPress={() => AsyncStorage.setItem("Both", "Low")} />
                </View>
                <View style={{ width: '70%' }}>
                    <AppButton title="Test Liquid Notification" onPress={() => lowLiquidNotification()} />
                </View>
                <View style={{ width: '70%' }}>
                    <AppButton title="Test Candy Notification" onPress={() => lowCandyNotification()} />
                </View>
                <View style={{ width: '70%' }}>
                    <AppButton title="Test Both Notification" onPress={() => lowResourcesNotification()} />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    authText: {
        fontSize: 20,
        textTransform: 'uppercase',
        paddingLeft: 10,
    },
    background: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        alignItems: 'center',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 40,
    },
    title: {
        fontSize: 20,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    info: {
        paddingTop: 10,
        paddingHorizontal: 30,
    },
    row: {
        flexDirection: 'row',
        paddingBottom: 10,
        paddingHorizontal: 30,
    },
});

export default TestingScreen;
