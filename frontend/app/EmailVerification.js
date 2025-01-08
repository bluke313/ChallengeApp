import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {sendVerificationEmail, whoAmI, verifyEmail} from "@components/Network.js"

const EmailVerification = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [showError, setShowError] = useState(false);
    const [verificationCode, setVerificationCode] = useState(null);
    const [code, setCode] = useState(["", "", "", ""]);
    const inputs = useRef([]);
    const [email, setEmail] = useState("");
    const [verified, setVerified] = useState(false)

    const handleChangeText = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // handle auto textInput swapping
        if (text && index < inputs.current.length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    // handle auto textInput swapping
    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    // return true if verified
    const checkVerified = () => {
        whoAmI(null, setEmail, setVerified)
    };

    // print verificationCode for testing 
    // TODO Delete when we don't have fake email accounts anymore
    useEffect(() => { console.log("verificationCode: " + verificationCode); }, [verificationCode]);

    // auto send email on open or login if verified
    useEffect(() => {
        checkVerified()
        if (!verified && email != "") {
            sendVerificationEmail(email, setVerificationCode, setIsDisabled); // send an email
        }
        else if(verified){
            router.push("/home")
        }
    }, [verified, email]);

    // auto detect fully typed 4-digit code
    useEffect(() => {
        var fullCode = true;
        var codeString = "";
        code.forEach((digit) => {
            codeString = codeString + digit;
            if (digit === "") {
                fullCode = false;
            }
        });

        if (fullCode) {
            if (codeString == verificationCode) {
                console.log('code matched');
                verifyEmail(email)
                //TODO future work make it check for positive response
                router.push('/home');
            }
            else {
                setShowError(true);
            }
        }
        else {
            setShowError(false);
        }

    }, [code]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Email Verification</Text>
            <Text style={styles.text}>An email has been sent to {email}</Text>
            <View style={{ flexDirection: 'row' }}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        style={showError ? styles.numberInputError : styles.numberInput}
                        value={digit}
                        onChangeText={(text) => handleChangeText(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        maxLength={1}
                        keyboardType="numeric"
                        textAlign="center"
                    />
                ))}
            </View>
            {/* {showError ? <Text style={styles.errorText}>Code does not match</Text> : <View style={{ height: 19, marginBottom: 10 }}/>} */}
            <Text
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onPress={isDisabled ? null : () => sendVerificationEmail(email, setVerificationCode, setIsDisabled)}
                style={isDisabled
                    ?
                    { color: 'grey' }
                    :
                    isHovered ? { color: '#8bdbb3', textDecorationLine: 'underline', cursor: 'pointer' } : { color: '#8bdbb3' }}
            >Resend email</Text>
            {isDisabled ? <Text style={styles.text}>Please wait 30 seconds before trying again</Text> : <View style={{ height: 19 }}/>}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#030806',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        position: 'absolute',
        top: 20,
        padding: 10,
        alignSelf: 'center',
        color: '#fff',
    },
    text: {
        color: 'white',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    bottomText: {
        color: '#8bdbb3',
    },
    bottomTextHover: {
        color: '#8bdbb3',
        textDecorationLine: 'underline',
    },
    numberInput: {
        backgroundColor: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        height: 40,
        width: 30,
        borderRadius: 10,
        borderWidth: 1,
        color: 'black',
        margin: 10,
        fontSize: 15,
    },
    numberInputError: {
        backgroundColor: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        height: 40,
        width: 30,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'red',
        color: 'black',
        margin: 10,
        fontSize: 15,
    },
});

export default EmailVerification;