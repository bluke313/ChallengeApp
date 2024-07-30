import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import Login from './Login.js';
import SignUp from './SignUp.js'

export default function App() {
  
  const [login, setLogin] = useState('Empty');

  function handleLogin(name) {
    console.log("step 2");
    setLogin(name);
  }

  

  return (
    <View style={styles.container}>
      {/* {login === 'Empty' ? <Login handleLogin={handleLogin}></Login> : <SignUp></SignUp>} */}
      <SignUp handleLogin={handleLogin}></SignUp>
      <Text>{login}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
