import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { View, Image, Button, Platform } from 'react-native';

export default function PhotoUpload() {
    const [photo, setPhoto] = useState(null)

    const createFormData = (photo) => {
        return JSON.stringify({
            'photo': {
                "name": photo.fileName,
                "type": photo.type,
                "uri": Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
                "photo": handlePhotoUpload
            },
            "userId": 16
        })
      };

    const handleChoosePhoto = () => {
        launchImageLibrary({noData: true}, (resp) => {
            if (resp) {
                setPhoto(resp)
            }
        })
    }

    // const handlePhotoUpload = () => {
    //     fetch(`http://localhost:3000/upload`, {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'multipart/form-data',
    //             'Content-Type': 'multipart/form-data',
    //         },
    //         "MIME-Version": "1.0",
    //         body: createFormData(photo),
    //       })
    //         .then((response) => response.json())
    //         .then((response) => {
    //           console.log('response', response);
    //         })
    //         .catch((error) => {
    //           console.log('error', error);
    //         });
    // }

    const handlePhotoUpload = async () => {
        if (photo) {
          const formData = new FormData();
          formData.append('photo', {
            uri: photo.uri,
            name: photo.fileName || 'photo.jpg', // Default to 'photo.jpg' if filename is not provided
            type: photo.type || 'image/jpeg', // Default to 'image/jpeg' if type is not provided
          });
    
          try {
            const response = await fetch('http://localhost:3000/upload', {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
    
            const result = await response.json();
            console.log('Success:', result);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      };
    

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <input type='file' onChange={(e) => setPhoto(e.target.files[0])}></input>
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