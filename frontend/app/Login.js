import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import ErrorMessage from '../ErrorMessage.js';
import {storeSecret} from './Storage.js'

const Login = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [allowLogin, setAllowLogin] = useState(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async () => {
        setErrorMsg('');
        try {
            const response = await fetch(
                'http://localhost:3000/login',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );
            const responseJson = await response.json();
            console.log(responseJson)
            if (responseJson.success) {
                await storeSecret('authToken', responseJson.token)
                router.push(`/home`);
            }
            // BELOW IS AN ATTEMPT TO MAKE LOGIN ATTEMPTS WITH NEW EMAILS SEND YOU TO SIGNUP WITH THE EMAIL ALREADY ENTERED
            // else if (responseJson.errCode === 1) {
            //     router.push({
            //         pathname: "/SignUp",
            //         params: { email: email},
            //     });
            // }
            else {
                setErrorMsg(responseJson.message)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const validifyLogin = () => {

        if (emailPattern.test(email) && password) {
            setAllowLogin(true);
        }
        else {
            setAllowLogin(false);
        }        
    };

    // const checkEmail = () => {
    //     if (!emailPattern.test(email)) {
    //         setEmailErr(true);
    //     }
    //     else {
    //         setEmailErr(false);
    //     }
    // };

    // const checkPassword = () => {
    //     if (!password) {
    //         setPasswordErr(true);
    //     }
    //     else {
    //         setPasswordErr(false);
    //     }
    // };

    const handleKeyPress = (event) => {
        if (event.nativeEvent.key === 'Enter') {
            handleLogin();
        }
    };

    useEffect(() => {
        validifyLogin();
    }, [email, password]);

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.password}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    onKeyPress={handleKeyPress}
                    secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ width: 0, right: 37 }}>
                    <Text selectable={false} style={styles.showPassword}>
                        {showPassword ? '\u{1F512}' : '\u{1F513}'}
                    </Text>
                </Pressable>
            </View>
            <Pressable disabled={!allowLogin} onPress={handleLogin} style={allowLogin ? styles.button : styles.disabledButton}>
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Link style={styles.link} href='/SignUp'>
                <Text style={styles.linkText}>Sign Up</Text>
            </Link>
            <ErrorMessage msg={errorMsg}></ErrorMessage>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        position: 'absolute',
        top: 20,
        padding: 10,
        alignSelf: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: 220,
        alignSelf: 'center',
    },
    inputErr: {
        height: 40,
        borderColor: 'red',
        borderWidth: 2,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: 220,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        minWidth: 100,
    },
    disabledButton: {
        backgroundColor: '#add5ff',
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        minWidth: 100,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    link: {
        alignSelf: 'center',
        margin: 5,
    },
    linkText: {
        color: 'blue',
    },
    password: {
        flexDirection: 'row',
    },
    showPassword: {
        fontSize: 30,
    },
});

export default Login;