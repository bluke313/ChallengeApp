import { Stack } from 'expo-router';

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="[challengeId]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
};

export default RootLayout;