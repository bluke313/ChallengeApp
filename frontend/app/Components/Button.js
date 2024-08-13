import { StyleSheet, Text, View, Pressable, Image, Button } from "react-native";
// import userIcon from '/'

export default function IndicatorButton({children}) {
  return (
    <Pressable style={styles.buttonStyle}>
      <Text style={styles.textStyle}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 8,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 5,
    border: "solid rgba(0,0,0,.3) 1px",
    alignSelf: "flex-start",
  },
  textStyle: {
    alignSelf: "flex-start"
  }
});
