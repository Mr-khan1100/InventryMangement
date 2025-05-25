import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SummaryScreen from '../screens/homeScreens/dashboardScreens/SummaryScreen';
import CategoryScreen from '../screens/homeScreens/inventryScreens/CategoryScreen';
import HistoryScreen from '../screens/homeScreens/accountScreens/HistoryScreen';
import { COLORS } from '../styles/theme';
import summaryInactive from '../assets/summaryInactive.jpg';
import summaryActive from '../assets/summaryActive.jpg';
import inventryInactive from '../assets/inventryInactive.jpg';
import inventryActive from '../assets/inventryActive.jpg';
import accountInactive from '../assets/accountInactive.jpg';
import accountActive from '../assets/accountActive.jpg';
import CategoryFormScreen from '../screens/homeScreens/inventryScreens/CategoryFormScreen';
import ProductScreen from '../screens/homeScreens/inventryScreens/ProductScreen';
import ProductFormScreen from '../screens/homeScreens/inventryScreens/ProductFormScreen';
import ProductDetailScreen from '../screens/homeScreens/inventryScreens/ProductDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashBoardStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name={'Summary'}
        component={SummaryScreen}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}

const InventryStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name={'Inventry'}
        component={CategoryScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name={'CategoryActionScreen'}
        component={CategoryFormScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name={'ProductScreen'}
        component={ProductScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name={'ProductActionScreen'}
        component={ProductFormScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name={'productDetailScreen'}
        component={ProductDetailScreen}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}

const AccountStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name={'History'}
        component={HistoryScreen}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}



const HomeStack = () => {

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={styles.tabBarStyle}
        initialRouteName={'Summary'}>
        <Tab.Screen
          name={'Summary'}
          component={DashBoardStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: focused ? COLORS.darkBlack : COLORS.grey,
                  fontSize: 10,
                }}>
                {'Summary'}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? summaryActive
                    : summaryInactive
                }
                style={styles.logo}
                
              />
            ),
          }}
        />
         <Tab.Screen
          name={'Inventry'}
          component={InventryStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                    color: focused ? COLORS.darkBlack : COLORS.grey,
                    fontSize: 10,
                }}>
                {'Inventry'}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? inventryActive
                    : inventryInactive
                }
                style={styles.logo}
              />
            ),
          }}
        />
        <Tab.Screen
          name={'History'}
          component={AccountStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                    color: focused ? COLORS.darkBlack : COLORS.grey,
                    fontSize: 10,
                }}>
                {'History'}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? accountActive
                    : accountInactive
                }
                style={styles.logo}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default HomeStack;


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBarStyle: {
        height: 60,
        paddingBottom: 5,
        display:  'flex',
    },
    logo:{
        width: 24, 
        height: 24,
        resizeMode : "contain",
    }
  });