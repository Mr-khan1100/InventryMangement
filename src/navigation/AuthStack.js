import React from 'react';
import SignInScreen from '../screens/authScreens/loginScreens/SignInScreen';
import SignUpScreen from '../screens/authScreens/registrationScreens/SignUpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { screenLabel } from '@constants/appConstant';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName={'SignInScreen'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={'SignInScreen'} component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'SignUpScreen'} component={SignUpScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AuthStack;
