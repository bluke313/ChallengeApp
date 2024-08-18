import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import IndicatorButton from '../Components/Button';
import UserIcon from '../Components/Icons';
import TabSelect, { TabArea } from '../Components/Tabs';
import { useEffect, useState } from 'react'
import { shouldUseActivityState } from 'react-native-screens';
import PhotoUpload from '../Components/PhotoUpload';
import {retrieveSecret} from '../Storage.js'


const Profile = () => {
    const [active, setActive] = useState(0)
    const [user, setUser] = useState(null)
    const [challenges, setChallenges] = useState([])
    const [fresh, setFresh] = useState(true)


    const ChallengesView = ({challenges}) => {
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
                setUser(responseJson.username)
                setChallenges(responseJson.images)
            } catch (error) {
                console.error(error);
            }
        }
        fetchProfile()
    }, [fresh])

    return (
        <View style={styles.mainView}>
            <View style={styles.topView}>
                <Text style={styles.title}>Profile page</Text>
                <UserIcon style={styles.userIconPosition} />
            </View>
            <View style={styles.infoView}>
                <Text style={styles.header1}>mailman</Text>
                <Text style={styles.bio}>Liam | UX/UI Designer 🎨 | Turning ideas into seamless experiences ✨ | Coffee addict ☕ | Always sketching the next big thing 🚀</Text>
                <IndicatorButton>13 Group Mates</IndicatorButton>
                <View style={styles.bufferStyle}></View>
                <TabSelect active={active} setActive={(i) => setActive(i)} tabItems={["Challenges", "Personal Info"]} />
                <TabArea active={active}>
                    <ChallengesView challenges={challenges}/>
                    {/* <Text>2</Text> */}
                    {/* <Text>2</Text> */}
                    <PhotoUpload fresh={() => setFresh(!fresh)} username={user} />
                </TabArea>
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
    bufferStyle: {
        display: "block",
        height: 12,
        widht: 1,
    },
    header1: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    bio: {
        fontSize: 15,
        marginBottom: 4,
        marginTop: 4,
        maxWidth: "75%"
    },
    topView: {
        backgroundColor: '#007BFF',
        height: '25%',
        padding: 30
    },
    mainView: {
        height: "100vh",
    },
    infoView: {
        padding: 16,
    },
    userIconPosition: {
        position: "absolute",
        bottom: 0 - 44,
        right: 16 //NOTE 24 might be better
    },
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

export default Profile;