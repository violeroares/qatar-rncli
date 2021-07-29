import React, { useState } from 'react'
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from 'react-native'
import { useNetInfo } from "@react-native-community/netinfo";
import { Avatar, Button, Text, TextInput } from 'react-native-paper'
import apiRoutes from '@services/ApiRoutes';
import { validateEmail } from '@helpers/helpers'
import { useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { post } from '@services/ApiService';
import ImageCropPicker from '@components/ImageCropPicker';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Register({ navigation }) {
    const { colors } = useTheme();
    const netInfo = useNetInfo();
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

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={92}
        >
            <ScrollView style={{ marginTop: 0, flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={styles.inner}>

                        {/* <Text style={styles.header}>Bienvenido!</Text> */}
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    openSheet();
                                }}>
                                <View
                                    style={{
                                        borderWidth: 3,
                                        borderRadius: 124,
                                        borderColor: '#02AE9C',
                                    }}>
                                    <Avatar.Image
                                        source={
                                            photoURL && photoURL != 'no_image'
                                                ? { uri: photoURL }
                                                : require('@assets/Smiley.png')
                                        }
                                        size={124}

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
                        <View style={styles.action}>
                            <View
                                style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                                <Icon2 name="account" color="#7982FF" size={25} />
                            </View>
                            <TextInput
                                label='Nombre'
                                placeholder='Ingresa tu nombre'
                                autoCapitalize='words'
                                keyboardType='default'
                                autoCompleteType='username'
                                onChangeText={val => firstNameInputChange(val)}
                                style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                            />
                        </View>

                        <View style={styles.action}>
                            <View
                                style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                                <Icon2 name="account-outline" color="#F77F74" size={25} />
                            </View>
                            <TextInput
                                label='Apellido'
                                placeholder='Ingresa tu apellido'
                                autoCapitalize='words'
                                keyboardType='default'
                                autoCompleteType='username'
                                onChangeText={val => lastNameInputChange(val)}
                                style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                            />
                        </View>
                        <View style={styles.action}>
                            <View
                                style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                                <Icon2 name="phone-outline" color="#9CD31D" size={25} />
                            </View>

                            <TextInput
                                label='Teléfono'
                                placeholder='Ingresa tu télefono'
                                autoCapitalize='none'
                                keyboardType='name-phone-pad'
                                autoCompleteType='username'
                                onChangeText={val => telephoneInputChange(val)}
                                style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                            />
                        </View>
                        <View style={styles.action}>
                            <View
                                style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                                <Icon2 name="email-outline" color="#607E94" size={25} />
                            </View>
                            <TextInput
                                label='Email'
                                placeholder='Ingresa tu email'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                autoCompleteType='username'
                                onChangeText={val => emailInputChange(val)}
                                style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                            />
                        </View>
                        <View style={styles.action}>
                            <View
                                style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                                <Icon2 name="account-lock" color="#7982FF" size={25} />
                            </View>
                            <TextInput
                                label='Contraseña'
                                placeholder='Ingresa tu contraseña'
                                autoCompleteType='password'
                                keyboardType='default'
                                style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                                autoCorrect={false}
                                secureTextEntry={data.secureTextEntry ? true : false}
                                onChangeText={val => handlePasswordChange(val)}
                                right={
                                    <TextInput.Icon
                                      name={data.secureTextEntry ? 'eye' : 'eye-off'}
                                      onPress={() =>
                                        updateSecureTextEntry(!data.secureTextEntry)
                                      }
                                      forceTextInputFocus={false}
                                    />
                                  }
                            />
                        </View>
                        <View style={styles.action}>
                            <View
                                style={{ flexDirection: 'column', marginTop: 22, marginRight: 10 }}>
                                <Icon2 name="account-lock-outline" color="#F77F74" size={25} />
                            </View>
                            <TextInput
                                label='Confirmación de contraseña'
                                placeholder='Confirma tu contraseña'
                                autoCompleteType='password'
                                keyboardType='default'
                                style={[styles.textInput, { backgroundColor: colors.backgroud }]}
                                autoCorrect={false}
                                secureTextEntry={data.confirm_secureTextEntry ? true : false}
                                onChangeText={val => handleConfirmPasswordChange(val)}
                                right={
                                    <TextInput.Icon
                                      name={data.confirm_secureTextEntry ? 'eye' : 'eye-off'}
                                      onPress={() =>
                                        updateConfirmSecureTextEntry(!data.confirm_secureTextEntry)
                                      }
                                      forceTextInputFocus={false}
                                    />
                                  }
                            />
                        </View>
                        {/* <View style={styles.forgotContainer}>
                        <Button
                            label='Iniciar sesión'
                            color={colors.placeholder}
                            onPress={() => navigation.navigate('ForgotPassword')}
                            labelStyle={{
                                fontSize: 10,
                                textAlign: 'right'
                            }}
                        >
                            ¿Olividaste tu contraseña?
                        </Button>
                    </View> */}

                        <View style={styles.btnContainer}>
                            <Button
                                color='blue'
                                mode='contained'
                                icon='account'
                                disabled={loading}
                                loading={loading}
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
                                style={{borderRadius: 50}}
                                labelStyle={{ fontSize: 16 }}
                                contentStyle={{ height: 46 }}>
                                Registrarse
                            </Button>
                        </View>
                        
                        {/* <View style={styles.btnContainer}>
                        <Button
                            color='white'
                            mode='contained'
                            icon='account-plus-outline'
                            onPress={() => navigation.navigate('Register')}
                            labelStyle={{fontSize: 16}}
                            contentStyle={{height: 46}}>
                            Registrarse
                        </Button>
                    </View> */}
                        {/* <View style={styles.registerContainer}>
                        <Button
                            label='Iniciar sesión'
                            color={colors.placeholder}
                            onPress={() => navigation.navigate('Register')}
                            labelStyle={{
                                fontSize: 10,

                            }}
                            style={{
                                alignSelf: 'center'
                            }}
                        >
                            ¿No tienes unas cuenta? <Text style={{fontWeight:'bold', fontSize:10}}> Registrarse</Text> 
                        </Button>
                    </View> */}
                        <ImageCropPicker onFileSelected={onFileSelected} ref={sheetRef} />

                    </View>

                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>

    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        //marginTop: -80,
        paddingHorizontal: 24,
        //flex: 1,
        //justifyContent: 'center'
    },
    header: {
        fontSize: 36,
        //marginBottom: 8
    },
    textInput: {
        //marginTop: 0,
        flex: 1,
        //marginTop: Platform.OS === 'ios' ? 0 : -12,
        //paddingLeft: 10,
        fontSize: 17,
        paddingLeft: -20,
    },
    btnContainer: {
        marginTop: 30
    },
    registerContainer: {
        //marginTop: 10,
    },
    dm: {
        position: 'absolute',
        top: 87,
        left: 70,
        elevation: 1,
        shadowOpacity: 0.1
    },
    action: {
        flexDirection: 'row',
        //marginTop: 10,
        //marginBottom: 5,
        //marginHorizontal: 5,
        borderBottomColor: '#f2f2f2',
        //paddingBottom: 5,
    },
})
