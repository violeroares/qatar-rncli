import React from 'react';
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useNetInfo} from '@react-native-community/netinfo';
import {validateEmail} from '@helpers/helpers';
import {post} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';

const Register = ({navigation}) => {
  const netInfo = useNetInfo();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    email: '',
    password: '',
    telephone: '',
    firstName: '',
    lastName: '',
    confirm_password: '',
    check_emailInputChange: false,
    check_firstNameInputChange: false,
    check_lastNameInputChange: false,
    check_telephoneInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
    isValidPassword: true,
    isValidUser: true,
  });

  const emailInputChange = val => {
    if (val.length >= 7) {
      setData({
        ...data,
        email: val,
        check_emailInputChange: true,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_emailInputChange: false,
        isValidEmail: false,
      });
    }
  };

  const firstNameInputChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        firstName: val,
        check_firstNameInputChange: true,
      });
    } else {
      setData({
        ...data,
        firstName: val,
        check_firstNameInputChange: false,
      });
    }
  };

  const lastNameInputChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        lastName: val,
        check_lastNameInputChange: true,
      });
    } else {
      setData({
        ...data,
        lastName: val,
        check_lastNameInputChange: false,
      });
    }
  };

  const telephoneInputChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        telephone: val,
        check_telephoneInputChange: true,
      });
    } else {
      setData({
        ...data,
        telephone: val,
        check_telephoneInputChange: false,
      });
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const handleConfirmPasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: true,
      });
    } else {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirmPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  const registerHandle = async (
    firstName,
    lastName,
    telephone,
    email,
    password,
    confirmPassword,
  ) => {
    setLoading(true);
    if (!netInfo.isConnected) {
      Alert.alert('Error de Conexión', 'Comprueba tu conexión a internet.', [
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    if (firstName.length == 0) {
      Alert.alert('Error', 'Debes ingresar Nombre/s.', [{text: 'Aceptar'}]);
      setLoading(false);
      return;
    }

    if (lastName.length == 0) {
      Alert.alert('Error', 'Debes ingresar Apellido.', [{text: 'Aceptar'}]);
      setLoading(false);
      return;
    }

    if (email.length == 0) {
      Alert.alert('Error', 'Debes ingresar el Email.', [{text: 'Aceptar'}]);
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Debes ingresar un email válido.', [
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    if (telephone.length == 0) {
      Alert.alert('Error', 'Debes ingresar el Teléfono.', [{text: 'Aceptar'}]);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.', [
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    if (confirmPassword != password) {
      Alert.alert('Error', 'La contraseña y la confirmación no coinciden.', [
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    try {
      await post(apiRoutes.register, {
        UserTypeId: 1,
        Email: email,
        FirstName: firstName,
        LastName: lastName,
        Telephone: telephone,
        ImageArray: null,
        ImageBase64: null,
        Password: password,
      }).then(result => {
        setLoading(false);
        if (result.Message == 'Error 001') {
          Alert.alert(
            'Error',
            'Ya existe otro usuario con el email ingresado.',
            [{text: 'Aceptar'}],
          );
          return;
        }
        Alert.alert(
          'Registro',
          'Gracias por registrarse. Ya puedes iniciar sesión con tu cuenta.',
          [{text: 'Aceptar'}],
        );
        navigation.goBack();
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}
    behavior ={Platform.OS === 'ios' ? "padding" : 'height'}
    >
      <StatusBar backgroundColor="#05375a" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Registrate gratis!</Text>
      </View>
      <View
        //animation="fadeInUpBig"
        style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>Completa tus datos</Text>
          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="account" color="black" size={25} />
            </View>
            <TextInput
              label="Nombre/s"
              placeholder="Ingresa tu nombre"
              style={styles.textInput}
              keyboardType="default"
              autoCompleteType="name"
              autoCapitalize="none"
              onChangeText={val => firstNameInputChange(val)}
              // theme={{
              //   colors: {primary: 'black', underlineColor: 'transparent', color: "black"},
              // }}
            />
            {data.check_firstNameInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="account-outline" color="grey" size={25} />
            </View>
            <TextInput
              label="Apellido"
              placeholder="Ingresa tu apellido"
              style={styles.textInput}
              keyboardType="default"
              autoCorrect={false}
              onChangeText={val => lastNameInputChange(val)}
              theme={{
                colors: {primary: 'black', underlineColor: 'transparent'},
              }}
            />
            {data.check_lastNameInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="phone-outline" color="grey" size={25} />
            </View>
            <TextInput
              label="Teléfono"
              placeholder="Ingresa tu teléfono"
              style={styles.textInput}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCompleteType="tel"
              onChangeText={val => telephoneInputChange(val)}
              theme={{
                colors: {primary: 'black', underlineColor: 'transparent'},
              }}
            />
            {data.check_telephoneInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="email-outline" color="grey" size={25} />
            </View>
            <TextInput
              label="Email"
              placeholder="Ingresa tu Email"
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={val => emailInputChange(val)}
              theme={{
                colors: {primary: 'black', underlineColor: 'transparent'},
              }}
            />
            {data.check_emailInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="account-lock" color="black" size={25} />
            </View>
            <TextInput
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCompleteType="password"
              autoCapitalize="none"
              onChangeText={val => handlePasswordChange(val)}
              theme={{
                colors: {primary: 'black', underlineColor: 'transparent'},
              }}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="account-lock-outline" color="grey" size={25} />
            </View>
            <TextInput
              label="Confirmación de contraseña"
              placeholder="Confirma tu contraseña"
              secureTextEntry={data.confirm_secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleConfirmPasswordChange(val)}
              theme={{
                colors: {primary: 'black', underlineColor: 'transparent'},
              }}
            />
            <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
              {data.confirm_secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                registerHandle(
                  data.firstName,
                  data.lastName,
                  data.telephone,
                  data.email,
                  data.password,
                  data.confirm_password,
                );
              }}>
              <LinearGradient
                colors={['#5db8fe', '#39cff2']}
                style={styles.signIn}>
                <View style={{flexDirection: 'row'}}>
                  {loading && <ActivityIndicator color="white" />}
                  <Text
                    style={[
                      styles.textSign,
                      {
                        paddingLeft: loading ? 10 : 0,
                        color: 'white',
                      },
                    ]}>
                    {loading ? 'Cargando...' : 'Registrarse'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text
                style={{color: '#009387', textAlign: 'center', marginTop: 20}}>
                ¿Ya tienes una cuenta? Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};
export default Register;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05375a',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,

  },
  footer: {
    flex: Platform.OS === 'ios' ? 5 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    marginBottom: 10,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -20,
    paddingLeft: 10,
    color: '#05375a',
    backgroundColor: 'white',
    fontSize: 17,
    paddingLeft: -20,
  },
  button: {
    alignItems: 'center',
    marginTop: 15,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  color_textPrivate: {
    color: 'grey',
  },
});
