import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const LoginScreen = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'user' && password === 'pass') {
            Alert.alert('Login Successful');
        } else {
            Alert.alert('Login Failed', 'Invalid username or password');
        }
    };
    
    return (

        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput 
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput 
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin}/>
        </View>
    );
};

export default Login;