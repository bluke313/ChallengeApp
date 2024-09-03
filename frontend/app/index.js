import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Button } from '@components/Button.js';

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={{color: '#8bdbb3', fontSize: 50 }}>Primary</Text>
        <Text style={{color: '#1f8a55', fontSize: 50 }}>Secondary</Text>
        <Text style={{color: '#38c880', fontSize: 50 }}>Accent</Text>
        <Text style={styles.title}>Challenge App</Text>
        <Text style={styles.subtitle}>Dev navigation page</Text>
        <Button onPress={() => router.push("/Login")} text='Login'/>
        <Button onPress={() => router.push("/SignUp")} text='SignUp'/>
        <Button onPress={() => router.push("/home")} text='Home'/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: '#030806',
    color: 'white'
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    color: '#fff',
  },
  subtitle: {
    fontSize: 36,
    color: '#fff',
  },
});
