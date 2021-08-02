import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
// import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
import { Button } from 'react-native-paper';

const SplashScreen = ({navigation}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container,{backgroundColor: colors.authScreensColor}]}>
      <StatusBar backgroundColor ={colors.authScreensColor} barStyle="light-content" />
      <View style={styles.header}>
        {/* <Animatable.Image
          animation="bounceIn"
          duration={150}
          source={require('@assets/LogoQ.png')}
          style={styles.logo}
          resizeMode="cover"
        /> */}
        <Image
                  source={require('@assets/LogoQ.png')}
                  style={styles.logo}
                  resizeMode="cover"
        />

      </View>
      {/* <Animatable.View style={styles.footer} animation="fadeInUpBig" duration={150}> */}
      <View style={styles.footer}>

        <Text style={styles.title}>Bienvenido al juego de Qatar 2022!</Text>
        <Text style={styles.text}>Inicia sesión con tu cuenta</Text>
        
        {/* <View style={styles.button}>
            <Button
                color='blue'
                mode='contained'
                //icon='account'
                onPress={() => navigation.navigate('Login')}
                style={{borderRadius: 50}}
                //labelStyle={{ fontSize: 17 }}
                contentStyle={{ height: 46 }}>
                Comenzar
            </Button>
       </View> */}
        <View style={styles.button}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <LinearGradient
              colors={['#5db8fe', '#39cff2']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Comenzar</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05375a',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: 'grey',
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
});
