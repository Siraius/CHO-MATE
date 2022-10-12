import { Provider, DefaultTheme } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import colors from './app/config/colors';
import RootNavigator from './app/navigation/RootNavigator';

import { registerForPushNotificationsAsync, lowLiquidNotification, lowCandyNotification, lowResourcesNotification } from './app/utils';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import Popup from './app/components/Popup';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BACKGROUND_FETCH_TASK = 'background-fetch';



TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  var date = new Date(now).toLocaleString();
  console.log("Background Fetch Start: ", date);
  AsyncStorage.setItem("FetchDate", date);

  AsyncStorage.getItem("Liquid").then((value) => {
    if (value === "Low") {
      console.log("Low Liquid - Pushing Notification");
      lowLiquidNotification();
      AsyncStorage.setItem("Liquid", "Fine");
    }
  });

  AsyncStorage.getItem("Candy").then((value) => {
    if (value === "Low") {
      console.log("Low Candy - Pushing Notification");
      lowCandyNotification();
      AsyncStorage.setItem("Candy", "Fine");
    }
  });

  AsyncStorage.getItem("Both").then((value) => {
    if (value === "Low") {
      console.log("Low Resources - Pushing Notification");
      lowResourcesNotification();
      AsyncStorage.setItem("Both", "Fine");
    }
  });
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});



async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
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
  const [title, setTitle] = useState("ERROR");
  const [body, setBody] = useState("Erroneous Error Occured. Try again!");
  const [visible, setVisible] = useState(false);

  const notificationHandler = (object, status) => {
    if (object === 'liquid' && status === 'low') {
      setTitle("LOW LIQUID");
      setBody("The liquid of your CHO-MATE machine is low. Consider refilling the liquid.");
      setVisible(true);
    }

    if (object === 'candy' && status === 'low') {
      setTitle("LOW CANDY");
      setBody("The candy of your CHO-MATE machine is low. Consider refilling the candy.");
      setVisible(true);
    }

    if (object === 'both' && status === 'low') {
      setTitle("LOW CANDY & LIQUID");
      setBody("The candy and liquid of your CHO-MATE machine is low. Please refill before dispensing.");
      setVisible(true);
    }
  };

  const notificationListener = useRef();
  const responseListener = useRef();

  const clearDialog = () => setVisible(false);

  useEffect(() => {
    checkStatusAsync();
    registerForPushNotificationsAsync();
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      notificationHandler(notification.request.content.data.object, notification.request.content.data.status)

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
    AsyncStorage.setItem("FetchStatus", BackgroundFetch.BackgroundFetchStatus[status]);
    AsyncStorage.setItem("FetchRegistered", isRegistered.toString());
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
