import { View, TextInput, Text, StyleSheet, Pressable, ScrollView, Image, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react'
import { Link, router, useGlobalSearchParams } from 'expo-router';
import { shouldUseActivityState } from 'react-native-screens';
import { Button, Tabs } from '@components/Button.js';
import { colors } from '../assets/theme';
import { StyledTextInput } from './Components/Input';
import { retrieveSecret } from './Storage';


const Settings = () => {
    const [user, setUser] = useState('');
    const [bio, setBio] = useState("");
    const [pfp, setPfp] = useState("");

    const handleUpdate = async () => {
        try {
            const token = await retrieveSecret('authToken')
            const response = await fetch(
                'http://localhost:3000/updateProfile',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bio: bio })
                }
            );
            const responseJson = await response.json();
        } catch (err) {
            console.error(err);
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
                            "pageUserName": null
                        }),
                    }
                );
                const responseJson = await response.json();

                if (response.status == 200) {
                    setUser(responseJson.username)
                    setBio(responseJson.bio);
                    // setBio();
                    // setPfp();
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
    }, []);

    return (
        <View style={styles.view}>
            <Button text="Return" onPress={() => router.push(`/p/test`)} />
            <View style={styles.container}>
                <Text style={styles.text}>Bio: </Text>
                <StyledTextInput
                    defaultValue={bio}
                    value={bio}
                    onChangeText={setBio}
                />
            </View>
            <Button text="Update" onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        backgroundColor: colors.background,
        height: '100vh',
    },
    text: {
        color: 'white',
        fontSize: 24,
        marginRight: 5,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    }
});

export default Settings;