import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { colors } from "../../assets/theme";
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
// import userIcon from '/'

export default function IndicatorButton({ children }) {
  return (
    <Pressable style={styles.buttonStyle}>
      <Text style={styles.textStyle}>{children}</Text>
    </Pressable>
  );
}

export function PrimaryButton({ children, disabled, ...rest }) {
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



export const Tabs = ({ handleHome, handleProfile, currentPage }) => {
  const [isHoveredHome, setIsHoveredHome] = useState(false);
  const [isHoveredPic, setIsHoveredPic] = useState(false);
  const [isHoveredProfile, setIsHoveredProfile] = useState(false);

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
      backgroundColor: colors.secondary,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginHorizontal: 5,
      width: 100,
    },
    currentTabsButton: {
      backgroundColor: colors.secondary,
      padding: 9,
      borderRadius: 5,
      alignItems: 'center',
      marginHorizontal: 5,
      width: 100,
      borderWidth: 1,
      borderColor: 'white',
    },
    hoveredTabsButton: {
      backgroundColor: '#16633d',
      padding: 9,
      borderRadius: 5,
      alignItems: 'center',
      marginHorizontal: 5,
      width: 100,
      borderWidth: 1,
      borderColor: 'white',
    },
    tabs: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: colors.accent,
    }
  });

  return (
    <View style={styles.tabs}>
      <Pressable
        onHoverIn={() => setIsHoveredHome(true)}
        onHoverOut={() => setIsHoveredHome(false)}
        style={currentPage == 0
          ? styles.hoveredTabsButton
          : (isHoveredHome ? styles.hoveredTabsButton : styles.tabsButton) }
        onPress={handleHome}>
        <Text style={styles.buttonText}>{`\u{1F3E0}`}</Text>
      </Pressable>

      <Pressable
        onHoverIn={() => setIsHoveredPic(true)}
        onHoverOut={() => setIsHoveredPic(false)}
        style={currentPage == 1
          ? styles.hoveredTabsButton
          : (isHoveredPic ? styles.hoveredTabsButton : styles.tabsButton) }
        onPress={() => router.push('/Camera')}>
        <Text style={styles.buttonText}>{"camera"}</Text>
      </Pressable>

      <Pressable
        onHoverIn={() => setIsHoveredProfile(true)}
        onHoverOut={() => setIsHoveredProfile(false)}
        style={currentPage == 2
          ? styles.hoveredTabsButton
          : (isHoveredProfile ? styles.hoveredTabsButton : styles.tabsButton) }
        onPress={handleProfile}>
        <Text style={styles.buttonText}>{`\u{1F9D1}`}</Text>
      </Pressable>
    </View>
  )
};


export const Button = ({ style, text, disabled, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.secondary,
      padding: 10,
      alignItems: 'center',
      borderRadius: 5,
      margin: 5,
      // flexGrow: 1
    },
    hoveredButton: {
      backgroundColor: '#16633d',
      padding: 9,
      alignItems: 'center',
      borderRadius: 5,
      margin: 5,
      borderWidth: 1,
      borderColor: 'white',
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
  });

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      disabled={disabled}
      style={disabled ? { ...styles.disabledButton, ...style } : (isHovered ? { ...styles.hoveredButton, ...style } : { ...styles.button, ...style })} {...rest}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  )
};
