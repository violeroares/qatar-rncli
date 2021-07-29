import React, { useState }  from 'react'
import { ActivityIndicator, Alert, Platform, StyleSheet, TextInput, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import * as Animatable from 'react-native-animatable';
import LinearGradient  from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useNetInfo} from "@react-native-community/netinfo";

import apiRoutes from '@services/ApiRoutes';
import { getUserByEmail, token } from '@services/ApiService';
import { AuthContext } from '@context/auth/AuthContext';
import { validateEmail } from '@helpers/helpers'

const Login = ({navigation}) => {
    const netInfo = useNetInfo();
    const {dispatch} = React.useContext(AuthContext);
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
        if( val.trim().length >= 7 ) {
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
        if( val.trim().length >= 6 ) {
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
        if( val.trim().length >= 7 ) {
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
    
    const loginHandle = async (userName, password)=>{
        //console.log(userName)
        setLoading(true)
        if(!netInfo.isConnected){
            Alert.alert('Error de Conexión', 'Comprueba tu conexión a internet.', [
                {text: 'Aceptar'}
            ]);
            setLoading(false)
            return;
        }


        if ( userName.length == 0 || password.length == 0 ) {
            Alert.alert('Inicio de sesión!', 'Debes ingresar el usuario y la contraseña.', [
                {text: 'Aceptar'}
            ]);
            setLoading(false)
            return;
        }

        if(!validateEmail(userName)) {
            Alert.alert(
              'Error',
              'Debes ingresar un email válido.',
              [{text: 'Aceptar'}],
            );
              setLoading(false);
              return;
        }   

        var data = await token(apiRoutes.getToken,{
            userName : userName,
            password : password,
            grant_type : 'password',
        })

        if(data == null)
        {
            Alert.alert('Error del servidor', 'Error conectando a los servicios, por favor intente mas tarde.', [
                {text: 'Aceptar'}
          ]);
          setLoading(false)
          return;
        }

        if(data.access_token == null)
        {
            Alert.alert('Inicio de sesión', 'Nombre de usuario o contraseña incorrectos.', [
                {text: 'Aceptar'}
          ]);
          setLoading(false)
          return;
        }

        var user = await getUserByEmail(apiRoutes.getUserByEmail,{Email : userName}, JSON.parse(JSON.stringify(data.access_token)))
        dispatch({type:'LOGIN_SUCCESS', payload:{ user: user, token: data}});
    }
   
     return (
    <View style={styles.container}>

        <StatusBar
          barStyle="light-content"
          backgroundColor='#05375a'
        />

        {/* <StatusBar backgroundColor='#05375a' barStyle="light-content"/> */}
        <View style={styles.header}>
            <Text style={styles.text_header}>Iniciar sesión</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
            }]}
        >
            <Text style={[styles.text_footer, {
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    size={20}
                />
                <TextInput 
                    placeholder="Ingresa tu Email"
                    placeholderTextColor="#666666"
                    autoCompleteType="email"
                    style={[styles.textInput, {
                        //color: colors.text
                    }]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>El email debe tener al menos 7 caracteres.</Text>
            </Animatable.View>
            }
   

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    size={20}
                />
                <TextInput 
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor="#666666"
                    autoCompleteType="password"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        //color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>La contraseña debe tener al menos 6 caracteres.</Text>
            </Animatable.View>
            }
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={{color: '#009387', marginTop:15}}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {loginHandle( data.username, data.password )}}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={['#5db8fe','#39cff2']}
                        style={styles.signIn}
                    >
                        <View style={{flexDirection: 'row'}}>
                            {loading && (<ActivityIndicator color='white' />)}
                            <Text
                                style={[styles.textSign,{
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
        </Animatable.View>
      </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#05375a',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
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
        borderBottomWidth: 1,
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
  
