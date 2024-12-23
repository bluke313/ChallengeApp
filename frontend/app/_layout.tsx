import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SignUp"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Login"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="EmailVerification"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="p"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="i"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="home"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Search"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Camera"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Settings"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
        
    )
};

export default RootLayout;