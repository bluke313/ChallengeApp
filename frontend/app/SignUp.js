import React, { useState, useEffect, component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';
import ErrorMessage from '../ErrorMessage';
import * as SecureStore from 'expo-secure-store';
import {storeSecret} from './Storage.js'


const SignUp = (props) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [allowSignUp, setAllowSignUp] = useState(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async () => {
        console.log("hi")
        try {
            const response = await fetch(
                'http://localhost:3000/signup',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                    }),
                }
            );
            const responseJson = await response.json();
            console.log(responseJson)
            if (responseJson.success) {
                // props.handleLogin(responseJson.username);
                await storeSecret('authToken', responseJson.token)
            }
            else {
                setErrorMsg(responseJson.message)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const validifyLogin = () => {

        if (emailPattern.test(email) && password && username) {
            setAllowSignUp(true);
        }
        else {
            setAllowSignUp(false);
        }        
    };

    const handleKeyPress = (event) => {
        if (event.nativeEvent.key === 'Enter') {
            handleLogin();
        }
    };

    useEffect(() => {
        validifyLogin();
    }, [email, username, password]);

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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
            <Pressable disabled={!allowSignUp} onPress={handleLogin} style={ allowSignUp ? styles.button : styles.disabledButton}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
            <Link style={styles.link} href='/Login'>
                <Text style={styles.linkText}>I already have an account</Text>
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
    }
});

export default SignUp