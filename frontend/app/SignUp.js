import React, { useState, useEffect, component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import ErrorMessage from '../ErrorMessage';
import { storeSecret } from './Storage.js';
import { Button } from '@components/Button.js';
import { PrimaryButton } from './Components/Button';
import { SecureTextinput, StyledTextInput } from './Components/Input.js';



const SignUp = (props) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [allowSignUp, setAllowSignUp] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async () => {
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
                await storeSecret('authToken', responseJson.token);
                router.push(`/home`);
            }
            else {
                setErrorMsg(responseJson.message);
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

    const handleKeyPress = (e) => {
        if (e.nativeEvent.key === 'Enter') {
            e.preventDefault();
            if (allowSignUp) {
                handleLogin();
            }
        }
    };

    useEffect(() => {
        validifyLogin();
    }, [email, username, password]);

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <StyledTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onKeyPress={handleKeyPress}
            />
            <StyledTextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                onKeyPress={handleKeyPress}

            />
            <SecureTextinput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                onKeyPress={handleKeyPress}
            />
            <Button onPress={handleLogin} text='Sign Up' disabled={!allowSignUp} />
            <Link style={styles.link} href='/Login'>
                <Text
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={isHovered ? {color: '#8bdbb3', textDecorationLine: 'underline'} : styles.linkText}>I already have an account</Text>
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
        backgroundColor: '#030806',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        position: 'absolute',
        top: 20,
        padding: 10,
        alignSelf: 'center',
        color: '#fff',
    },
    link: {
        alignSelf: 'center',
        margin: 5,
    },
    linkText: {
        color: '#8bdbb3',
    },
});

export default SignUp