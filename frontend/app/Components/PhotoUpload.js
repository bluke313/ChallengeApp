import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { View, Image, ImageBackground, Button, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { retrieveSecret } from '../Storage.js'

export default function PhotoUpload({ username }) {
  const [photo, setPhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originX, setOriginX] = useState(0);
  const [originY, setOriginY] = useState(0);
  const [height, setHeight] = useState(250);
  const [width, setWidth] = useState(300);

  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (resp) => {
      if (resp) {
        setPhoto(resp);
      }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    if (file) { 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handlePhotoUpload = async () => {
    try {
      const token = await retrieveSecret('authToken')
      const data = new FormData() //creates binary to transfer photo
      data.append('file', photo) //adds photo to the binary
      data.append('body', JSON.stringify({
        "username": username
      }))
      // data.append('headers', JSON.stringify({
      //   'Accept': 'application/json',
      //   'authorization': `Bearer ${token}`,
      // }))

      axios.post('http://localhost:3000/pfpUpload', data, {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      }) //sends photo the backend
        .then((res) => {
          console.log(res)
        setPhoto(null);
        })

    } catch (err) {
      console.error(err)
    }
  }


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <input
        type='file'
        name='file'
        onChange={handleImageChange}
        accept='.png,.jpg,.webp'
      />
      {photo && (
        <View style={styles.backgroundView}>
          {/* <ImageBackground source={"./assets/Sprite-0001.png"} style={{width: "300px", height: "250px"}}> */}
          <View style={{position: "relative", width: "300px", height: "250px"}}> 
            <Image
              source={{ uri: previewUrl }}
              style={{marginLeft: originX, marginTop: originY, width: width, height: height, marginTop: 25, marginBottom: 25 }}
              resizeMode="contain"
            />
            <Image 
              source={"./assets/Sprite-0001.png"}
              style={{opacity: 0.3, position: "absolute",width: "300px", height: "250px"}}
            />
          </View>
          <Slider 
            value={originX}
            onValueChange={setOriginX}
            style={{width: 200, height: 40}}
            minimumValue={0}
            maximumValue={70}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <Slider 
            value={originY}
            onValueChange={setOriginY}  
            style={{width: 200, height: 40}}
            minimumValue={0}
            maximumValue={250}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <Slider 
            value={height}
            onValueChange={setHeight}
            style={{width: 200, height: 40}}
            minimumValue={1}
            maximumValue={250}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"

          />
          {/* <Slider 
            value={width}
            onValueChange={setWidth}
            style={{width: 200, height: 40}}
            minimumValue={1}
            maximumValue={300}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"

          /> */}
          {/* <Button title={previewUrl}></Button> */}
          <Button title="Upload Photo" onPress={handlePhotoUpload} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
      backgroundColor: "rgba(0,0,0,.7)",
      height: '100vh',
      width: '100vw',
      zIndex: '10',
      position: "absolute",
      top: "-360%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      // gap: "100px"
  },
  imageMask: {
    width: "300px",
    height: "250px",
  }
})