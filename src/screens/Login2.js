import React, { useState } from 'react'
import {
    ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView,
    Platform, StyleSheet, TouchableOpacity, View,
    StatusBar, ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNetInfo } from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import apiRoutes from '@services/ApiRoutes';
import { getUserByEmail, token } from '@services/ApiService';
import { AuthContext } from '@context/auth/AuthContext';
import { validateEmail } from '@helpers/helpers'
import { Text, TextInput } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

export default function Login({ navigation }) {
    const { colors } = useTheme();
    const netInfo = useNetInfo();
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

    const handleValidUser = (val) => {
        if (val.trim().length >= 7) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
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
        <View style={[styles.container, {
            backgroundColor: colors.authScreensColor

        }]}>
            <KeyboardAvoidingView style={[styles.container]} behavior='padding'>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.authScreensColor}
                //backgroundColor='#05375a'
                //backgroundColor='#1A558D'
                />
                <View style={styles.header}>
                    <Animatable.Image
                        animation="fadeIn"
                        duration={3550}
                        source={require('@assets/LogoQ.png')}
                        style={styles.logo}
                        resizeMode="cover"
                    />
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={[styles.footer, {
                        backgroundColor: colors.card
                    }]}
                >
                    <ScrollView>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: colors.placeholder, marginLeft: 15 }}>Bienvenido!</Text>


                        <View style={{ marginHorizontal: 15 }}>
                            <View style={styles.action}>
                                <View
                                    style={{ flexDirection: 'column', marginTop: 20, marginRight: 10 }}>
                                    {/* <Icon name="account-lock" color="#7982FF" size={25} /> */}
                                    {/* <FontAwesome name="user-o" color={colors.text} size={25} /> */}
                                    <Icon name="email-outline" color={colors.text} size={25} />
                                </View>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        {
                                            color: colors.text,
                                            backgroundColor: colors.card,
                                        },
                                    ]}
                                    label="Email"
                                    placeholder="Ingresa tu email"
                                    placeholderTextColor={colors.placeholder}
                                    autoCorrect={false}
                                    onChangeText={(val) => textInputChange(val)}
                                    onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                                    autoCompleteType='email'
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                //   right={
                                //     <TextInput.Icon
                                //       name={secureEntryCurrentPassword ? 'eye' : 'eye-off'}
                                //       onPress={() =>
                                //         setSecureEntryCurrentPassword(!secureEntryCurrentPassword)
                                //       }
                                //       forceTextInputFocus={false}
                                //     />
                                //   }
                                />
                            </View>

                            <View style={styles.action}>
                                <View
                                    style={{ flexDirection: 'column', marginTop: 20, marginRight: 10 }}>
                                    {/* <Icon name="account-lock-outline" color="#F77F74" size={25} /> */}
                                    <Feather name="lock" color={colors.text} size={25} />
                                </View>
                                <TextInput
                                    label="Contraseña"
                                    placeholder="Ingresa tu contraseña"
                                    placeholderTextColor={colors.placeholder}
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntry ? true : false}
                                    onChangeText={(val) => handlePasswordChange(val)}

                                    style={[
                                        styles.textInput,
                                        {
                                            color: colors.text,
                                            backgroundColor: colors.card,
                                        },
                                    ]}
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

                            <View style={styles.button}>
                                <TouchableOpacity
                                    style={styles.signIn}
                                    onPress={() => { loginHandle(data.username, data.password) }}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={['#5db8fe', '#39cff2']}
                                        style={styles.signIn}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            {loading && (<ActivityIndicator color='white' />)}
                                            <Text
                                                style={[styles.textSign, {
                                                    paddingLeft: loading ? 10 : 0, color: 'white'
                                                }]}>
                                                {loading ? 'Cargando...' : "Iniciar Sesión"}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Register')}
                                    style={[styles.signIn, {
                                        borderColor: '#009387',
                                        borderWidth: 1,
                                        marginTop: 15
                                    }]}
                                >
                                    <Text style={[styles.textSign, {
                                        color: '#009387'
                                    }]}>Registrarse Gratis</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={{ color: '#009387', marginTop: 25, textAlign: 'center' }}>¿Olvidaste tu contraseña?</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animatable.View>
            </KeyboardAvoidingView>
        </View>
    )
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.25;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: height_logo,
        height: height_logo,
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 4,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 5,
        paddingVertical: 30
    },
    text_header: {
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
