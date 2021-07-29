import React, {useCallback} from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme, Title, Paragraph, Text} from 'react-native-paper';

export default function Instrucciones() {
  const fixsisUrl = 'http://www.fixsis.com.ar';
  const qatarGPUrl =
    'https://play.google.com/store/apps/details?id=com.fixsis.Rusia';
  const {colors} = useTheme();

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
        style={{resizeMode: 'center', maxHeight: 100, height:100}}
      />
      <ScrollView>
        <View
          style={{
            marginHorizontal: 15,
            flexDirection: 'column',
            marginTop: 10,
          }}>
          <Title
            style={{
              fontSize: 24,
              fontWeight: 'bold',
            }}>
            Instrucciones
          </Title>
          <Paragraph style={{marginTop: 10, fontWeight: 'bold', textAlign: 'justify'}}>
            1. En el menú "Mi Perfil - Mis Cartones" adquiera uno o más cartones
          </Paragraph>
          <Text style={{color: colors.placeholder, marginTop: 10, textAlign: 'justify'}}>
            El juego se basa en "cartones" donde usted ingresa las predicciones
            de los resultados de los partidos del torneo.{'\n'}
            Para adquirir los cartones deberá revisar periódicamente las
            consignas que serán publicadas en la FansPage de "ARES Rock" en
            Facebook.{'\n'}
            El administrador luego de verificar los datos aprobará su cartón.
            {'\n'}
            Todos los cartones disponibles y aprobados se podrán visualizar en
            el menú "Cartones".
          </Text>
          <Paragraph
            style={{
              marginTop: 10,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              textAlign: 'justify'
            }}>
            2. En el menú "Predicciones" seleccione el cartón de juego e ingrese
            las predicciones de cada partido.
          </Paragraph>
          <Text style={{color: colors.placeholder, marginTop: 10, textAlign: 'justify'}}>
            Usted podrá ingresar las predicciones hasta antes de empezar el
            partido.{'\n'}
            Si acierta el resultado exacto ganará 3 puntos. Si acierta el
            ganador o empate pero con otro resultado ganará 1 punto.{'\n'}
            Ejemplo: Si para el partido "Russia vs Arabia Saudita" usted coloca
            "2-1" y efectivamente este resultado se dá, ganará 3 puntos. Si
            Russia gana pero con otro resultado (1-0, 3-1, 2-0, etc) usted
            ganará 1 punto. Si Russia pierde o empata,usted no obtiene ningún
            punto.{'\n'}
            {'\n'}NOTA: En caso que el partido se defina por penales, la
            prediccion se realiza solo por el tiempo regular del partido. Quiero
            decir hasta antes de los penales.
          </Text>
          <Paragraph
            style={{
              marginTop: 10,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}>
            3. Ganadores
          </Paragraph>
          <Text style={{color: colors.placeholder, marginTop: 10, textAlign: 'justify'}}>
            Ganarán los 3 participantes de la tabla que más puntos hayan
            obtenido en todo el torneo.{'\n'}
            Los resultados estarán diponibles a lo largo de todo el torneo y se
            podrán visualizar en el menú "Ranking".{'\n'}
            En caso que haya mas de 3 participantes en el primer puesto con el
            mismo puntaje, se repartirá el premio entre todos los ganadores.
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
