import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Challenge App</Text>
        <Text style={styles.subtitle}>Dev navigation page</Text>
        <Pressable style={styles.button} onPress={() => router.push("/Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/SignUp")}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.push("/dev/home")}>
          <Text style={styles.buttonText}>home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
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
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
}
});
