import { View, Text, StyleSheet, Image, Pressable, Button } from 'react-native';
import { useEffect, useState } from 'react'
import {retrieveSecret} from '../Storage.js'
import { router, Link, useGlobalSearchParams } from 'expo-router';
import { whoAmI } from '../Components/Network.js';


export const ChallengesView = ({user, fresh}) => {
    const [challenges, setChallenges] = useState([])
    const [username, setUsername] = useState(null)
    const localParams = useGlobalSearchParams()
    // console.log(`params: ${localParams.id}`)


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await retrieveSecret('authToken')
                console.log(`Token: ${token}`)
                const response = await fetch(
                    'http://localhost:3000/profile',
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            "pageUserName": user
                        }),
                    }
                );
                const responseJson = await response.json();
                console.log(responseJson)
                setChallenges(responseJson.images)
            } catch (error) {
                console.error(error);
            }
        }
        whoAmI(setUsername)
        fetchProfile()
    }, [fresh])
    return (
        <View style={styles.challengeViewStyle}>
            {challenges.map((item, i) => 
                <Pressable 
                style={{ borderColor: '#38c880', borderWidth: 1}}
                onPress={() => router.push(`i/${item.id}`)}
                key={`${user}-image-${i}`}
                >
                    <Image 
                        style={styles.smallChallengeImageStyle}
                        source={{
                            uri: `http://localhost:3000/${item.path}`,
                        }}
                    ></Image> 
                </Pressable>
            )}              
        </View>
    )
}

const styles = StyleSheet.create({
    challengeViewStyle: {
        marginTop: 8,
        marginLeft: "auto",
        marginRight: "auto",
        // backgroundColor: "red",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "start",
        rowGap: 10,
        gap: 10,
    },
    smallChallengeViewStyle: {
        backgroundColor: "black",
        width: 100,
        height: 100
    },
    smallChallengeImageStyle: {
        width: 100,
        height: 100
    }
});