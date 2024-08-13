import { View, Text, StyleSheet, Pressable } from 'react-native';
import IndicatorButton from '../Components/Button';
import UserIcon from '../Components/Icons';
import TabSelect from '../Components/Tabs';

const Profile = () => {
    return (
        <View style={styles.mainView}>
            <View style={styles.topView}>
                <Text style={styles.title}>Profile page</Text>
                <UserIcon style={styles.userIconPosition} />
            </View>
            <View style={styles.infoView}>
                <Text style={styles.header1}>mailman</Text>
                <Text style={styles.bio}>Liam | UX/UI Designer 🎨 | Turning ideas into seamless experiences ✨ | Coffee addict ☕ | Always sketching the next big thing 🚀</Text>
                <IndicatorButton>13 Group Mates</IndicatorButton>
                <TabSelect tabItems={["Challenges", "Personal Info"]}/>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    header1: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    bio: {
        fontSize: 15,
        marginBottom: 4,
        marginTop: 4,
        maxWidth: "75%"
    },
    topView: {
        backgroundColor: '#007BFF',
        height: '25%',
        padding: 30
    },
    mainView: {
        height: "100vh",
    },
    infoView: {
        padding: 16,
    },
    userIconPosition: {
        position: "absolute",
        bottom: 0 - 44,
        right: 16 //NOTE 24 might be better
    }
});

export default Profile;