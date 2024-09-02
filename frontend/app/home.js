import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { dropSecret, retrieveSecret } from './Storage.js';
import { Feed } from '@assets/assets.js';
import { useState, useEffect, useRef } from 'react';
import { Button, Tabs } from '@assets/button.js';

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
            } catch (err) {
                console.error(err);
            }
        }
        fetchHome()

    }, []);

    return (
        <View style={styles.container}>

            <ScrollView ref={scrollViewRef} style={styles.content}>
                <Text style={styles.title}>Home Page</Text>
                <Button onPress={() => { dropSecret('authToken'); router.push('/Login') }} text='Sign Out' />
                <Feed user={username} />
            </ScrollView>

            <Tabs handleHome={scrollToTop} handleProfile={() => router.push(`/p/${username}`)}/>

        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    content: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
        backgroundColor: '#030806',
    },
});

export default home;