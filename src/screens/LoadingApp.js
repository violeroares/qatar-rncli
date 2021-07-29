import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function LoadingApp({navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#05375a" barStyle="light-content" />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duration={3000}
          source={require('@assets/LogoQ.png')}
          style={styles.logo}
          resizeMode="cover"
        />
        <ActivityIndicator color="white" size="large" />
      </View>
    </View>
  );
}

const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05375a',
    //backgroundColor: '#111D24', 
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
});
