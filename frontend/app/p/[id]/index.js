import { View, TextInput, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react'
import { router, useGlobalSearchParams } from 'expo-router';
import { shouldUseActivityState } from 'react-native-screens';


import IndicatorButton from '@components/Button.js';
import UserIcon from '@components/Icons.js';
import TabSelect, { TabArea } from '@components/Tabs.js';
import PhotoUpload from '@components/PhotoUpload.js';
import { retrieveSecret } from '../../Storage.js'
import { ChallengesView } from '../../Challenge/Challenge.js'
import { Button, Tabs } from '@components/Button.js';

const Profile = () => {
    const [active, setActive] = useState(0)
    const [user, setUser] = useState(null)
    const [bio, setBio] = useState(null)
    const [fresh, setFresh] = useState(true)
    const [ownPage, setOwnPage] = useState(false)
    const [friendStatus, setFriendStatus] = useState(-1) //0 pending 1 friend 2 blocked
    const bioRef = useRef(null)
    const scrollViewRef = useRef(null);

    const glob = useGlobalSearchParams();

    // Reset user view to top of screen
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true});
        }
    };

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
                            "pageUserName": glob.id
                        }),
                    }
                );
                const responseJson = await response.json();
                console.log(responseJson)
                setUser(responseJson.username)
                setBio(responseJson.bio)
                setOwnPage(responseJson.ownProfile)
                if(!responseJson.ownProfile){
                    console.log("setting friend status to: " + responseJson.friends)
                    setFriendStatus(responseJson.friends)
                }
                // setChallenges(responseJson.images)
            } catch (error) {
                console.error(error);
            }
        }
        fetchProfile()
    }, [fresh])

    //Liam | UX/UI Designer 🎨 | Turning ideas into seamless experiences ✨ | Coffee addict ☕ | Always sketching the next big thing 🚀


    const AddBio = () => {
        return (
            <View style={styles.addBioView}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a nifty bio!"
                    value={bio}
                    ref={bioRef}
                />
                <Pressable onPress={() => {
                    const saveBio = async () => {
                        try {
                            const token = await retrieveSecret('authToken')
                            console.log(`Token: ${token}`)
                            const response = await fetch(
                                'http://localhost:3000/savebio',
                                {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        authorization: `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        "bio": bioRef.current.value
                                    }),
                                }
                            );
                            const responseJson = await response.json();
                            console.log(responseJson)
                            setBio(bioRef.current.value)
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    saveBio()
                }} style={styles.addBioButton}>
                    <Text style={{ color: "white" }}>Add</Text>
                </Pressable>
            </View>
        )
    }

    const ProfileData = () => {
        if(!ownPage){
            return (
                <View>
                    <ChallengesView user={glob.id} fresh={fresh} />
                </View>
            )
        }

        return (
            <View>
                <TabSelect active={active} setActive={(i) => setActive(i)} tabItems={["Challenges", "Personal Info"]} />
                <TabArea active={active}>
                    <ChallengesView user={user} fresh={fresh} />
                    <PhotoUpload fresh={() => setFresh(!fresh)} username={user} />
                </TabArea>
            </View>
        )
    }

    const sendAssociationRequest = async (code) => {
        try {
            const token = await retrieveSecret('authToken')
            console.log(`Token: ${token}`)
            const response = await fetch(
                'http://localhost:3000/associationRequest',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "code": code,
                        "currentCode": friendStatus,
                        "pageUserName": glob.id
                    }),
                }
            );
            const responseJson = await response.json();
            // console.log(responseJson)
        } catch (error) {
            console.error(error);
        }
    }

    const SocialButton = () => {
        if(friendStatus == -1){
            return (
                <Button onPress={() => sendAssociationRequest(0)} text='Add Friend' />
            )
        }
        else if(friendStatus == 0) {
            return (
                <Button onPress={() => sendAssociationRequest(-1)} text='Cancel Friend Request' />
            )
        }
        else {
            return (
                <Button onPress={() => sendAssociationRequest(-1)} text='Remove Friend' />
            )
        }
    }

    return (
        <View style={styles.container}>

            <ScrollView ref={scrollViewRef} style={styles.content}>
                
                <View style={styles.topView}>
                    <Text style={styles.title}>Profile page</Text>
                    <UserIcon style={styles.userIcon} />
                </View>

                <View style={styles.infoView}>
                    <Text style={styles.header1}>{glob.id}</Text>
                    {bio == null && ownPage ? <AddBio /> : bio == null ? null : <Text style={styles.bio}>{bio}</Text>}
                    <View>
                        <Button text='13 Group Mates' />
                        <SocialButton />
                    </View>
                    <View style={styles.bufferStyle}></View>
                    <ProfileData/>
                </View>

            </ScrollView>

            <Tabs handleHome={() => router.push('/home')} handleProfile={scrollToTop} />

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
    bufferStyle: {
        display: "block",
        height: 12,
        widht: 1,
    },
    header1: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
        color: '#fff',
    },
    bio: {
        fontSize: 15,
        marginBottom: 4,
        marginTop: 4,
        maxWidth: "75%",
        color: '#fff',
    },
    topView: {
        backgroundColor: '#1f8a55',
        height: '10vh',
        padding: 30
    },
    infoView: {
        padding: 16,
    },
    userIcon: {
        position: "absolute",
        bottom: 0 - 44,
        right: 16, //NOTE 24 might be better
        backgroundColor: '#38c880',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: 220,
        alignSelf: 'center',
    },
    addBioView: {
        display: "flex",
        flexDirection: "row"
    },
    addBioButton: {
        backgroundColor: "#007BFF",
        padding: 8,
        height: 40,
        borderRadius: "0.375rem"
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#030806',
        // height: '100vh', REMOVED
    },
    content: {
        flex: 1,
    },
});

export default Profile;