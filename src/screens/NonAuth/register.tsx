import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/types';

function RegisterScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[!@#$%^&*]/.test(password)) strength += 1;

        setPasswordStrength((strength / 4) * 100);
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleRegister = async (values: { username: string; password: string }) => {
        try {
            const { username, password } = values;

            const data = await AsyncStorage.getItem('users');
            const users = JSON.parse(data || '[]');

            const existingUser = users.find((x: any) => x.username === username);

            if (existingUser) {
                ToastAndroid.show("Username is already taken", ToastAndroid.SHORT);
                return;
            }

            const updatedUsers = [...users, { username, password }];
            await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

            ToastAndroid.show("Registration Successful", ToastAndroid.SHORT);
            navigation.navigate("Login");
        } catch (err) {
            console.log(err);
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        }
    };

    const passwordValidation = (password: string) => {
        return {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*]/.test(password),
        };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Register</Text>
            <Formik
                enableReinitialize
                initialValues={{ username: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => handleRegister(values)}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
                    <View style={styles.inputArea}>
                        <TextInput
                            placeholder="Username"
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            style={[styles.input, touched.username && !!errors.username && styles.errorInput]}
                        />
                        {touched.username && errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}

                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            onChangeText={(text) => {
                                handleChange('password')(text);
                                calculatePasswordStrength(text);
                            }}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={[styles.input, touched.password && !!errors.password && styles.errorInput]}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}

                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            style={[styles.input, touched.confirmPassword && !!errors.confirmPassword && styles.errorInput]}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}

                        <View style={styles.passwordConditions}>
                            <Condition
                                condition={passwordValidation(values.password).minLength}
                                label="At least 8 characters"
                            />
                            <Condition
                                condition={passwordValidation(values.password).hasUppercase}
                                label="At least one uppercase letter"
                            />
                            <Condition
                                condition={passwordValidation(values.password).hasLowercase}
                                label="At least one lowercase letter"
                            />
                            <Condition
                                condition={passwordValidation(values.password).hasNumber}
                                label="At least one number"
                            />
                            <Condition
                                condition={passwordValidation(values.password).hasSpecialChar}
                                label="At least one special character"
                            />
                        </View>

                        {/* Password Strength Bar */}
                        {values.password.length > 0 && (
                            <>
                                <View style={styles.strengthBarContainer}>
                                    <View
                                        style={[
                                            styles.strengthBar,
                                            { flex: passwordStrength / 100 },
                                            passwordStrength >= 75 && styles.strong,
                                            passwordStrength >= 50 && passwordStrength < 75 && styles.medium,
                                            passwordStrength < 50 && styles.weak,
                                        ]}
                                    />
                                </View>
                                <Text style={styles.strengthText}>
                                    Strength: {Math.round(passwordStrength)}%
                                </Text>
                            </>
                        )}

                        <Pressable
                            style={styles.registerButton}
                            onPress={handleSubmit as any}
                        >
                            <Text style={styles.registerButtonText}>Register</Text>
                        </Pressable>
                        <TouchableOpacity
                            style={styles.loginContainer}
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.loginText}>Already have an account? Login</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
}

const Condition = ({ condition, label }: { condition: boolean; label: string }) => (
    <View style={styles.condition}>
        <Icon name={condition ? 'check-circle' : 'close-circle'} size={20} color={condition ? 'green' : 'red'} />
        <Text style={styles.conditionText}>{label}</Text>
    </View>
);

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
    passwordConditions: {
        marginTop: 15,
        marginBottom: 10,
    },
    condition: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    conditionText: {
        marginLeft: 10,
        fontSize: 16,
        color: 'black',
    },
    strengthBarContainer: {
        height: 10,
        backgroundColor: 'lightgray',
        borderRadius: 5,
        marginBottom: 10,
    },
    strengthBar: {
        height: '100%',
        borderRadius: 5,
    },
    weak: {
        backgroundColor: 'red',
    },
    medium: {
        backgroundColor: 'orange',
    },
    strong: {
        backgroundColor: 'green',
    },
    strengthText: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    registerButton: {
        marginTop: 7,
        borderRadius: 5,
        height: 48,
        justifyContent: 'center',
        backgroundColor: '#009bff',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    loginContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        color: 'black',
    },
});

export default RegisterScreen;
