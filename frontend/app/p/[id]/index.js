import { View, TextInput, Text, StyleSheet, Pressable, ScrollView, Image, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react'
import { Link, router, useGlobalSearchParams } from 'expo-router';
import { shouldUseActivityState } from 'react-native-screens';


import IndicatorButton from '@components/Button.js';
import TabSelect, { TabArea } from '@components/Tabs.js';
import PhotoUpload from '@components/PhotoUpload.js';
import { retrieveSecret } from '../../Storage.js'
import { ProfileFeed } from '@components/Feed.js'
import { Button, Tabs } from '@components/Button.js';
import { StyledTextInput } from '@components/Input.js'
import { sendAssociationRequest } from '@components/Network.js'

function GroupModal() {
    return (
        <View><Text>Hello Groups!</Text></View>
    )
}

const Profile = () => {
    const [active, setActive] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState("");
    const [pfpPath, setPfpPath] = useState(null);
    const [fresh, setFresh] = useState(true);
    const [ownProfile, setOwnProfile] = useState(false);
    const [modalShown, setModalShown] = useState(false);
    const [friendStatus, setFriendStatus] = useState(-2); //-2 default (own profile or not loaded) -1 not friends 0 pending 1 friend 2 blocked
    const scrollViewRef = useRef(null);

    const glob = useGlobalSearchParams();

    // Reset user view to top of screen
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
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

                if (response.status == 200) {
                    setUser(responseJson.username);
                    setOwnProfile(responseJson.ownProfile);
                    setFriendCount(responseJson.friendCount);
                    setBio(responseJson.bio);
                    setPfpPath(responseJson.pfpPath)
                    if (!responseJson.ownProfile) {
                        console.log("setting friend status to: " + responseJson.friends)
                        setFriendStatus(responseJson.friends)
                    }
                }
                else {
                    dropSecret('authToken')
                    router.push('/Login')
                }
                // setChallenges(responseJson.images)
            } catch (error) {
                console.error(error);
            }
        }
        fetchProfile()
    }, [fresh])

    //Liam | UX/UI Designer 🎨 | Turning ideas into seamless experiences ✨ | Coffee addict ☕ | Always sketching the next big thing 🚀

    const ProfileData = () => {
        if (!ownProfile) {
            return (
                <View>
                    <ProfileFeed user={glob.id} fresh={fresh} />
                </View>
            )
        }

        return (
            <View>
                <TabSelect active={active} setActive={(i) => setActive(i)} tabItems={["Challenges", "Personal Info"]} />
                <TabArea active={active}>
                    <ProfileFeed user={user} fresh={fresh} />
                    <PhotoUpload fresh={() => setFresh(!fresh)} username={user} />
                </TabArea>
            </View>
        )
    }

    const SocialButton = () => {
        if (friendStatus == -2) {
            return null
        }
        if (friendStatus == -1) {
            return (
                <Button style={{ flexGrow: 1 }} onPress={() => sendAssociationRequest(0, friendStatus, glob.id, setFriendStatus)} text='Add Friend' />
            )
        }
        else if (friendStatus == 0) {
            return (
                <Button style={{ flexGrow: 1 }} onPress={() => sendAssociationRequest(-1)} text='Cancel Friend Request' />
            )
        }
        else {
            return (
                <Button style={{ flexGrow: 1 }} onPress={() => sendAssociationRequest(-1)} text='Remove Friend' />
            )
        }
    }

    return (
        <View style={styles.container}>

            <ScrollView ref={scrollViewRef} style={styles.content}>

                <View style={styles.topView}>
                    <Text style={styles.username}>{glob.id}</Text>
                    <Pressable style={styles.profileButton} onPress={ownProfile ? () => router.push('/Settings') : null}>
                        <Image style={styles.userIcon} source={{
                            uri: `http://localhost:3000/${pfpPath ? pfpPath : "Blank-Avatar.webp"}`,
                        }} />
                    </Pressable>
                </View>

                <View style={styles.bio}><Text style={styles.bioText}>{bio}</Text></View>

                <View style={styles.infoView}>
                    <View style={styles.socialButtonView}>
                        <Button style={{ flexGrow: 1 }} text={`${friendCount} Group Mates`} onPress={() => setModalShown(!modalShown)} />
                        {/* <Modal
                            animationType="slide"
                            transparent={false}
                            visible={modalShown}
                            onRequestClose={() => {
                            setModalVisible(!modalShown);
                        }}>
                            <GroupModal />
                            <Button text={"close modal"} onPress={() => setModalShown(false)}/>
                        </Modal> */}
                        <SocialButton />
                    </View>
                    <View style={styles.bufferStyle}></View>
                    {/* <ProfileData/> */}
                    <ProfileFeed user={glob.id} fresh={fresh} />
                </View>

            </ScrollView>

            <Tabs currentPage={ownProfile ? 2 : null} handleHome={() => { setFresh(false); router.push('/home') }} handleProfile={() => { ownProfile ? scrollToTop : router.push(`/p/${user}`) }} />

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
    username: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
        color: '#fff',
        textAlign: 'center',
    },
    bio: {
        marginBottom: 4,
        marginTop: 10,
        marginLeft: 20,
        maxWidth: "70%",
    },
    bioText: {
        color: '#fff',
        fontSize: 15,
    },
    topView: {
        backgroundColor: '#1f8a55',
        height: '10vh',
        padding: 30,
        position: 'relative',
        zIndex: 1000,
    },
    infoView: {
        padding: 16,
    },
    profileButton: {
        position: "absolute",
        bottom: 0 - 44,
        right: 16, //NOTE 24 might be better
        backgroundColor: '#38c880',
        display: "inline",
        padding: 4,
        borderRadius: 50,
        borderColor: '#38c880',
    },
    userIcon: {
        borderRadius: 50,
        width: 86,
        height: 86,
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
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#030806',
        // height: '100vh', REMOVED
    },
    content: {
        flex: 1,
    },
    socialButtonView: {
        display: "flex",
        flexDirection: "row",
        // justifyContent: "space-between"
    }
});

export default Profile;