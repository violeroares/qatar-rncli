import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
  StatusBar,
  View
} from 'react-native';

import { Button, Caption, TextInput } from 'react-native-paper'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNetInfo } from '@react-native-community/netinfo';
import { authPost } from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';
import { validateEmail } from '@helpers/helpers';
import { useTheme } from '@react-navigation/native';

export default function ForgotPassowrd() {
  const { colors } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState({
    email: '',
    check_textInputChange: false,
  });

  const textInputChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const saveHandle = async email => {
    setLoading(true);
    if (!netInfo.isConnected) {
      Alert.alert('Error de Conexión', 'Comprueba tu conexión a internet.', [
        { text: 'Aceptar' },
      ]);
      setLoading(false);
      return;
    }

    if (email.length == 0) {
      Alert.alert('Error', 'Debes ingresar tu Email', [{ text: 'Aceptar' }]);
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Debes ingresar un email válido.', [
        { text: 'Aceptar' },
      ]);
      setLoading(false);
      return;
    }

    try {
      await authPost(apiRoutes.passwordRecovery, {
        Email: email,
      }).then(result => {
        console.log(result.Message);
        if (result.Message == 'Incorrect password.') {
          Alert.alert('Error', 'La contraseña anterior es incorrecta.', [
            { text: 'Aceptar' },
          ]);
          setLoading(false);
          return;
        }
        Alert.alert(
          'Cambio de contraseña exitoso!',
          'Se va a cerrar la sesión actual para que puedas usar tu nueva contraseña.',
          [{ text: 'Aceptar' }],
        );
        console.log('Cambio de contraseña exitoso');
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <StatusBar backgroundColor={isDarkMode ? colors.background : 'white'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.inner}>
        {/* <Text style={styles.header}>Bienvenido!</Text> */}
        <View style={styles.action}>
          <View
            style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
            <Icon2 name="email-outline" color='#FFA744' size={25} />

          </View>
          <TextInput
            label='Email'
            placeholder='Ingresa tu email'
            autoCapitalize='none'
            keyboardType='email-address'
            autoCompleteType='username'
            onChangeText={(val) => textInputChange(val)}
            style={[styles.textInput, { backgroundColor: colors.background }]}
          />
        </View>
        <Caption style={{ textAlign: 'center', marginTop: 30 }}>Una clave de recuperacíon sera enviada a tu correo electrónico.</Caption>

        <View style={styles.btnContainer}>
          <Button
            color='blue'
            mode='contained'
            icon='lock'
            disabled={loading}
            loading={loading}
            onPress={() => { saveHandle(data.email); }}
            style={{borderRadius: 50}}
            labelStyle={{ fontSize: 16 }}
            contentStyle={{ height: 46 }}>
            Recuperar Contraseña
          </Button>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    //flex: 1,
    justifyContent: 'center'
  },
  header: {
    fontSize: 36,
    marginBottom: 8
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
})
