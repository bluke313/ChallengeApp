import { Stack, Tabs } from 'expo-router';

const RootLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen 
                name='home'
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen 
                name='profile'
                options={{
                    headerShown: false,
                }}
            />
        </Tabs>
    )
};

export default RootLayout;