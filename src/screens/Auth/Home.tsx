import React from 'react';
import { Text, SafeAreaView, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as actions from '../../redux/actions';
import { RootStackParamList } from '../../navigation/types';

function HomeScreen() {
    const session = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            dispatch({ type: actions.SET_USER, payload: { user: null } });

            ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
        } catch (error) {
            console.log('Error logging out: ', error);
            ToastAndroid.show("Logout failed", ToastAndroid.SHORT);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Welcome, {session?.username || 'Guest'}</Text>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 20,
        borderRadius: 5,
        height: 48,
        justifyContent: 'center',
        backgroundColor: '#009bff',
        paddingHorizontal: 15,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HomeScreen;
