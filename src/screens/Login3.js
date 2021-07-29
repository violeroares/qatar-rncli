import React, { useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { useNetInfo } from "@react-native-community/netinfo";
import CustomButton from '../components/CustomButton';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton'
import apiRoutes from '@services/ApiRoutes';
import { getUserByEmail, token } from '@services/ApiService';
import { AuthContext } from '@context/auth/AuthContext';
import { validateEmail } from '@helpers/helpers'
import { colors } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

export default function Login({ navigation }) {
  const netInfo = useNetInfo();
  const { colors } = useTheme();
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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : 'white',
  };

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <StatusBar backgroundColor={isDarkMode ? Colors.darker : 'white'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/QatarLogo2.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Bienvenido!</Text>

        <FormInput
          style={styles.textInput}
          keyboardType="email-address"
          autoCorrect={false}
          onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
          onChangeText={(val) => textInputChange(val)}
          placeholderText="Email"
          iconType="mail"
          autoCapitalize="none"
          borderColor={colors.border}
          backgroundColor={colors.card}
          iconColor={colors.text}
          style={{
            padding: 10,
            flex: 1,
            fontSize: 16,
            //fontFamily: 'Lato-Regular',
            color: colors.text,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        {/* <FormInput
        //labelValue={password}
        placeholderText="Ingresa tu contraseña"
        iconType="lock"
        autoCorrect={false}
        secureTextEntry={data.secureTextEntry ? true : false}
        onChangeText={(val) => handlePasswordChange(val)}
      /> */}
        <FormInput
          //labelValue={password}
          placeholderText="Ingresa tu contraseña"
          iconType="lock"
          autoCorrect={false}
          secureTextEntry={data.secureTextEntry ? true : false}
          onChangeText={(val) => handlePasswordChange(val)}
          borderColor={colors.border}
          backgroundColor={colors.card}
          iconColor={colors.text}
          style={{
            padding: 10,
            flex: 1,
            fontSize: 16,
            //fontFamily: 'Lato-Regular',
            color: colors.text,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        <CustomButton
          title="INICIAR SESIÓN"
          primary
          disabled={loading}
          loading={loading}
          onPress={() => { loginHandle(data.username, data.password) }}
          style={{
            marginTop: 10,
            width: '100%',
            height: height / 15,
            backgroundColor: '#2e64e5',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
        />

        <CustomButton
          title="REGISTRARSE GRATIS"
          secondary
          //disabled={loading}
          //loading={loading}
          onPress={() => navigation.navigate('Register')}
          style={{
            marginTop: 10,
            width: '100%',
            height: height / 15,
            //backgroundColor: '#55BF99',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
        />
        {/* <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.navButtonText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{ color: '#ED8062', marginTop: 15 }}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.50;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    //fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    marginTop: 55,
    fontWeight: '500',
    color: 'grey',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'grey',
    //fontFamily: 'Lato-Regular',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
