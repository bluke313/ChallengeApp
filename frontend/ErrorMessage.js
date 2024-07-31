import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';


const ErrorMessage = ({msg}) => {

    if (msg === ''){
        return null
    }
    return (
        <Text style={styles.errorMsgText}>{msg}</Text>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
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
    },
    errorMsgText: {
        // color: '#f76',
        backgroundColor: '#F64545',
        // backgroundColor: '#FF8B8B',
        fontSize: 12,
        borderRadius: "0.375rem",
        color: "#fff",
        textAlign: 'center',
        padding: '10px',
        margin: 4,
        maxWidth: 174,
        opacity: .9,
    },
});

export default ErrorMessage