import { View, StyleSheet, Image } from 'react-native';
import { useEffect, useState } from 'react'
import {retrieveSecret} from '../Storage.js'


export const ChallengesView = ({user, fresh}) => {
    const [challenges, setChallenges] = useState([])

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
        fetchProfile()
    }, [fresh])
    // const challenges = [1,2,3,4,5,6,7]
    return (
        <View style={styles.challengeViewStyle}>
            {/* {challenges.map((item, i) => <View key={i} style={styles.smallChallengeViewStyle}></View>)}                 */}
            {challenges.map((item, i) => <Image 
            key={`${user}-image-${i}`}
            style={styles.smallChallengeImageStyle}
            source={{
                uri: `http://localhost:3000/${item.path}`,
            }}></Image>)}                
        </View>
    )
}

const styles = StyleSheet.create({
    challengeViewStyle: {
        marginTop: 8,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "red",
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