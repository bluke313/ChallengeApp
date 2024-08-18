import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { View, Image, Button, Platform } from 'react-native';
import axios from 'axios';
import retrieveSecret from '../Storage.js'

export default function PhotoUpload({username}) {
    const [photo, setPhoto] = useState(null)

    const handleChoosePhoto = () => {
        launchImageLibrary({noData: true}, (resp) => {
            if (resp) {
                setPhoto(resp)
            }
        })
    }

    const handlePhotoUpload = async () => {
        const data = new FormData() //creates binary to transfer photo
        data.append('file', photo) //adds photo to the binary
        data.append('body', JSON.stringify({
          "caption": "Hey this is my photo",
          // "token": `${retrieveSecret('authToken')}`,
          "username": username
        }))

        axios.post('http://localhost:3000/upload', data) //sends photo the backend
          .then((res) => {
            console.log(res)
          })
      };
    

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <input type='file' name='file' onChange={(e) => setPhoto(e.target.files[0])}></input>
          {photo && (
            <>
              <Image
                source={{ uri: photo.uri }}
                style={{ width: 300, height: 300 }}
              />
              <Button title="Upload Photo" onPress={handlePhotoUpload} />
            </>
          )}
          <Button title="Choose Photo" onPress={handleChoosePhoto} />
        </View>
      );
}