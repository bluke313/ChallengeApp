import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react'
import { retrieveSecret } from '../../Storage.js'
import { router, useGlobalSearchParams } from 'expo-router';

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
                <Pressable style={styles.returnButton} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Return</Text>
                </Pressable>
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
                {/* <Pressable style={styles.button} onPress={ () => { console.log(photoData)}}><Text style={styles.buttonText}>test</Text></Pressable> */}
            </View>

            {/* <View style={styles.tabs}>            ATTEMPT TO ADD TABS TO IMAGE VIEWING SCREEN. KNOWN BUGS
                <Pressable
                    onPress={() => { router.push(`/home`) }}
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
            </View> */}

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    imageContainer: {
        borderWidth: 5,
        borderColor: '#007BFF',
        backgroundColor: 'lightblue',
        marginTop: 100,
        alignItems: 'center',
    },
    image: {
        width: 350,
        height: 400,
        borderWidth: 2,
        borderColor: '#007BFF',
        backgroundColor: 'white',
    },
    caption: {
        fontFamily: 'sans-serif',
        marginTop: 3,
    },
    timestamp: {
        fontFamily: 'sans-serif',
        marginBottom: 3,
    },
    returnButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
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
})