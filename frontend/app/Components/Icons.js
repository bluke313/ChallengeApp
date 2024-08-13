import { StyleSheet, Text, View, Pressable, Image } from "react-native";
// import userIcon from '/'

export default function UserIcon({style}) {
    const containerStyle = {...styles.container, ...style}
  return (
    <View style={containerStyle}>
      <Image style={styles.userIconStyle} source={require("../../assets/example-user-icon.jpg")}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "inline",
    padding: 4,
    width: 88,
    borderRadius: 50,
    backgroundColor: "white",
  },
  userIconStyle: {
    width: 80,
    height: 80,
    borderRadius: 50,
  }
});
