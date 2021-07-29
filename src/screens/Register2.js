import React, { useState } from 'react';
import {
  Alert, Dimensions, View, TouchableOpacity,
  StatusBar, StyleSheet, ScrollView, useColorScheme,
  KeyboardAvoidingView
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNetInfo } from "@react-native-community/netinfo";
import { Avatar, Text } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import FormInput from '../components/FormInput';
import { validateEmail } from '@helpers/helpers';
import { post } from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';
import ImageCropPicker from '@components/ImageCropPicker';
import LinearGradient from 'react-native-linear-gradient';

const Register = ({ navigation }) => {
  const netInfo = useNetInfo();
  const { colors } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const sheetRef = React.createRef();
  const [photoURL, setPhotoURL] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
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

  const onFileSelected = image => {
    closeSheet();
    if (image) {
      console.log(image)
      setImageData(image.data);
      setImageLoaded(true);
      setPhotoURL(image.path);
    }
  };

  const closeSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
  };
  const openSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.open();
    }
  };

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
    imagePath,
    imageData,
  ) => {
    setLoading(true);
    if (!netInfo.isConnected) {
      Alert.alert('Error de Conexión', 'Comprueba tu conexión a internet.', [
        { text: 'Aceptar' },
      ]);
      setLoading(false);
      return;
    }

    if (firstName.length == 0) {
      Alert.alert('Error', 'Debes ingresar Nombre/s.', [{ text: 'Aceptar' }]);
      setLoading(false);
      return;
    }

    if (lastName.length == 0) {
      Alert.alert('Error', 'Debes ingresar Apellido.', [{ text: 'Aceptar' }]);
      setLoading(false);
      return;
    }

    if (email.length == 0) {
      Alert.alert('Error', 'Debes ingresar el Email.', [{ text: 'Aceptar' }]);
      setLoading(false);
      return;
    }
    console.log(email)
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Debes ingresar un email válido.', [
        { text: 'Aceptar' },
      ]);
      setLoading(false);
      return;
    }

    if (telephone.length == 0) {
      Alert.alert('Error', 'Debes ingresar el Teléfono.', [{ text: 'Aceptar' }]);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.', [
        { text: 'Aceptar' },
      ]);
      setLoading(false);
      return;
    }

    if (confirmPassword != password) {
      Alert.alert('Error', 'La contraseña y la confirmación no coinciden.', [
        { text: 'Aceptar' },
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
        ImagePath: imagePath,
        ImageArray: null,
        ImageBase64: imageData,
        Password: password,
      }).then(result => {
        setLoading(false);
        if (result.Message == 'Error 001') {
          Alert.alert(
            'Error',
            'Ya existe otro usuario con el email ingresado.',
            [{ text: 'Aceptar' }],
          );
          return;
        }
        Alert.alert(
          'Registro',
          'Gracias por registrarse. Ya puedes iniciar sesión con tu cuenta.',
          [{ text: 'Aceptar' }],
        );
        navigation.goBack();
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };


  return (
    // <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: isDarkMode ? colors.background : 'white' }]}
      behavior={Platform.OS === 'ios' ? "padding" : 'height'}
    >
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <View style={{ margin: 15 }}>
          {/* <Image
          source={require('../assets/QatarLogo1.png')}
          style={styles.logo}
        /> */}
          {/* <Text style={styles.text}>Registro</Text> */}

          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => {
                openSheet();
              }}>
              <View
                style={{
                  borderWidth: 3,
                  borderRadius: 161,
                  borderColor: '#02AE9C',
                }}>
                <Avatar.Image
                  source={
                    photoURL && photoURL != 'no_image'
                      ? { uri: photoURL }
                      : require('@assets/Smiley.png')
                  }
                  size={144}
                  style={{ margin: 3 }}
                />
              </View>
              <View style={styles.dm}>
                {isDarkMode
                  ? <Icon
                    name="camera"
                    type="material-community"
                    color="#02AE9C"
                    reverse
                    size={20}
                    onPress={() => {
                      openSheet();
                    }}
                  />
                  :
                  <Icon
                    name="camera"
                    type="material-community"
                    color="black"
                    raised
                    size={20}
                    onPress={() => {
                      openSheet();
                    }}
                  />
                }
              </View>
            </TouchableOpacity>
          </View>


          <FormInput
            keyboardType="default"
            autoCompleteType="name"
            autoCapitalize='words'
            textContentType='name'
            onChangeText={val => firstNameInputChange(val)}
            placeholderText="Nombre"
            iconType="user"
            autoCorrect={false}
            borderColor={colors.border}
            backgroundColor={colors.card}
            iconColor={colors.text}
            style={[styles.formInput, { color: colors.text }]}
          />

          <FormInput
            style={styles.textInput}
            keyboardType="default"
            autoCorrect={false}
            onChangeText={val => lastNameInputChange(val)}
            placeholderText="Apellido"
            iconType="user"
            autoCapitalize='words'
            borderColor={colors.border}
            backgroundColor={colors.card}
            iconColor={colors.text}
            style={[styles.formInput, { color: colors.text }]}
          />
          <FormInput
            style={styles.textInput}
            keyboardType="phone-pad"
            autoCorrect={false}
            onChangeText={val => telephoneInputChange(val)}
            placeholderText="Teléfono"
            iconType="phone"
            autoCapitalize="none"
            borderColor={colors.border}
            backgroundColor={colors.card}
            iconColor={colors.text}
            style={[styles.formInput, { color: colors.text }]}
          />

          <FormInput
            style={styles.textInput}
            keyboardType="email-address"
            autoCorrect={false}
            onChangeText={val => emailInputChange(val)}
            placeholderText="Email"
            iconType="mail"
            autoCapitalize="none"
            borderColor={colors.border}
            backgroundColor={colors.card}
            iconColor={colors.text}
            style={[styles.formInput, { color: colors.text }]}
          />


          <FormInput
            placeholderText="Contraseña"
            iconType="lock"
            autoCorrect={false}
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={val => handlePasswordChange(val)}
            borderColor={colors.border}
            backgroundColor={colors.card}
            iconColor={colors.text}
            autoCompleteType='password'
            style={[styles.formInput, { color: colors.text }]}
          />
          <FormInput
            placeholderText="Confirmación de contraseña"
            iconType="lock"
            autoCorrect={false}
            secureTextEntry={data.confirm_secureTextEntry ? true : false}
            onChangeText={val => handleConfirmPasswordChange(val)}
            borderColor={colors.border}
            backgroundColor={colors.card}
            iconColor={colors.text}
            style={[styles.formInput, { color: colors.text }]}
          />

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
                photoURL,
                imageData,
              );
            }}
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
                  {loading ? 'Cargando...' : "Registrarse"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <ImageCropPicker onFileSelected={onFileSelected} ref={sheetRef} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
};

export default Register;
const { height } = Dimensions.get('screen');
const height_logo = height * 0.50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: 'grey',
    marginTop: 0
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'grey',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
  },
  dm: {
    position: 'absolute',
    top: 110,
    left: 95,
    elevation: 1,
    shadowOpacity: 0.1
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  formInput: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
