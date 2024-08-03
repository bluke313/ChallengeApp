import { View, Text, StyleSheet, Pressable } from 'react-native';

const profile = () => {
    return (
        <View>
            <Text style={styles.title}>Profile page</Text>
        </View>
    );
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

export default profile;