import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tabs } from './Components/Button';
import { router } from 'expo-router';
import { whoAmI } from './Components/Network';


export default function Camera() {
  const [facing, setFacing] = useState('back');
  const [mirror, setMirror] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [username, setUsername] = useState('');

  useEffect(() => {
    whoAmI(setUsername)
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

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} zoom={1}>
        <View style={styles.buttonContainer}>

          {/* <TouchableOpacity style={styles.button} onPress={() => {console.log(mirror); setMirror(!mirror)}}>
            <Text style={styles.text}>Mirror</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
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
});
