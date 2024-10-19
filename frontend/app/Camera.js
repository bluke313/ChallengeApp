import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Tabs, Button } from './Components/Button';
import { router } from 'expo-router';
import { fetchChallenge, photoUpload, savePhotoRequest, whoAmI } from './Components/Network';
import { DailyQuestDisplay } from './Components/Quest';


export default function Camera() {
  const [facing, setFacing] = useState('back');
  const [mirror, setMirror] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [username, setUsername] = useState('');

  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);

  useEffect(() => {
    whoAmI(setUsername)
    fetchChallenge(setActiveChallenge)
  }, [])

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if(cameraRef.current) {
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                mirror: true
            })
            handlePictureSaved(photo);
        } catch (e) {
            console.error(e)
        }
    }
  }

  const handlePictureSaved = (photo) => {
      photo.path = "test-path.png"
    setPhoto(photo)
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const cameraState = () => {
    if(photo?.uri) {
        return (
            <View style={styles.imageContainer}>
                <Image source={{ uri: photo.uri }} style={styles.image} />
                <View style={{display: "flex", flexDirection: "row"}}>
                    <Button style={{flexGrow: 1}} onPress={() => savePhotoRequest(photo.base64, activeChallenge.id)} text="Confirm" />
                    <Button style={{flexGrow: 1}} text="Retake" onPress={() => setPhoto(null)} />
                </View>
            </View>
        )
    }
    else {
        return (
        <CameraView mirror={false} ref={cameraRef} style={styles.camera} facing={facing} zoom={1}>
                {/* <Text style={styles.text}>{activeChallenge?.name}</Text> */}
                <DailyQuestDisplay setParentQuest={setActiveChallenge}/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.text}>Click</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
            </View>
        </CameraView>
      )
    }
  }

  return (
    <View style={styles.container}>
      {cameraState()}
      <Tabs currentPage={0} handleHome={() => router.push('/home')} handleProfile={() => router.push(`/p/${username}`)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    position: 'relative'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    // height: "30px"
    // flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",

  },
  image: {
    width: 350,
    height: 600,
    marginTop: 10,
  }

});
