import React, {useContext, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, TextInput, Paragraph} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNetInfo} from '@react-native-community/netinfo';
import {useTheme} from '@react-navigation/native';
import CustomButton from '@components/CustomButton';
import {authPost} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';
import {AuthContext} from '@context/auth/AuthContext';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function ChangePassword({navigation, route}) {
  const {user} = route.params;
  const netInfo = useNetInfo();
  const {colors} = useTheme();
  const {state, logout, toggleTheme} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentPassword, onChangeCurrentPassword] = useState('');
  const [newPassword, onChangeNewPassowrd] = useState('');
  const [newPasswordConfirm, onChangeNewPasswordConfirm] = useState('');
  const [secureEntryCurrentPassword, setSecureEntryCurrentPassword] =
    useState(true);
    const [secureEntryNewPassword, setSecureEntryNewPassword] =
    useState(true);
    const [secureEntryPasswordConfirm, setSecureEntryPasswordConfirm] =
    useState(true);
  const saveHandle = async (currentPassword, newPassword) => {
    setLoading(true);
    if (!netInfo.isConnected) {
      Alert.alert('Error de Conexión', 'Comprueba tu conexión a internet.', [
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    if (currentPassword.length < 6) {
      Alert.alert('Error', 'Debes ingresar la contraseña actual.', [
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Error',
        'Debes ingresar la nueva contraseña (6 carácteres mínimo) .',
        [{text: 'Aceptar'}],
      );
      setLoading(false);
      return;
    }

    if (newPasswordConfirm.length < 6) {
      Alert.alert(
        'Error',
        'Debes ingresar la confirmación de la contraseña (6 carácteres mínimo).',
        [{text: 'Aceptar'}],
      );
      setLoading(false);
      return;
    }

    if (newPassword != newPasswordConfirm) {
      Alert.alert(
        'Error',
        'La nueva contraseña y la confirmación no coinciden.',
        [{text: 'Aceptar'}],
      );
      setLoading(false);
      return;
    }

    try {
      await authPost(apiRoutes.changePassword, {
        CurrentPassword: currentPassword,
        Email: user.Email,
        NewPassword: newPassword,
      }).then(result => {
        console.log(result.Message);
        if (result.Message == 'Incorrect password.') {
          Alert.alert('Error', 'La contraseña anterior es incorrecta.', [
            {text: 'Aceptar'},
          ]);
          setLoading(false);
          return;
        }
        setLoading(false);
        Alert.alert(
          'Cambio de contraseña exitoso!',
          'Por favor ingresa con la nueva contraseña.',
          [{text: 'Aceptar'}],
        );
        console.log('Cambio de contraseña exitoso');
        logout();
        toggleTheme();
        // dispatch({
        //   type: 'LOGOUT',
        //   data: {},
        // });
      });
    } catch (e) {
      Alert.alert(
        'Error del servidor',
        'Error conectando a los servicios, por favor intente mas tarde.',
        [{text: 'Aceptar'}],
      );
      //console.log(e);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={[styles.textAyuda, {backgroundColor: colors.box}]}>
          <Paragraph style={{fontWeight: 'bold'}}>Instrucciones:</Paragraph>
          <Text style={{color: colors.onSurface}}>
          1) Completa los datos para cambiar tu contraseña.
          </Text>
          <Text style={{color: colors.onSurface}}>
          2) Una vez realizado el cambio deberás cerrar la sesión e ingresar con tu
          nueva contraseña.
          </Text>
        </View>

        <View style={{marginHorizontal: 15}}>
          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="account-lock" color="#7982FF" size={25} />
            </View>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              label="Contraseña actual"
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              autoCorrect={false}
              onChangeText={onChangeCurrentPassword}
              secureTextEntry={secureEntryCurrentPassword}
              right={
                <TextInput.Icon
                  name={secureEntryCurrentPassword ? 'eye' : 'eye-off'}
                  onPress={() =>
                    setSecureEntryCurrentPassword(!secureEntryCurrentPassword)
                  }
                  forceTextInputFocus={false}
                />
              }
            />
          </View>
          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="account-lock-outline" color="#F77F74" size={25} />
            </View>
            <TextInput
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={newPassword}
              secureTextEntry={secureEntryNewPassword}
              onChangeText={onChangeNewPassowrd}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              right={
                <TextInput.Icon
                  name={secureEntryNewPassword ? 'eye' : 'eye-off'}
                  onPress={() =>
                    setSecureEntryNewPassword(!secureEntryNewPassword)
                  }
                  forceTextInputFocus={false}
                />
              }
            />
          </View>
          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon name="account-lock-outline" color="#9CD31D" size={25} />
            </View>
            <TextInput
              label="Confirmación de contraseña"
              placeholder="Confirma la contraseña"
              placeholderTextColor="#666666"
              value={newPasswordConfirm}
              onChangeText={onChangeNewPasswordConfirm}
              autoCorrect={false}
              secureTextEntry={secureEntryPasswordConfirm}
              // theme={{
              //   colors: {primary: 'black', underlineColor: 'transparent'},
              // }}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              right={
                <TextInput.Icon
                  name={secureEntryPasswordConfirm ? 'eye' : 'eye-off'}
                  onPress={() =>
                    setSecureEntryPasswordConfirm(!secureEntryPasswordConfirm)
                  }
                  forceTextInputFocus={false}
                />
              }
            />
          </View>
          {/* <CustomButton
            title="GUARDAR"
            primary
            disabled={loading}
            loading={loading}
            onPress={() => saveHandle(currentPassword, newPassword)}
          /> */}

      <View style={{marginTop: 10}}>
            <Button
                //color='#01AE9C'
                color='blue'
                mode='contained'
                //icon='account'
                disabled={loading}
                loading={loading}
                onPress={() => saveHandle(currentPassword, newPassword)}
                style={{borderRadius: 50}}
                labelStyle={{ fontSize: 17 }}
                contentStyle={{ height: 46 }}>
                Guardar
            </Button>
       </View>
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    fontSize: 17,
    paddingLeft: -20,
  },
  textAyuda: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    elevation: 3,
    marginBottom: 40,
  },
});
