import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useNetInfo} from '@react-native-community/netinfo';
import {authPost} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';
import {validateEmail} from '@helpers/helpers';
import {useTheme} from '@react-navigation/native';

const ForgotPassword = ({navigation}) => {
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
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    if (email.length == 0) {
      Alert.alert('Error', 'Debes ingresar tu Email', [{text: 'Aceptar'}]);
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

    try {
      await authPost(apiRoutes.passwordRecovery, {
        Email: email,
      }).then(result => {
        console.log(result.Message);
        if (result.Message == 'Incorrect password.') {
          Alert.alert('Error', 'La contraseña anterior es incorrecta.', [
            {text: 'Aceptar'},
          ]);
          setLoading(false);
          return;
        }
        Alert.alert(
          'Cambio de contraseña exitoso!',
          'Se va a cerrar la sesión actual para que puedas usar tu nueva contraseña.',
          [{text: 'Aceptar'}],
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
    <View style={styles.container}>
      {/* <StatusBar backgroundColor="#05375a" barStyle="light-content" /> */}
      <StatusBar backgroundColor ={colors.background} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* <View style={styles.header}>
        <Text style={[styles.text_header, {color: colors.text}]}>Recuperar contraseña</Text>
      </View> */}
      <Animatable.View animation="fadeInUpBig" duration={550} style={[styles.footer, {backgroundColor: colors.background}]}>
        <ScrollView>
          <Text style={[styles.text_footer, {color: colors.text}]}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Ingresa tu Email"
              placeholderTextColor= '#666666'
              style={[styles.textInput, {color: colors.text}]}
              keyboardType="email-address"
              autoCompleteType="email"
              autoCapitalize="none"
              onChangeText={val => textInputChange(val)}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          <Text style={{color: 'grey', textAlign: 'center', marginTop: 50}}>
            Una clave de recuperación será enviada a tu correo electrónico.
          </Text>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                saveHandle(data.email);
              }}
              disabled={loading}>
              <LinearGradient
                colors={['#5db8fe', '#39cff2']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Recuperar Contraseña
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.signIn,
                {
                  borderColor: '#009387',
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#009387',
                  },
                ]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};
export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#05375a',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
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
    //color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    //color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
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
