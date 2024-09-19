import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react'
import { retrieveSecret } from '../../Storage.js'
import { router, useGlobalSearchParams } from 'expo-router';
import { Button, Tabs } from '@components/Button.js';

export default function Challenge({ challenge }) {
    const [photoData, setPhotoData] = useState(null)

    const searchParams = useGlobalSearchParams()
    //consider a useEffect that calls /challenge which would serve comments, likes, etc

    useEffect(() => {

        const retrieveFullChallenge = async () => {
            try {
                const token = await retrieveSecret('authToken')
                // console.log(`Token: ${token}`)
                const response = await fetch(
                    `http://localhost:3000/i/${searchParams.challengeId}`,
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
                // console.log(responseJson)
                setPhotoData(responseJson)
                // setChallenges(responseJson.images)
                // console.log(`Found File Data: ${photoData}`);
            } catch (error) {
                console.error(error);
            }
        }
        retrieveFullChallenge()
    }, [])

    return (
        <View style={styles.container}>

            <View style={styles.content}>
                <Button onPress={() => router.back()} text='Return' />
                {photoData == null ? <Text style={styles.errorText}>IMAGE NOT FOUND</Text> :
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: `http://localhost:3000/${photoData.path}`,
                            }}
                        />
                        <Text style={styles.caption}>{photoData.caption == null ? null : photoData.caption}</Text>
                        <Text style={styles.timestamp}>Uploaded {photoData.timestamp}</Text>
                    </View>}
            </View>
            
            <Tabs handleHome={() => router.push('/home')} handleProfile={() => router.push('/')}/>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#030806',
        height: '100vh',
    },
    imageContainer: {
        borderWidth: 5,
        borderColor: '#1f8a55',
        backgroundColor: '#1f8a55',
        marginTop: 45,
        alignItems: 'center',
    },
    image: {
        width: 350,
        height: 400,
        borderWidth: 2,
        borderColor: '#1f8a55',
        backgroundColor: '#030806',
    },
    caption: {
        fontFamily: 'sans-serif',
        marginTop: 3,
        color: '#fff',
    },
    timestamp: {
        fontFamily: 'sans-serif',
        marginBottom: 3,
        color: '#8bdbb3',
    },
    errorText: {
        color: 'red',
        fontSize: 50,
        marginTop: 50,
    },
    content: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
    },
})