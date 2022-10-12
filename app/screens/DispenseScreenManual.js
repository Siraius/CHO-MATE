/* eslint-disable no-undef */
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import LottieView from 'lottie-react-native';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FadeInOut from 'react-native-fade-in-out';
import { Card, Snackbar, TextInput, ActivityIndicator } from 'react-native-paper';
import init from 'react_native_mqtt';

import AppButton from '../components/AppButton';
import { FormErrorMessage } from '../components/FormErrorMessage';
import ListItemSeparator from '../components/ListItemSeparator';
import colors from '../config/colors';
import { auth, db } from '../config/firebase';
import { DispenseSchema } from '../utils';

function DispenseScreenManual({ navigation }) {
  let client;
  let connected = false;
  let liquidVal,
    candyVal = 0;
  const [snackbar, setSnackbar] = React.useState(false);
  const [lottie, setLottie] = React.useState(false);
  const [animate, setAnimate] = React.useState(false);
  const onDismissSnackBar = () => setSnackbar(false);

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {},
  });

  function onConnect(candyAmount, liquidAmount) {
    console.log('[MQTT] Connection Successful.');
    client.subscribe('app/response');

    console.log('Sending message to machine for dispense');
    const liquid = new Paho.MQTT.Message(liquidAmount);
    const candy = new Paho.MQTT.Message(candyAmount);
    const dispense = new Paho.MQTT.Message('DISPENSE');

    liquid.destinationName = 'chomate/liquid';
    candy.destinationName = 'chomate/candy';
    dispense.destinationName = 'chomate/request';

    client.send(liquid);
    client.send(candy);
    client.send(dispense);

    candyVal = candyAmount;
    liquidVal = liquidAmount;

    setAnimate(true);

    connected = true;
  }

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        if (connected) {
          client.disconnect();
          setAnimate(false);
          setSnackbar(false);
          console.log('DISCONNECTING');
          connected = false;
        }
      };
    }, [])
  );

  const ScreenWithLottie = () => {
    const animation = React.createRef();

    React.useEffect(() => {
      animation.current.play(0, 170);
    }, []);

    return (
      <View style={styles.messageBar}>
        <LottieView
          ref={animation}
          loop={false}
          style={{ width: 100, height: 100 }}
          source={require('../assets/animate-checkmark.json')}
        />
      </View>
    );
  };

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('[MQTT] Connection Lost. Reason: ' + responseObject.errorMessage);
    }
    if (responseObject.errorCode === 0) {
      console.log('[MQTT] Disconnected with no errors.');
    }
    connected = false;
  }

  async function onMessageArrived(message) {
    console.log('[MQTT] Message Received.');
    console.log('[MQTT] <Message: ' + message.payloadString + '>');
    console.log('[MQTT] <Destination: ' + message.destinationName + '>');

    if (message.payloadString === 'SUCCESS') {
      try {
        const docRef = await addDoc(collection(db, 'dispenses'), {
          liquid: String(liquidVal),
          candy: String(candyVal),
          uid: auth.currentUser?.uid,
          date: new Date(),
        });
        console.log('Created document with ID: ', docRef.id);
      } catch (e) {
        console.error("Couldn't create document: ", e);
      }
      setAnimate(false);
      setLottie(true);
      client.disconnect();
    }
    if (message.payloadString === 'FAILED') {
      setAnimate(false);
      setLottie(false);
      setSnackbar(true);
    }
  }

  function buttonPress(candyAmount, liquidAmount) {
    setLottie(false);
    client = new Paho.MQTT.Client('driver.cloudmqtt.com', 38763, Device.deviceName);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
      userName: 'tvsqdgpg',
      password: '7hNc0P-Bx048',
      onSuccess: () => onConnect(candyAmount, liquidAmount),
      useSSL: true,
    });
  }

  return (
    <View style={styles.container}>
      <Snackbar
        duration={2000}
        style={styles.messageBar}
        visible={snackbar}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'OK',
          onPress: () => {
            onDismissSnackBar();
          },
        }}>
        Error dispensing! Check machine for more details.
      </Snackbar>
      <View style={styles.indicator}>
        <FadeInOut visible={animate} duration={500}>
          <ActivityIndicator size={40} animating={animate} style={{ marginBottom: 10 }} />
          {animate && <Text style={styles.listHeader}>Sending to Machine...</Text>}
        </FadeInOut>
      </View>
      <Text style={styles.manualTitle}>Manual Mode</Text>
      <Formik
        initialValues={{
          liquidText: '',
          candyText: '',
        }}
        validationSchema={DispenseSchema}
        onSubmit={(values, { resetForm }) => {
          buttonPress(values.candyText, values.liquidText);
          resetForm();
        }}>
        {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
          <Card
            style={{
              marginTop: 10,
              height: '50%',
              width: 350,
              borderRadius: 30,
              backgroundColor: '#edfffd',
              ...styles.shadow,
            }}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>Dispense Sugar</Text>
              </View>
              <ListItemSeparator style={{ marginBottom: 10 }} />
              <View style={styles.cardItem}>
                <Text style={styles.listHeader}>Liquid Amount (Milliliters):</Text>
                <TextInput
                  style={{ width: '90%' }}
                  left={<TextInput.Icon name="water-outline" />}
                  theme={{ roundness: 5 }}
                  selectionColor={colors.primary}
                  underlineColor={colors.primary}
                  activeUnderlineColor={colors.primary}
                  label="Liquid Dispense Amount"
                  value={values.liquidText}
                  onChangeText={handleChange('liquidText')}
                />
                <View style={styles.liquidError}>
                  <FormErrorMessage error={errors.liquidText} visible={errors.liquidText} />
                </View>
              </View>
              <View style={styles.cardItem}>
                <Text style={styles.listHeader}>Candy Amount (Grams):</Text>
                <TextInput
                  style={{ width: '90%' }}
                  left={<TextInput.Icon name="circle-outline" />}
                  theme={{ roundness: 5 }}
                  selectionColor={colors.secondary}
                  underlineColor={colors.secondary}
                  activeUnderlineColor={colors.secondary}
                  label="Candy Dispense Amount"
                  value={values.candyText}
                  onChangeText={handleChange('candyText')}
                />
                <View style={styles.candyError}>
                  <FormErrorMessage error={errors.candyText} visible={errors.candyText} />
                </View>
              </View>
              <View style={[styles.cardItem, { marginTop: 35 }]}>
                <AppButton onPress={handleSubmit} title="Dispense" />
              </View>
            </Card.Content>
            <Card.Actions />
          </Card>
        )}
      </Formik>
      {lottie ? <ScreenWithLottie /> : null}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons size={30} name="arrow-back" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DispenseScreenManual;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Constants.statusBarHeight + 10,
    left: 20,
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
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
  manualTitle: {
    fontSize: 25,
    marginTop: -30,
    textTransform: 'uppercase',
    color: colors.secondary
  },
  listHeader: {
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  messageBar: {
    bottom: 105,
    position: 'absolute',
  },
  indicator: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liquidError: {
    position: 'absolute',
    top: 90,
  },
  candyError: {
    position: 'absolute',
    top: 90,
  },
});
