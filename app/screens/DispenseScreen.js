import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import Constants from 'expo-constants';
import { Card, TextInput } from 'react-native-paper';

import ListItemSeparator from '../components/ListItemSeparator';
import colors from '../config/colors';
import AppButton from '../components/AppButton';

function DispenseScreen({navigation}) {

    const [liquidText, setLiquidText] = React.useState("");
    const [candyText, setCandyText] = React.useState("");

    return (
        <View style={styles.container}>
                <Card style={{
                    marginTop: 10,
                    height: "45%",
                    width: 350,
                    borderRadius: 30,
                    backgroundColor: "#edfffd",
                    ...styles.shadow
                }}>
                    <Card.Content>
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>Dispense Sugar</Text>
                        </View>
                        <ListItemSeparator style={{marginBottom: 10}} />
                        <View style={styles.cardItem}>
                        <Text style={styles.listHeader}>Liquid Amount:</Text>
                            <TextInput style={{width: "90%"}}
                            left={<TextInput.Icon name="water-outline"/>}
                            selectionColor={colors.primary} 
                            underlineColor={colors.primary} 
                            activeUnderlineColor={colors.primary} 
                            label="Liquid Dispense Amount" value={liquidText} 
                            onChangeText={liquidText => setLiquidText(liquidText)} />
                        </View>
                        <View style={styles.cardItem}>
                            <Text style={styles.listHeader}>Candy Amount:</Text>
                            <TextInput style={{width: "90%"}}
                            left={<TextInput.Icon name="circle-outline" />}
                            selectionColor={colors.secondary} 
                            underlineColor={colors.secondary} 
                            activeUnderlineColor={colors.secondary} 
                            label="Candy Dispense Amount" value={candyText} 
                            onChangeText={candyText => setCandyText(candyText)} />
                        </View>
                        <View style={[styles.cardItem, {marginTop: -5}]}><AppButton title="Dispense" /></View>                   
                    </Card.Content>
                    <Card.Actions>
                    </Card.Actions>
                </Card>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons size={30} name="arrow-back" />
                </TouchableOpacity>
            </View>
        </View>


    );
}

export default DispenseScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: Constants.statusBarHeight + 10,
        left: 20
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
    cardItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    title: {
        fontSize: 30,
        textTransform: 'uppercase',
    },
    listHeader: {
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: '500',
        textTransform: 'uppercase'
    }
})