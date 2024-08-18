import * as SecureStore from 'expo-secure-store'
import {Platform} from 'react-native'

export async function storeSecret(key, value){
    if(Platform.OS == 'web'){
        try {
            localStorage.setItem(key, value)
        }
        catch (e){
            console.log(e)
            return false
        }
    }
    else {
        try {
            await SecureStore.setItemAsync(key, value)
        }
        catch (e){
            console.log(e)
            return false
        }
    }
    return true
}

export async function retrieveSecret(key){
    if(Platform.OS == 'web'){
        try {
            const token = localStorage.getItem(key)
            return token
        }
        catch (e){
            console.log(e)
            return null
        }
    }
    try {
        const token = await SecureStore.getItemAsync(key)
        return token
    }
    catch (e){
        console.log(e)
        return null
    }
}

export async function dropSecret(key){
    if(Platform.OS == 'web'){
        try {
            localStorage.removeItem(key)
        }
        catch (e){
            console.log(e)
            return false
        }
    }
    else {
        try {
            await SecureStore.deleteItemAsync(key)
        }
        catch (e){
            console.log(e)
            return false
        }
    }
    return true
}