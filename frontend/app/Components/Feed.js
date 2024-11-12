import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Link, router, useGlobalSearchParams } from 'expo-router';
import { retrieveSecret } from '../Storage';
import { colors } from '../../assets/theme';
import { Icon } from 'react-native-elements';
import { sendAssociationRequest, whoAmI } from '@components/Network.js'

const FeedImage = ({ image }) => {
    return (
        <View style={styles.container}>
            <UsernameWithPicture username={image.username} pfpPath={image.pfpPath} />
            <Pressable
                onPress={() => router.push(`i/${image.id}`)}
                key={`${image.id}-image`}
            >
                <Image
                    style={styles.image}
                    source={{
                        uri: `http://localhost:3000/${image.path}`,
                    }}
                />
            </Pressable>
            <Text style={styles.caption}>{image.caption == null ? null : image.caption}</Text>
            <Text style={styles.timestamp}>Uploaded {image.timestamp}</Text>
        </View>
    )
};

export const UsernameWithPicture = ({ username, pfpPath }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Text
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={isHovered
                ? { color: 'white', textDecorationLine: 'underline', ...styles.linkStyle }
                : { color: "white", ...styles.linkStyle }}
            onPress={() => router.push(`/p/${username}`)}
        >
            <Image style={styles.userIcon} source={{
                uri: `http://localhost:3000/${pfpPath ? pfpPath.slice(7) : "Blank-Avatar.webp"}`,
            }} />
            {username}
        </Text>)
};

export const Feed = ({ user }) => {
    const [feedData, setFeedData] = useState(null);
    const [currentChallenge, setCurrentChallenge] = useState(null)

    const fetchFeed = async () => {
        try {
            const token = await retrieveSecret('authToken');
            const response = await fetch(
                'http://localhost:3000/feed',
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseJson = await response.json();

            if (response.status === 200) {
                setFeedData(responseJson);
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetchFeed() }, []);

    return (
        <View style={{ display: "flex", gap: 50, marginBottom: 75, marginTop: 25 }}>
            {feedData == null ? null : feedData.map((data, i) => <FeedImage key={i} image={data} />)}
        </View>
    )
};

export const UserFeed = ({ onClose, user, searchText }) => {

    const [feedData, setFeedData] = useState(null);

    const fetchFeed = async () => {
        try {
            const token = await retrieveSecret('authToken')
            const response = await fetch(
                'http://localhost:3000/userFeed',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ query: searchText })
                }
            );
            const responseJson = await response.json();
            setFeedData(responseJson.matches);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { searchText === '' ? setFeedData(null) : fetchFeed() }, [searchText]);

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
        }
    })

    return (

        <View style={styles.container}>
            {feedData == null ? null : (feedData.length == 0 ? <Text style={{ opacity: '50%', color: colors.accent }}>No Results Found</Text> : feedData.map((data, i) => <UsernameLink onClose={onClose} key={i} data={data} />))}
        </View>
    )
};

export const FriendsFeed = ({ onClose, user, searchText }) => {

    const [feedData, setFeedData] = useState(null);

    const fetchFeed = async () => {
        try {
            
            const token = await retrieveSecret('authToken')
            const response = await fetch(
                'http://localhost:3000/friendsFeed',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ query: searchText })
                }
            );
            const responseJson = await response.json();
            console.log(responseJson.matches);
            setFeedData(responseJson.matches);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {fetchFeed()}, [searchText]);

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
        }
    })

    return (

        <View style={styles.container}>
            {feedData == null ?
                null
                :
                (feedData.length == 0 ?
                    <Text style={{ opacity: '50%', color: colors.accent }}>No Results Found</Text>
                    :
                    feedData.map((data, i) => <UsernameLink onClose={onClose} key={i} data={data} />)
                )
            }
        </View>
    )
};

