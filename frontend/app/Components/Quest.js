import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { fetchChallenge } from '@components/Network.js';
import { colors } from '@assets/theme.js';
import { Icon } from 'react-native-elements';

export const DailyQuestDisplay = ({setParentQuest = (s) => null}) => {
    const [activeQuest, setActiveQuest] = useState(null)
    const [minimized, setMinimized] = useState(false)

    useEffect(() => {fetchChallenge((state) => {setActiveQuest(state); setParentQuest(state)})}, [])

    const styles = StyleSheet.create({
        questView: {
            backgroundColor: colors.secondary,
            marginTop: 16,
            marginBottom: 16,
            padding: 16,
            borderRadius: "5px",
            position: "relative"
        },
        name: {
            fontSize: 24,
            marginBottom: 16,
            color: colors.text,
        },
        desc: {
            fontSize: 16,
            color: colors.text
        },
        collapseIcon: {
            position: "absolute",
            top: 18,
            right: 18
        }
    });

    if(minimized){
        return (
            <View style={styles.questView}>
                <Text style={{...styles.name, marginBottom: 0}}>{activeQuest?.name}</Text>
                <Pressable style={styles.collapseIcon} onPress={() => setMinimized(!minimized)}>
                    <Icon name='plus' type='material-community' color={"white"} />
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.questView}>
            <Text style={styles.name}>{activeQuest?.name}</Text>
            <Text style={styles.desc}>{"In today's quest your goal should be to spread joy to an old friend. However you do this just snap a pic of it and give it a share!"}</Text>
            <Pressable style={styles.collapseIcon} onPress={() => setMinimized(!minimized)}>
                <Icon name='minus' type='material-community' color={"white"} />
            </Pressable>
        </View>
    )
}