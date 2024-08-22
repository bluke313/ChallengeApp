import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { dropSecret } from './Storage.js';
import { useState, useEffect } from 'react';
import {retrieveSecret} from './Storage.js'


const home = () => {

    const [username, setUsername] = useState('');

    useEffect( () => {
        // setUsername('test');

        const fetchHome = async () => {
            try {
                const token = await retrieveSecret('authToken')
                console.log(`Token: ${token}`)
                const response = await fetch(
                    'http://localhost:3000/home',
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`
                        },
                    }
                );
                const responseJson = await response.json();
                console.log(responseJson)
                setUsername(responseJson.username)
            } catch (error) {
                console.error(error);
            }
        }
        fetchHome()

    }, []);

    return (
        <View>
            <Text style={styles.title}>Home Page</Text>
            <Pressable 
                onPress={() => {dropSecret('authToken'); router.push('/Login')}}
                style={styles.button}
            >
            <Text style={styles.buttonText}>Sign Out
            </Text>
            </Pressable>
            <Pressable
                onPress={() => {router.push(`/p/${username}`)}}
            >GO TO PROFILE</Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default home;