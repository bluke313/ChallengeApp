import { dropSecret, retrieveSecret } from '../Storage.js';


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
        setState(responseJson.username)
    } catch (error) {
        console.error(error);
    }
}