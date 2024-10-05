import { dropSecret, retrieveSecret } from '../Storage.js';
import { router } from 'expo-router';
import axios from 'axios'


export const whoAmI = async (setState) => {
    try {
        const token = await retrieveSecret('authToken')
        const response = await fetch(
            'http://localhost:3000/whoami',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
            }
        );
        const responseJson = await response.json();
        
        if(response.status === 200){
            setState(responseJson.username)
        }
        else {
            dropSecret('authToken')
            router.push('/Login')
        }

    } catch (error) {
        console.error(error);
    }
}

//needs new code, current code, target username
//Should switch to returning a value rather than setting it in state directly hmmm maybe not actually
export const sendAssociationRequest = async (newCode, currentCode, targetUsername, setState) => {
    try {
        const token = await retrieveSecret('authToken')
        console.log(`Token: ${token}`)
        const response = await fetch(
            'http://localhost:3000/associationRequest',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    "code": newCode,
                    "currentCode": currentCode,
                    "pageUserName": targetUsername
                }),
            }
        );
        const responseJson = await response.json();
        setState(responseJson.friends)
        // console.log(responseJson)
    } catch (error) {
        console.error(error);
    }
}

export const photoUpload = async (photo) => {
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

    fresh()
  };