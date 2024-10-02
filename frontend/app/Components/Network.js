import { dropSecret, retrieveSecret } from '../Storage.js';
import { router } from 'expo-router';


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