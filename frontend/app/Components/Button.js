import { StyleSheet, Text, View, Pressable, Image } from "react-native";
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
},
tabsButton: {
    backgroundColor: '#1f8a55',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    width: 100,
},
tabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#38c880',
}
});

export const Tabs = ({ handleHome, handleProfile }) => {
  return (
      <View style={styles.tabs}>
          <Pressable style={styles.tabsButton} onPress={handleHome}>
              <Text style={styles.buttonText}>{`\u{1F3E0}`}</Text>
          </Pressable>

          <Pressable style={styles.tabsButton} onPress={handleProfile}>
              <Text style={styles.buttonText}>{`\u{1F9D1}`}</Text>
          </Pressable>
      </View>
  )
};


export const Button = ({ text, disabled, ...rest }) => {
  const styles = StyleSheet.create({
      button: {
          backgroundColor: colors.secondary,
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
          margin: 5,
      },
      disabledButton: {
          backgroundColor: colors.secondary,
          opacity: .5,
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
          margin: 5,
      },
      buttonText: {
          color: colors.text,
          fontSize: 16,
      }
  })
  
  return (
      <Pressable style={disabled ? styles.disabledButton : styles.button} {...rest}>
          <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
  )
};
