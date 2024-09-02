import { StyleSheet, Text, View, Pressable } from "react-native";

export const Button = ({ text, onPress, disabled }) => {
    return (
        <Pressable style={disabled ? styles.disabledButton : styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    )
};

export const Tabs = ({ handleHome, handleProfile }) => {
    return (
        <View style={styles.tabs}>
            <Pressable style={styles.tabsButton} onPress={handleHome}>
                <Text style={styles.buttonText}>{`\u{1F3E0}`}</Text>
            </Pressable>

            <Pressable style={styles.tabsButton} onPress={handleProfile}>
                <Text style={styles.buttonText}>{`\u{1F9D1}`}</Text>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1f8a55',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: 5,
    },
    tabsButton: {
        backgroundColor: '#1f8a55',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
        width: 100,
    },
    tabs: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#38c880',
    },
    disabledButton: {
        backgroundColor: '#8bdbb3',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});