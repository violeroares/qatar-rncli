import React, { useState } from 'react'
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from 'react-native'
//import { Button } from 'react-native-elements/dist/buttons/Button'
import { useNetInfo } from "@react-native-community/netinfo";
import { Button, Headline, Text, TextInput } from 'react-native-paper'
import apiRoutes from '@services/ApiRoutes';
import { getUserByEmail, token } from '@services/ApiService';
import { validateEmail } from '@helpers/helpers'
import { AuthContext } from '@context/auth/AuthContext';
import { useTheme } from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Login({ navigation }) {
    const { colors } = useTheme();
    const netInfo = useNetInfo();
    const isDarkMode = useColorScheme() === 'dark';
    const { dispatch } = React.useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const textInputChange = (val) => {
        if (val.trim().length >= 7) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const loginHandle = async (userName, password) => {
        //console.log(userName)
        setLoading(true)
        if (!netInfo.isConnected) {
            Alert.alert('Error de Conexión', 'Comprueba tu conexión a internet.', [
                { text: 'Aceptar' }
            ]);
            setLoading(false)
            return;
        }


        if (userName.length == 0 || password.length == 0) {
            Alert.alert('Inicio de sesión!', 'Debes ingresar el usuario y la contraseña.', [
                { text: 'Aceptar' }
            ]);
            setLoading(false)
            return;
        }

        if (!validateEmail(userName)) {
            Alert.alert(
                'Error',
                'Debes ingresar un email válido.',
                [{ text: 'Aceptar' }],
            );
            setLoading(false);
            return;
        }

        var data = await token(apiRoutes.getToken, {
            userName: userName,
            password: password,
            grant_type: 'password',
        })

        if (data == null) {
            Alert.alert('Error del servidor', 'Error conectando a los servicios, por favor intente mas tarde.', [
                { text: 'Aceptar' }
            ]);
            setLoading(false)
            return;
        }

        if (data.access_token == null) {
            Alert.alert('Inicio de sesión', 'Nombre de usuario o contraseña incorrectos.', [
                { text: 'Aceptar' }
            ]);
            setLoading(false)
            return;
        }

        var user = await getUserByEmail(apiRoutes.getUserByEmail, { Email: userName }, JSON.parse(JSON.stringify(data.access_token)))
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: user, token: data } });
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar backgroundColor={isDarkMode ? colors.background : 'white'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Headline style={styles.header}>Bienvenido!</Headline>
                    <View style={styles.action}>
                        <View style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                            <Icon2 name="email-outline" color='#FFA744' size={25} />
                        </View>
                        <TextInput
                            label='Email'
                            placeholder='Ingresa tu email'
                            autoCapitalize='none'
                            keyboardType='email-address'
                            autoCompleteType='username'
                            onChangeText={(val) => textInputChange(val)}
                            style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                        />
                    </View>
                    <View style={styles.action}>
                        <View
                            style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                            <Icon2 name="lock" color="#F77F74" size={25} />
                        </View>
                        <TextInput
                            label='Contraseña'
                            placeholder='Ingresa tu contraseña'
                            autoCompleteType='password'
                            keyboardType='default'
                            style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                            autoCorrect={false}
                            secureTextEntry={data.secureTextEntry ? true : false}
                            onChangeText={(val) => handlePasswordChange(val)}
                            right={
                                <TextInput.Icon
                                    name={data.secureTextEntry ? 'eye' : 'eye-off'}
                                    onPress={updateSecureTextEntry}
                                    forceTextInputFocus={false}
                                    color={colors.text}
                                />
                            }
                        />
                    </View>


                    <View style={styles.forgotContainer}>
                        <Button
                            label='Iniciar sesión'
                            color={colors.placeholder}
                            onPress={() => navigation.navigate('ForgotPassword')}
                            labelStyle={{ fontSize: 10, textAlign: 'right' }}>
                            ¿Olividaste tu contraseña?
                        </Button>
                    </View>

                    <View style={styles.btnContainer}>
                        <Button
                            label='Iniciar sesión'
                            color='blue'
                            mode='contained'
                            icon='login'
                            disabled={loading}
                            loading={loading}
                            onPress={() => { loginHandle(data.username, data.password) }}
                            style={{borderRadius: 50}}
                            labelStyle={{ fontSize: 16 }}
                            contentStyle={{ height: 46 }}>
                            Iniciar sesión
                        </Button>
                    </View>

                    <View style={styles.registerContainer}>
                        <Button
                            label='Iniciar sesión'
                            color={colors.placeholder}
                            onPress={() => navigation.navigate('Register')}
                            labelStyle={{ fontSize: 10 }}
                            style={{ alignSelf: 'center' }}>
                            ¿No tienes unas cuenta? <Text style={{ fontWeight: 'bold', fontSize: 10 }}> Registrarse</Text>
                        </Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: 'center'
    },
    header: {
        fontSize: 34,
        marginBottom: 8
    },
    textInput: {
        //marginTop: 30,
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        fontSize: 17,
        paddingLeft: -20,
    },
    btnContainer: {
        marginTop: 30
    },
    registerContainer: {
        marginTop: 10,
    },
    forgotContainer: {
        marginTop: 5,
        alignSelf: 'flex-end'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 5,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
})