const UsernameLink = ({ onClose, data, ...rest }) => {
    const [hover, setHover] = useState(false);
    const [friendStatus, setFriendStatus] = useState(data.type)

    const SocialButton = () => {
        if (friendStatus == -1) {
            return (
                <Pressable onPress={() => sendAssociationRequest(0, friendStatus, data.username, setFriendStatus)} style={styles.plusView}><Icon name='account-plus' type='material-community' color={"gray"} /></Pressable>
            )
        }
        else if (friendStatus == 0) {
            return (
                <Pressable onPress={() => sendAssociationRequest(-1, friendStatus, data.username, setFriendStatus)} style={styles.plusView}><Icon name='account-clock' type='material-community' color={"orange"} /></Pressable>
            )
        }
        else {
            return (
                <View style={styles.plusView}><Icon name='account-heart' type='material-community' color={colors.accent} /></View>
            )
        }
    }

    const styles = StyleSheet.create({
        text: {
            color: colors.text,
        },
        link: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 6,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: colors.secondary,
            width: 200,
            backgroundColor: 'rgba(255,255,255,.05)',
        },
        linkHover: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 6,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: colors.secondary,
            width: 200,
            backgroundColor: 'rgba(255,255,255,.25)',
        },
        plusView: {
            display: "block",
            width: "25px",
            height: "25px"
        },
        userIcon: {
            borderRadius: 50,
            width: 25,
            height: 25,
        }
    })

    return (
        <Pressable style={hover ? styles.linkHover : styles.link} {...rest} onHoverIn={() => setHover(true)} onHoverOut={() => setHover(false)} onPress={() => { onClose(); router.push(`/p/${data.username}`); }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px" }}>
                <Image style={styles.userIcon} source={{
                    uri: `http://localhost:3000/${data.pfpPath ? data.pfpPath.slice(7) : "Blank-Avatar.webp"}`,
                }} />
                <Text style={styles.text}>{data.username}</Text>
            </View>
            <SocialButton friendStatus={data.type} />
        </Pressable>
    )
};

export const ProfileFeed = ({ user, fresh }) => {
    const [challenges, setChallenges] = useState([])
    const [username, setUsername] = useState(null)
    const localParams = useGlobalSearchParams()


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await retrieveSecret('authToken')
                // console.log(`Token: ${token}`)
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

                if (response.status === 200) {
                    setChallenges(responseJson.images)
                }
            } catch (error) {
                console.error(error);
            }
        }
        whoAmI(setUsername)
        fetchProfile()
    }, [fresh])

    const styles = StyleSheet.create({
        challengeFeed: {
            marginTop: 8,
            marginLeft: "auto",
            marginRight: "auto",
            // backgroundColor: "red",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            rowGap: 10,
            gap: 10,
        },
        smallChallengeImage: {
            width: 100,
            height: 100
        }
    });

    return (
        <View style={styles.challengeFeed}>
            {challenges == [] ? null : challenges.map((item, i) =>
                <Pressable
                    style={{ borderColor: '#38c880', borderWidth: 1 }}
                    onPress={() => router.push(`i/${item.id}`)}
                    key={`${user}-image-${i}`}
                >
                    <Image
                        style={styles.smallChallengeImage}
                        source={{
                            uri: `http://localhost:3000/${item.path}`,
                        }}
                    ></Image>
                </Pressable>
            )}
        </View>
    )
};



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // marginBottom: "100px",
        padding: 16,
        backgroundColor: "rgba(255,255,255,.15)",
        borderColor: colors.secondary,
        borderWidth: 1,
        borderRadius: "10px",
    },
    userIcon: {
        borderRadius: 50,
        width: 25,
        height: 25,
    },
    linkStyle: {
        fontSize: "20px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
        justifyContent: "flex-start",
        width: "100%",
        marginBottom: "14px"
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        minWidth: 100,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: 350,
        height: 400,
        borderWidth: 2,
        // borderColor: '#38c880',
        backgroundColor: 'white',
    },
    caption: {
        fontFamily: 'sans-serif',
        marginTop: 3,
        color: '#fff',
    },
    timestamp: {
        fontFamily: 'sans-serif',
        marginBottom: 3,
        color: '#fff',
    },
});