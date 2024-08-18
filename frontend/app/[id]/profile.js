import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import IndicatorButton from '../Components/Button';
import UserIcon from '../Components/Icons';
import TabSelect, { TabArea } from '../Components/Tabs';
import { useEffect, useState } from 'react'
import { shouldUseActivityState } from 'react-native-screens';
import PhotoUpload from '../Components/PhotoUpload';
import {retrieveSecret} from '../Storage.js'
import {ChallengesView} from './Challenge/Challenge.js'


const Profile = () => {
    const [active, setActive] = useState(0)
    const [user, setUser] = useState(null)
    const [fresh, setFresh] = useState(true)

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
                // setChallenges(responseJson.images)
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
                    <ChallengesView user={user} fresh={fresh}/>
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
    }
});

export default Profile;