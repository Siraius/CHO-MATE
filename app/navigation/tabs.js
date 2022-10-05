import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../config/colors';
import AccountScreen from '../screens/AccountScreen';
import DataScreen from '../screens/DataScreen';
import DispenseScreen from '../screens/DispenseScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

const screenTab = createNativeStackNavigator();

const HomeNavigator = () => (
  <screenTab.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <screenTab.Screen name="Home" component={HomeScreen} />
    <screenTab.Screen name="Dispense" component={DispenseScreen} />
  </screenTab.Navigator>
);

function MainNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 80,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Home Navigator"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <Ionicons size={30} name="home" color={focused ? colors.primary : 'black'} />
              <Text style={{ color: focused ? colors.primary : 'black', fontSize: 20 }}>HOME</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Data"
        component={DataScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <Entypo size={30} name="bar-graph" color={focused ? colors.primary : 'black'} />
              <Text style={{ color: focused ? colors.primary : 'black', fontSize: 20 }}>
                MY DATA
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <MaterialCommunityIcons
                size={30}
                name="account"
                color={focused ? colors.primary : 'black'}
              />
              <Text style={{ color: focused ? colors.primary : 'black', fontSize: 20 }}>
                ACCOUNT
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default MainNavigation;
