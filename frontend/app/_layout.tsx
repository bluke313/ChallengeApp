import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Home Page",
                    headerStyle: {
                        backgroundColor: "blue"
                    },
                }}
            />
            <Stack.Screen
                name="Login"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='SignUp'
                options={{
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name="home"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
};

export default RootLayout;