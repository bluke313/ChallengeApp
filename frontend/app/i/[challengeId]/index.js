import { View, Text, StyleSheet, Image, Pressable, Button } from 'react-native';
import { useEffect, useState } from 'react'
import { retrieveSecret } from '../../Storage.js'
import { router, Link, useGlobalSearchParams } from 'expo-router';


export default function Challenge({ challenge }) {
    const [photoData, setPhotoData] = useState(null)

    const searchParams = useGlobalSearchParams()
    //consider a useEffect that calls /challenge which would serve comments, likes, etc

    useEffect(() => {
        const retrieveFullChallenge = async () => {
            try {
                const token = await retrieveSecret('authToken')
                console.log(`Token: ${token}`)
                const response = await fetch(
                    `http://localhost:3000/challenge/${searchParams.challengeId}`,
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
                setPhotoData(responseJson)
                // setChallenges(responseJson.images)
            } catch (error) {
                console.error(error);
            }
        }
        retrieveFullChallenge()
    }, [])

    return (
        <View>
            {photoData == null ? null : <Image
                style={styles.challengeImageStyle}
                source={{
                    uri: `http://localhost:3000/${photoData.path}`,
                }}
            ></Image>}
            <Button onPress={() => router.back()}>Go Back</Button>
        </View>
    )

}

const styles = StyleSheet.create({
    challengeImageStyle: {
        width: 350,
        height: 400
    }
})