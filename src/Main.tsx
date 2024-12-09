import React from 'react';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/NonAuth/login';
import HomeScreen from './screens/Auth/Home.tsx';
import RegisterScreen from './screens/NonAuth/register.tsx';

const Stack = createNativeStackNavigator();

function MainApp() {
    //@ts-ignore
    const session = useSelector((state) => state.user);

    return (
        <NavigationContainer>
            {
                (session?.username) ? (
                    <Stack.Navigator screenOptions={{
                        headerShown: false,
                        animation: 'none'
                    }}>
                        <Stack.Screen name="Home" component={HomeScreen} />
                    </Stack.Navigator>
                ) : (
                    <Stack.Navigator initialRouteName="Login" screenOptions={{
                        headerShown: false,
                        animation: 'none'
                    }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </Stack.Navigator>
                )
            }
        </NavigationContainer>

    );
}

export default MainApp;