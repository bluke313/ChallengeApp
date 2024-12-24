import { View, TextInput, Text, StyleSheet, Pressable, ScrollView, Image, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react'
import { Button, Tabs } from '@components/Button.js';
import { StyledTextInput } from './Input';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors } from '../../assets/theme';


const ImageEditor = () => {

    return (
        <View style={styles.view}>
            <Text style={styles.text}>Edit Photo</Text>
            <Image
                source={{ uri: previewUrl }}
                style={{ width: 300, height: 250, marginTop: 25, marginBottom: 25 }}
                resizeMode="contain"
            />
            {/* <Button title={previewUrl}></Button> */}
            <Button title="Upload Photo" onPress={handlePhotoUpload} />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        backgroundColor: "rgba(0,0,0,.7)",
        height: '100vh',
        width: '100vw',
        zIndex: '10',
        position: "absolute",
        top: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around"
    },
    text: {
        color: 'white',
        fontSize: 16,
        marginRight: 5,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    pfpUploadContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    updateResponseText: {
        color: colors.accent,
        textAlign: 'center',
        marginTop: 12
    }

});

export default ImageEditor;