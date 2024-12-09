import React, { useEffect } from 'react';
import { View, Text, ToastAndroid, StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as actions from '../../redux/actions';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/types';

function LoginScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const dispatch = useDispatch();
    const [rememberMe, setRememberMe] = React.useState(false);
    const [initialValues, setInitialValues] = React.useState({ username: '', password: '' });

    useEffect(() => {
        const loadSavedCredentials = async () => {
            try {
                const savedCredentials = await AsyncStorage.getItem('credentials');
                
                if (savedCredentials) {
                    const { username, password } = JSON.parse(savedCredentials);
                    if (username && password) {
                        setRememberMe(true);
                        setInitialValues({ username, password });
                    }
                }
            } catch (err) {
                console.log("Error loading saved credentials", err);
            }
        };

        loadSavedCredentials();
    }, []);

    const handleLogin = async (values: { username: string; password: string }) => {
        try {
            const { username, password } = values;

            const data = await AsyncStorage.getItem('users');
            const json = JSON.parse(data as string);
            const userData = json.find((x: any) => x.username === username);

            if (!userData) {
                ToastAndroid.show("Invalid username", ToastAndroid.SHORT);
                return;
            }
            
            if (userData.password !== password) {
                ToastAndroid.show("You have entered wrong password", ToastAndroid.SHORT);
                return;
            }

            if (rememberMe) {
                await AsyncStorage.setItem('credentials', JSON.stringify({ username, password }));
            } else {
                await AsyncStorage.removeItem('credentials');
            }

            dispatch({
                type: actions.SET_USER,
                payload: {
                    user: userData,
                },
            });

            ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
        } catch (err) {
            console.log(err);
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Login</Text>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validate={(values) => {
                    const errors: { username?: string; password?: string } = {};
                    if (!values.username) {
                        errors.username = 'Username is required';
                    }
                    if (!values.password) {
                        errors.password = 'Password is required';
                    }
                    return errors;
                }}
                onSubmit={(values) => handleLogin(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setValues }) => {
                    return (
                        <View style={styles.inputArea}>
                            <TextInput
                                placeholder='Username'
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                                style={[styles.input, touched.username && !!errors.username && styles.errorInput]}
                            />
                            {touched.username && errors.username && (
                                <Text style={styles.errorText}>{errors.username}</Text>
                            )}
                            <TextInput
                                placeholder='Password'
                                secureTextEntry
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                style={[styles.input, touched.password && !!errors.password && styles.errorInput]}
                            />
                            {touched.password && errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}
                            <View style={styles.checkboxContainer}>
                                <Icon name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'} size={20} color="black" onPress={() => setRememberMe(!rememberMe)}/>
                                <Text style={styles.checkboxLabel}>Remember Me</Text>
                            </View>
                            <Pressable
                                style={styles.loginButton}
                                onPress={handleSubmit as any}
                            >
                                <Text style={styles.loginButtonText}>Login</Text>
                            </Pressable>
                            <TouchableOpacity
                                style={styles.signupContainer}
                                onPress={() => navigation.navigate("Register")}
                            >
                                <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    loginButton: {
        marginTop: 7,
        borderRadius: 5,
        height: 48,
        justifyContent: 'center',
        backgroundColor: '#009bff'
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    inputArea: {
        marginTop: 50,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxLabel: {
        fontSize: 16,
        color: 'black',
    },
    signupContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signupText: {
        fontSize: 16,
        color: 'black',
    },
});

export default LoginScreen;
