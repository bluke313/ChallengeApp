import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { dropSecret } from '../Storage.js';

const home = () => {
    return (
        <View>
            <Text style={styles.title}>Home Page</Text>
            <Pressable 
                onPress={() => {dropSecret('authToken'); router.push('/Login')}}
                style={styles.button}
            >
            <Text style={styles.buttonText}>Sign Out
            </Text>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default home;