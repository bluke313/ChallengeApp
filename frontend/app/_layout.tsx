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
                    headerTitle: "Login page",
                    headerStyle: {
                        backgroundColor: "green"
                    },
                }}
            />
            <Stack.Screen
                name="SignUp"
                options={{
                    headerTitle: "Sign Up page",
                    headerStyle: {
                        backgroundColor: "yellow"
                    },
                }}
            />
        </Stack>
    )
};

export default RootLayout;