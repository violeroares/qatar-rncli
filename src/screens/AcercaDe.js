import React, {useCallback} from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme, Text} from 'react-native-paper';

export default function AcercaDe() {
  const {colors} = useTheme();
  const fixsisUrl = 'http://www.fixsis.com.ar';
  const qatarGPUrl =
    'https://play.google.com/store/apps/details?id=com.fixsis.Rusia';

  const OpenURLButton = ({url, children}) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);
    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.link}>{children}</Text>
      </TouchableOpacity>
    );
    //return <Button title={children} onPress={handlePress} />;
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@assets/Logo.png')}
        style={{resizeMode: 'center', maxHeight: 100}}
      />
      <ScrollView>
        <View
          style={{
            marginHorizontal: 15,
            flexDirection: 'column',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
            }}>
            Qatar 2022{' '}
            <Text style={{fontWeight: 'normal', color: 'grey'}}>1.0.0</Text>
          </Text>
          <Text style={{color: colors.placeholder, marginTop: 10, textAlign: 'justify'}}>
            Aplicación dedicada a todos los amigos de ARES Rock, para jugar y
            predecir los resultados de los partidos del Mundial.{'\n'}
            Compartila con tus contactos para que ellos también puedan
            participar de este juego!.{'\n'}
            Con su resultado, participan de fabulosos premios. Seguinos en las
            redes sociales y enterate de fechas de conciertos, discografía y
            todo lo relacionado con nosotros.
          </Text>
          <Text
            style={{
              color: colors.placeholder,
              marginTop: 10,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}>
            Que no se acabe la fiesta!!!
          </Text>
          <View style={{flexDirection: 'row', marginTop: 30}}>
            <Text style={{color: colors.placeholder}}>Desarrollado por</Text>
            <OpenURLButton url={fixsisUrl}> Christian Olivera</OpenURLButton>
          </View>
          <Text
            style={{
              color: colors.placeholder,
              marginTop: 10,
              alignSelf: 'flex-start',
            }}>
            iOS, Android
          </Text>
          <View style={{flexDirection: 'row', marginTop: 30, marginBottom: 50}}>
            <OpenURLButton url={qatarGPUrl}>
              Si te gusto esta App no te olvides de dejar tu calificación en
              Google Play haciendo clic Aquí
            </OpenURLButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  link: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
