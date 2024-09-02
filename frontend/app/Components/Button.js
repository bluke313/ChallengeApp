import { StyleSheet, Text, View, Pressable, Image, Button } from "react-native";
import { colors } from "../../assets/theme";
// import userIcon from '/'

export default function IndicatorButton({children}) {
  return (
    <Pressable style={styles.buttonStyle}>
      <Text style={styles.textStyle}>{children}</Text>
    </Pressable>
  );
}

export function PrimaryButton({children, disabled, ...rest}) {
  const styles = StyleSheet.create({
    buttonStyle: {
      userSelect: "none",
      backgroundColor: colors.primary,
      opacity: disabled ? .5 : 1,
      padding: 12,
      marginTop: 4,
      marginBottom: 4,
      borderRadius: 5,
    },
    textStyle: {
      color: colors.text
    }
  })
  
  return (
    <Pressable disabled={disabled} style={styles.buttonStyle} {...rest}>
      <Text style={styles.textStyle}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    userSelect: "none",
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
