import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Button, Tabs } from '@components/Button.js';
import { StyledTextInput } from '@components/Input.js';
import { UserFeed, FriendsFeed } from '@components/Feed.js';
import { whoAmI } from './Components/Network.js';
import { PrimaryButton } from './Components/Button.js';
import { router } from 'expo-router';


export const Search = ({onClose}) => {

    const [searchText, setSearchText] = useState('');
    const [username, setUsername] = useState(null);
    
    useEffect(() => {
        whoAmI(setUsername)
    }, [])

    

    return (
        <View style={styles.container}>
            <Button text="close" onPress={onClose}/>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Search</Text>
                <StyledTextInput
                    placeholder="Search user"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <UserFeed onClose={onClose} user={username} searchText={searchText}/>
            </ScrollView>
            {/* <Tabs handleHome={() => router.push('/home')} handleProfile={() => router.push(`/p/${username}`)}/> */}
        </View>
    );
};

export const FriendsList = ({onClose, user}) => {

    const [searchText, setSearchText] = useState('');
    const [username, setUsername] = useState(null);
    
    useEffect(() => {
        whoAmI(setUsername)
    }, [])

    

    return (
        <View style={styles.container}>
            <Button text="close" onPress={onClose}/>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Group Mates</Text>
                <StyledTextInput
                    placeholder="Search user"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <FriendsFeed user={user} onClose={onClose} searchText={searchText}/>
            </ScrollView>
            {/* <Tabs handleHome={() => router.push('/home')} handleProfile={() => router.push(`/p/${username}`)}/> */}
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
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // backgroundColor: '#030806',
        backgroundColor: 'rgba(0,0,0,.90)',
    },
    content: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
    },
});