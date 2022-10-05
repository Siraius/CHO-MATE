import { Provider, DefaultTheme } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import colors from './app/config/colors';
import RootNavigator from './app/navigation/RootNavigator';

import { registerForPushNotificationsAsync } from './app/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import Popup from './app/components/Popup';


const BACKGROUND_FETCH_TASK = 'background-fetch';
var numCalls = 0;

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("NumCalls", value)
  } catch (e) {
    console.error(e);
  }
}

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("NumCalls");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.error(e);
  }
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
  numCalls++;
  storeData(numCalls.toString());

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

const theme = {
  ...DefaultTheme,
  roundness: 25,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
  },
};

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  const [title, setTitle] = useState("ERROR");
  const [body, setBody] = useState("Erroneous Error Occured. Try again!");
  const [visible, setVisible] = useState(false);

  const clearDialog = () => setVisible(false);

  const notificationHandler = (object, status) => {
    if (object === 'liquid' && status === 'low') {
      setTitle("LOW LIQUID");
      setBody("The liquid of your CHO-MATE machine is low. Consider refilling the liquid.");
      setVisible(true);
    }
  }

  useEffect(() => {
    checkStatusAsync();
    registerForPushNotificationsAsync();
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("Incoming notification!");

    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      notificationHandler(response.notification.request.content.data.object, response.notification.request.content.data.status);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const checkStatusAsync = async () => {
    registerBackgroundFetchAsync();
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    console.log("Status: ", BackgroundFetch.BackgroundFetchStatus[status]);
    console.log("isRegistered: ", isRegistered);
  };
  return (
    <Provider theme={theme}>
      <Popup title={title} dialogue={body} visible={visible} onPress={clearDialog} />
      <RootNavigator />
    </Provider>
  );
}
