import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';

const FeedImage = ({ image }) => {

    return (
        <View style={styles.container}>
            <Text>This is a FeedImage</Text>
            <Image
                style={styles.image}
                source={{
                    uri: `http://localhost:3000/${image.path}`,
                }}
            />
            <Text style={styles.caption}>{image.caption == null ? null : image.caption}</Text>
            <Text style={styles.timestamp}>Uploaded {image.timestamp}</Text>
        </View>
    )
};

export const Feed = ({ user }) => {
    const [feedData, setFeedData] = useState(null);

    const fetchFeed = async () => {
        try {
            const response = await fetch(
                'http://localhost:3000/feed',
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'content-Type': 'application/json',
                    },
                }
            );
            const responseJson = await response.json();
            setFeedData(responseJson);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetchFeed() }, []);

    return (
        <View>
            {feedData == null ? null : feedData.map( (data, i) =>  <FeedImage key={i} image={data} />)}
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: "100px"
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        minWidth: 100,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: 350,
        height: 400,
        borderWidth: 2,
        borderColor: '#007BFF',
        backgroundColor: 'white',
    },
    caption: {
        fontFamily: 'sans-serif',
        marginTop: 3,
    },
    timestamp: {
        fontFamily: 'sans-serif',
        marginBottom: 3,
    },
});