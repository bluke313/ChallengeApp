import { Stack, Tabs } from 'expo-router';

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
};

export default RootLayout;