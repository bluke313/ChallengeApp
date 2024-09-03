import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { dropSecret, retrieveSecret } from './Storage.js';
import { Feed } from '@components/Feed.js';
import { useState, useEffect, useRef } from 'react';
import { Button, Tabs } from '@components/Button.js';
import { StyledTextInput } from '@components/Input.js';
import { UserFeed } from '@components/Feed.js';

const Search = () => {

    const [searchText, setSearchText] = useState('');


    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Search</Text>
                <StyledTextInput
                    placeholder="Search user"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <UserFeed searchText={searchText}/>
            </ScrollView>
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
        backgroundColor: '#030806',
    },
    content: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
    },
});

export default Search;