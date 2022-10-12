import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLottieView from 'lottie-react-native';
import AppButton from '../components/AppButton';
import { auth } from '../config/firebase';

const reauthenticate = (currentPassword) => {
  const user = auth.currentUser;
  const cred = auth.EmailAuthProvider.credential(user.email, currentPassword);

  return user.reauthenticateWithCredential(cred);
};

const changePassword = (currentPassword, newPassword) => {
  reauthenticate(currentPassword);
  const user = auth.currentUser;
  user.updatePassword(newPassword);
};

function AccountScreen({ navigate }) {
  return (
    <ImageBackground
      blurRadius={10}
      style={styles.background}
      source={require('../assets/background.jpg')}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Account Screen</Text>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.title}>Name:</Text>
            <Text style={styles.authText}>{auth.currentUser?.displayName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Email:</Text>
            <Text style={styles.authText}>{auth.currentUser?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>UID:</Text>
            <Text style={styles.authText}>{auth.currentUser?.uid}</Text>
          </View>
        </View>
        <View style={{ width: '45%' }}>
          <AppButton title="Sign Out" onPress={() => signOut(auth)} />
        </View>
        <AnimatedLottieView
          autoPlay
          loop
          style={{ height: 200, width: 200, marginTop: 10 }}
          speed={1.1}
          source={require('../assets/empty-data.json')}
        />
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
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
});

export default AccountScreen;
