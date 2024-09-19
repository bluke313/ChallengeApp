import { useState } from "react";
import { StyleSheet, TextInput, Text, View, Pressable } from "react-native";
import { colors } from "../../assets/theme";

export const StyledTextInput = ({...rest}, ref) => {
    const [focused, setFocused] = useState(false)
    return (
        <TextInput
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={focused ? styles.inputFocused : styles.input} 
            ref={ref}
            {...rest} 
        />
    )
}

export const SecureTextinput = ({...rest}) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <View style={{flexDirection: "row"}}>
            <StyledTextInput 
                {...rest}
                secureTextEntry={!showPassword} 
            />
            <Pressable 
                onPress={() => setShowPassword(!showPassword)}
                style={{ width: 0, right: 37 }}
            >
                <Text selectable={false} style={{fontSize: "30px"}}>
                    {showPassword ? '\u{1F512}' : '\u{1F513}'}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: colors.gray,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: 220,
        alignSelf: 'center',
        color: colors.text,
    },
    inputFocused: {
        height: 40,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: 220,
        alignSelf: 'center',
        color: colors.text,
        outlineColor: colors.accent
    },
    inputErr: {
        height: 40,
        borderColor: 'red',
        borderWidth: 2,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: 220,
        alignSelf: 'center',
    },
})