import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { dropSecret, retrieveSecret } from './Storage.js';
import { Feed } from '@components/Feed.js';
import { useState, useEffect, useRef } from 'react';
import { Button, Tabs } from '@components/Button.js';
import Search from './Search.js';
import { fetchChallenge } from './Components/Network.js';
import { colors } from '../assets/theme.js';
import { Icon } from 'react-native-elements';


const home = () => {
    const [username, setUsername] = useState('');
    const [modalShown, setModalShown] = useState(false);

    const scrollViewRef = useRef(null);

    // Reset user view to top of screen
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    useEffect(() => {
        // setUsername('test');

        const fetchHome = async () => {
            try {
                const token = await retrieveSecret('authToken')
                console.log(`Token: ${token}`)
                const response = await fetch(
                    'http://localhost:3000/home',
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
                
                if(response.status == 200){
                    setUsername(responseJson.username)
                }
                else {
                    console.log('pushing')
                    dropSecret('authToken')
                    router.push('/Login')
                }
                
            } catch (err) {
                console.error(err);
            }
        }
        fetchHome()
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollViewRef} style={styles.content}>
                <Text style={styles.title}>Home Page</Text>
                <Button onPress={() => setModalShown(true)} text='Search'/>
                <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalShown}
                            onRequestClose={() => {
                                setModalShown(!modalShown);
                            }}>
                    <Search onClose={() => setModalShown(false)}/>
                </Modal>
                <Button onPress={() => { dropSecret('authToken'); router.push('/Login') }} text='Sign Out' />
                <DailyQuestDisplay />
                <Feed user={username} />
            </ScrollView>

            <Tabs currentPage={0} handleHome={scrollToTop} handleProfile={() => router.push(`/p/${username}`)}/>

        </View>
    );
};

const DailyQuestDisplay = () => {
    const [activeQuest, setActiveQuest] = useState(null)
    const [minimized, setMinimized] = useState(false)

    useEffect(() => {fetchChallenge(setActiveQuest)}, [])

    const styles = StyleSheet.create({
        questView: {
            backgroundColor: colors.secondary,
            marginTop: 16,
            marginBottom: 16,
            padding: 16,
            borderRadius: "5px",
            position: "relative"
        },
        name: {
            fontSize: 24,
            marginBottom: 16,
            color: colors.text,
        },
        desc: {
            fontSize: 16,
            color: colors.text
        },
        collapseIcon: {
            position: "absolute",
            top: 18,
            right: 18
        }
    });

    if(minimized){
        return (
            <View style={styles.questView}>
                <Text style={{...styles.name, marginBottom: 0}}>{activeQuest?.name}</Text>
                <Pressable style={styles.collapseIcon} onPress={() => setMinimized(!minimized)}>
                    <Icon name='plus' type='material-community' color={"white"} />
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.questView}>
            <Text style={styles.name}>{activeQuest?.name}</Text>
            <Text style={styles.desc}>{"In today's quest your goal should be to spread joy to an old friend. However you do this just snap a pic of it and give it a share!"}</Text>
            <Pressable style={styles.collapseIcon} onPress={() => setMinimized(!minimized)}>
                <Icon name='minus' type='material-community' color={"white"} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#030806',
    },
    content: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
    },
    questView: {
        backgroundColor: colors.secondary,
        marginTop: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: "5px"
        // display: "flex",
        // justifyContent: "center"
    },
    name: {
        fontSize: 24,
        marginBottom: 16,
        // textAlign: 'center',
        color: colors.text,
    },
    desc: {
        fontSize: 16,
        color: colors.text
    }
});

export default home;