import React, {useContext, useState} from 'react';
import {Alert, Image, StyleSheet, TextInput, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {Button, Caption, Text, Paragraph} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {getParsedDateAndTime, validateNumber} from '@helpers/helpers';
import CustomButton from '@components/CustomButton';
import PredictionsContext from '@context/predictions/PredictionsContext';
import {ScrollView} from 'react-native';

const SPACING = 25;
const AVATAR_SIZE = 90;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

export default function PredictionEdit({navigation, route}) {
  const {colors} = useTheme();
  const {
    PredictionId,
    BoardId,
    MatchId,
    LocalGoals,
    VisitorGoals,
    UserId,
    LocalName,
    VisitorName,
    DateTime,
    LocalImageFullPath,
    VisitorImageFullPath,
  } = route.params;

  let golesL = '';
  let golesV = '';
  if (LocalGoals != null) {
    if (LocalGoals > 0) {
      golesL = LocalGoals;
    } else {
      golesL = 0;
    }
  }
  if (VisitorGoals != null) {
    if (VisitorGoals > 0) {
      golesV = VisitorGoals;
    } else {
      golesV = 0;
    }
  }
  const {postPrediction} = useContext(PredictionsContext);
  const [localGoals, onChangeLocalGoals] = React.useState(golesL.toString());
  const [visitorGoals, onChangeVisitorGoals] = React.useState(
    golesV.toString(),
  );
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const saveHandle = async (
    predictionId,
    boardId,
    localGoals,
    visitorGoals,
    matchId,
    userId,
  ) => {
    setLoading(true);
    if (!netInfo.isConnected) {
      Alert.alert('Error de Conexión', 'Comprueba tu conexión a internet.', [
        {text: 'Aceptar'},
      ]);
      setLoading(false);
      return;
    }

    if (localGoals.length == 0 || visitorGoals.length == 0) {
      Alert.alert(
        'Predicciones!',
        'Debes ingresar la cantidad de goles para el eqiupo local y visitante.',
        [{text: 'Aceptar'}],
      );
      setLoading(false);
      return;
    }

    if(!validateNumber(localGoals)) {
      Alert.alert(
        'Error',
        'Debes ingresar solo números para los goles del equipo Local.',
        [{text: 'Aceptar'}],
      );
        setLoading(false);
        return;
    }
    
    if(!validateNumber(visitorGoals)) {
      Alert.alert(
        'Error',
        'Debes ingresar solo números para los goles del equipo Visitante.',
        [{text: 'Aceptar'}],
      );
        setLoading(false);
        return;
    }   

    postPrediction(
      predictionId,
      boardId,
      localGoals,
      visitorGoals,
      matchId,
      userId,
    );
    setLoading(false);
    navigation.navigate('predictions');
  };

  return (
    <ScrollView style={{backgroundColor: colors.background2}}>
      <View style={[styles.container, {backgroundColor: colors.background2}]}>
        {/* <Text
          style={[
            styles.textAyuda,
            {color: colors.text, backgroundColor: colors.box},
          ]}>
          <Paragraph style={{fontWeight: 'bold'}}>Instrucciones: </Paragraph>
          {'\n'}1) Ingrese los goles para el equipo Local y Visitante.{'\n'}2)
          Presione el botón "Confirmar" para guardar los cambios.
        </Text> */}

        <View style={[styles.textAyuda, {backgroundColor: colors.box}]}>
          <Paragraph style={{fontWeight: 'bold'}}>Instrucciones: </Paragraph>
          <Text style={{color: colors.onSurface}}>
          1) Ingrese los goles para el equipo Local y Visitante.
          </Text>
          <Text style={{color: colors.onSurface}}>
          2) Presione el botón "Confirmar" para guardar los cambios.
          </Text>
        </View>
        <View style={[styles.textTittle, {backgroundColor: colors.card}]}>
          <Text style={{fontWeight: 'bold'}}>
          REALIZAR PREDICCIÓN
          </Text>
        </View>
        {/* <Text style={[styles.textTittle, {backgroundColor: colors.card}]}>
          REALIZAR PREDICCIÓN
        </Text> */}
        <View style={styles.listItem}>
          <View style={styles.teamColumn}>
            <Text style={{textAlign: 'left', marginBottom: 5}}>Local</Text>
            <Image
              source={{uri: LocalImageFullPath}}
              style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
            />
            <View>
              <Text style={styles.team}>{LocalName}</Text>
            </View>
          </View>
          <View style={styles.scoreColumn}>
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 5,
                fontWeight: 'bold',
              }}>
              Mi Pronóstico
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <TextInput
                  //autoFocus = {true}
                  style={[
                    styles.textInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.card,
                    },
                  ]}
                  autoFocus={true}
                  value={localGoals}
                  keyboardType="number-pad"
                  onChangeText={onChangeLocalGoals}
                />
              </View>
              <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                <Image
                  source={require('@assets/ic_vs.png')}
                  style={{resizeMode: 'stretch', height: 25, width: 25}}
                />
              </View>
              <View style={{flexDirection: 'column'}}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.card,
                    },
                  ]}
                  value={visitorGoals}
                  keyboardType="number-pad"
                  onChangeText={onChangeVisitorGoals}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Caption style={[styles.item, {color: colors.text, marginTop: 10}]}>
                {getParsedDateAndTime(DateTime)}
              </Caption>
            </View>
          </View>

          <View style={styles.teamColumn}>
            <Text style={{textAlign: 'left', marginBottom: 5}}>Visitante</Text>
            <Image
              source={{uri: VisitorImageFullPath}}
              style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
            />
            <View>
              <Text style={styles.team}>{VisitorName}</Text>

            </View>
          </View>
        </View>
        {/* <View style={{marginHorizontal: 10, marginBottom: 10}}>
          <CustomButton
            title="GUARDAR"
            primary
            disabled={loading}
            loading={loading}
            onPress={() => {
              saveHandle(
                PredictionId,
                BoardId,
                localGoals,
                visitorGoals,
                MatchId,
                UserId,
              );
            }}
          />
        </View> */}
        <View style={{marginHorizontal: 10, marginBottom: 10, marginTop: 10}}>
            <Button
                //color='#01AE9C'
                color='blue'
                mode='contained'
                //icon='account'
                disabled={loading}
                loading={loading}
                onPress={() => {
                  saveHandle(
                    PredictionId,
                    BoardId,
                    localGoals,
                    visitorGoals,
                    MatchId,
                    UserId,
                  );
                }}
                style={{borderRadius: 50}}
                labelStyle={{ fontSize: 17 }}
                contentStyle={{ height: 46 }}>
                Guardar
            </Button>
       </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  },
  textTittle: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    elevation: 3,
    fontWeight: 'bold',
  },
  row: {
    fontFamily: 'HelveticaNeue',
    marginLeft: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnRowTxt: {
    width: '50%',
    padding: 2,
  },
  teamName: {
    width: '50%',
  },
  textInput: {
    fontSize: 80,
    textAlign: 'center',
    width: 65,
    marginLeft: 5,
    marginRight: 5,
    elevation: 1,
  },
  teamColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  scoreColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
    flex: 1,
  },
  goals: {
    fontSize: 60,
    textAlign: 'center',
    width: 50,
    marginLeft: 5,
    marginRight: 5,
  },
  textVs: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 3,
    marginRight: 3,
  },
  listItem: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 5,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
  team: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    //fontSize: 14
  },
});
