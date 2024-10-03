import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { router, useRootNavigationState, Link } from 'expo-router';
import ErrorMessage from '../ErrorMessage.js';
import { hasSecret, storeSecret } from './Storage.js'
import { Button } from '@components/Button.js';
import { PrimaryButton } from './Components/Button.js';
import { SecureTextinput, StyledTextInput } from '@components/Input.js';

const Login = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [allowLogin, setAllowLogin] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const navigationState = useRootNavigationState();

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

    const handleKeyPress = (e) => {
        if (e.nativeEvent.key === 'Enter') {
            e.preventDefault();
            if (allowLogin) {
                handleLogin();
            }
        }
    };

    //token check useEffect
    useEffect(() => {
        const checkTokenExists = async () => {
            const resp = await hasSecret('authToken')
            if(resp){
                router.push('/home')
            }
        }

        if(navigationState?.key){
            checkTokenExists()
        }

    }, [navigationState?.key]);

    //password verification useEffect
    useEffect(() => {
        validifyLogin();
    }, [email, password]);

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <StyledTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onKeyPress={handleKeyPress}
            />
            <SecureTextinput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                onKeyPress={handleKeyPress}
            />
            <Button text='Login' onPress={handleLogin} disabled={!allowLogin} />
            <Link style={isHovered ? styles.link : styles.link} href='/SignUp'>
                <Text
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={isHovered ? {color: '#8bdbb3', textDecorationLine: 'underline'} : styles.linkText}>Sign Up</Text>
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
        color: '#fff'
    },
    input: {
        height: 40,
        borderColor: '#38c880',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: 220,
        alignSelf: 'center',
        color: '#fff',
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
    link: {
        alignSelf: 'center',
        margin: 5,
    },
    linkText: {
        color: '#8bdbb3',
    },
    password: {
        flexDirection: 'row',
    },
});

export default Login;