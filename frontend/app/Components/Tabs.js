import { useState } from "react";
import { StyleSheet, Text, View, Pressable, Image, Button } from "react-native";
// import userIcon from '/'

export default function TabSelect({tabItems, onChangeTab}) {

  const [active, setActive] = useState(0)
  

  const Tab = ({children, index, onPress}) => {
    return (
      <Pressable onPress={onPress} style={active == index ? {...styles.buttonStyle, width: `${100 / tabItems.length}%`} : {...styles.buttonStyle, backgroundColor: "rgba(0,0,0,0)", width: `${100 / tabItems.length}%`}}>
        <Text style={styles.textStyle}>{children}</Text>
      </Pressable>
    )
  }

  return (
    <View style={styles.containerStyle}>
      {tabItems.map((item, i) => <Tab key={i} index={i} onPress={() => {setActive(i); console.log(i)}}>{item}</Tab>)}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "rgba(0,0,0,.3)",
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4
  },
  buttonStyle: {
    userSelect: "none",
    padding: 0,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 50,
    backgroundColor: "white",
  },
  textStyle: {
    textAlign: "center",
    fontWeight: "bold",
  }
});

