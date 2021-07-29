import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Avatar, Button, Text, TextInput} from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNetInfo} from '@react-native-community/netinfo';
import ImageCropPicker from '@components/ImageCropPicker';
import CustomButton from '@components/CustomButton';
import {AuthContext} from '@context/auth/AuthContext';
import {validateEmail} from '@helpers/helpers';
import {Icon} from 'react-native-elements';

const ProfileEdit = ({navigation, route}) => {
//export default function ProfileEdit({navigation, route}) {
  const {user} = route.params;
  const {colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const {updateUser} = React.useContext(AuthContext);
  const sheetRef = React.createRef();
  const netInfo = useNetInfo();

  const [photoURL, setPhotoURL] = React.useState(user.ImageFullPath);
  const [loading, setLoading] = useState(false);
  const [email, onChangeEmail] = React.useState(user.Email);
  const [firstName, onChangeFirstName] = React.useState(user.FirstName);
  const [lastName, onChangeLastName] = React.useState(user.LastName);
  const [telephone, onChangeTelephone] = React.useState(user.Telephone);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imagePath, onChangeImagePath] = React.useState(user.ImagePath);


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

  const saveHandle = async (
    userId,
    userTypeId,
    email,
    firstName,
    lastName,
    telephone,
    imagePath,
    imageData,
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

    updateUser(
      userId,
      userTypeId,
      email,
      firstName,
      lastName,
      telephone,
      imagePath,
      imageData,
    );
    navigation.navigate('profile');
  };

  return (
    <KeyboardAvoidingView style={styles.container}
    behavior ={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={{margin: 15}}>
          <View style={{alignItems: 'center', marginBottom: 10}}>
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
                      ? {uri: photoURL}
                      : require('@assets/Smiley.png')
                  }
                  size={164}
                  style={{margin: 3}}
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
                {/* <Icon
                  name="camera"
                  type="material-community"
                  color="#02AE9C"
                  size={20}
                  onPress={() => {
                    openSheet();
                  }}
                /> */}
              </View>
             </TouchableOpacity>
          </View>

          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon2 name="account" color="#7982FF" size={25} />
            </View>
            <TextInput
              label="Nombres/s"
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#666666"
              autoCorrect={false}
              autoCapitalize='words'
              value={firstName}
              onChangeText={onChangeFirstName}
              // theme={{
              //    colors: {primary: 'black', underlineColor: 'transparent'},
              // }}
              autoCompleteType="name"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background ,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon2 name="account-outline" color="#F77F74" size={25} />
            </View>
            <TextInput
              label="Apellido"
              placeholder="Ingresa tu apellido"
              placeholderTextColor="#666666"
              autoCapitalize='words'
              autoCorrect={false}
              value={lastName}
              onChangeText={onChangeLastName}
              // theme={{
              //   colors: {primary: 'black', underlineColor: 'transparent'},
              // }}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.backgroundColor,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon2 name="phone-outline" color="#9CD31D" size={25} />
            </View>
            <TextInput
              label="Teléfono"
              placeholder="Ingresa tu teléfono"
              placeholderTextColor="#666666"
              keyboardType="number-pad"
              value={telephone}
              onChangeText={onChangeTelephone}
              autoCorrect={false}
              autoCompleteType="tel"
              // theme={{
              //   colors: {primary: 'black', underlineColor: 'transparent'},
              // }}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.backgroundColor,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <View
              style={{flexDirection: 'column', marginTop: 10, marginRight: 10}}>
              <Icon2 name="email-outline" color="#607E94" size={25} />
            </View>
            <TextInput
              label="Email"
              placeholder="Ingresa tu Email"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              value={email}
              onChangeText={onChangeEmail}
              autoCorrect={false}
              autoCompleteType="email"
              // theme={{
              //   colors: {primary: 'black', underlineColor: 'transparent'},
              // }}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.backgroundColor,
                },
              ]}
            />
          </View>
          <View style={styles.btnContainer}>
          <Button
              //color='#01AE9C'
              color='blue'
              mode='contained'
              //icon='account'
              disabled={loading}
              loading={loading}
              onPress={() =>
                saveHandle(
                  user.UserId,
                  user.UserTypeId,
                  email,
                  firstName,
                  lastName,
                  telephone,
                  imagePath,
                  imageData,
                )
              }
              style={{borderRadius: 50}}
              labelStyle={{ fontSize: 17 }}
              contentStyle={{ height: 46 }}>
              Guardar
          </Button>
          </View>
          {/* <CustomButton
            title="GUARDAR"
            primary
            disabled={loading}
            loading={loading}
            onPress={() =>
              saveHandle(
                user.UserId,
                user.UserTypeId,
                email,
                firstName,
                lastName,
                telephone,
                imagePath,
                imageData,
              )
            }
          /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('changePassword', {user: user})}>
            <Text
              style={{color: colors.placeholder, textAlign: 'center', marginTop: 20}}>
              Cambiar Contraseña
            </Text>
          </TouchableOpacity>
        </View>
        <ImageCropPicker onFileSelected={onFileSelected} ref={sheetRef} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ProfileEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    paddingTop: 20,
  },

  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    fontSize: 17,
    paddingLeft: -20,
  },
  dm: {
    position: 'absolute',
    top: 125,
    left: 115,
    elevation: 1,
    shadowOpacity: 0.1
  },
  btnContainer: {
    marginTop: 10
},
});
