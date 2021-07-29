import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from '@screens/Splash';
import Login from '@screens/Login4';
import Register from '@screens/Register3';
import ForgotPassword from '@screens/ForgotPassword2';

const Stack = createStackNavigator();

const AuthStack = ({ navigation }) => (
    <Stack.Navigator headerMode='float'
    >
        <Stack.Screen name="Splash" component={Splash}
            options={{
                title: "Bienvenido", //headerTitleAlign: "center",
                headerBackTitleVisible: false, headerShown: false
            }} />
        <Stack.Screen name="Login" component={Login}
            options={{
                title: "Iniciar sesión", //headerTitleAlign: "center",
                headerBackTitleVisible: false, headerShown: false
            }} />
        <Stack.Screen name="Register" component={Register}
            options={{
                title: "Registro", //headerTitleAlign: "center",
                headerBackTitleVisible: false
            }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}
                    options={{
                        title: "Recuperar Contraseña", //headerTitleAlign: "center",
                        headerBackTitleVisible: false, headerShown: true
                    }} />
    </Stack.Navigator>
);

export default AuthStack;