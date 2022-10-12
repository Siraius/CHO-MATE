import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import Platform from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        AsyncStorage.setItem("PushToken", token);
        console.log(token);
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
};

export async function lowLiquidNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Your CHO-MATE is running low on liquid! 💧",
            body: 'You need to refill your liquid soon.',
            data: { object: 'liquid', status: 'low' },
        },
        trigger: { seconds: 8 },
    });
};

export async function lowCandyNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Your CHO-MATE is running low on candy! 🍬",
            body: "You need to refill the candy soon.",
            data: { object: "candy", status: "low" },
        },
        trigger: { seconds: 8 },
    })
};

export async function lowResourcesNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Your CHO-MATE is running low on candy and liquid!",
            body: "Please refill your CHO-MATE to continue dispensing.",
            data: { object: "both", status: "low" },
        },
        trigger: { seconds: 8 },
    })
};