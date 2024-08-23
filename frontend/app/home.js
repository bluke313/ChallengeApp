import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { dropSecret, retrieveSecret } from './Storage.js';
import { Feed } from '../assets/assets.js';
import { useState, useEffect, useRef } from 'react';

const home = () => {
    const [username, setUsername] = useState('');
    const scrollViewRef = useRef(null);

    // Reset user view to top of screen
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    useEffect(() => {
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
        <View style={styles.container}>
            
            <ScrollView ref={scrollViewRef} style={styles.content}>
                <Text style={styles.title}>Home Page</Text>
                <Pressable
                    onPress={() => { dropSecret('authToken'); router.push('/Login') }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Sign Out</Text>
                </Pressable>
                <Feed></Feed>
                <Text style={ {fontSize: 50, width: 20, alignSelf: 'center'} }>abcdefghijklmnopqrstuvwxyz</Text>
            </ScrollView>

            <View style={styles.tabs}>
                <Pressable
                    onPress={scrollToTop}
                    style={styles.tabButton}
                >
                    <Text style={styles.buttonText} >{`\u{1F3E0}`}</Text>
                </Pressable>
                <Pressable
                    onPress={() => { router.push(`/p/${username}`) }}
                    style={styles.tabButton}
                >
                    <Text style={styles.buttonText} >{`\u{1F9D1}`}</Text>
                </Pressable>
            </View>

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
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    tabs: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'lightblue',
    },
    tabButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
        width: 100,
    }
});

export default home;