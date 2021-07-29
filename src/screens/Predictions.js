import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import _ from 'lodash';
import {Searchbar, Caption, Title, Paragraph} from 'react-native-paper';
import DropDownPicker from '@components/DropDownPicker';
import { useTheme } from '@react-navigation/native';
import { getParsedDateAndTime } from '@helpers/helpers'
import {AuthContext} from '@context/auth/AuthContext';
import PredictionsContext from '@context/predictions/PredictionsContext';
import BoardsContext from '@context/boards/BoardsContext';

const SPACING = 20;
const AVATAR_SIZE = 68;

const Predictions = ({navigation}) => {
    const {state} = useContext(AuthContext)
      const {colors} = useTheme();
    const {predictions, getMyPredictions, loadingPredictions} = useContext(PredictionsContext);
    const {boardsArray, getBoards} = useContext(BoardsContext);
    const [selectedBoardId, setSelectedBoardId] = useState('')
    const [data = predictions, setData] = useState();
    const [temp = predictions] = useState();
    const [searchTxt, setSearchTxt] = useState('');


    useEffect(() => {
        getBoards(state.user.UserId);
        console.log("useEffectLoadMyBoards")
    }, [state.user])

    useEffect(() => {
        getMyPredictions(state.user.UserId, selectedBoardId);
        console.log("useEffectMyPredictions")
    }, [selectedBoardId])

    const reloadBoards = () =>{
        getBoards(state.user.UserId);
        console.log("reloadMyBoards")
    }

    const reloadPredictions = () =>{
        getMyPredictions(state.user.UserId, selectedBoardId);
        console.log("reloadMyPredictions")
    }

  function boardsNotFound() {
        return <Text>No se encontraron cartones activos</Text>
      }

  function _onchagePicker(selected){
        setSelectedBoardId(selected);
  }

  function _onPress(item){
    navigation.navigate('predictionEdit', {
        PredictionId: item.PredictionId, 
        BoardId: item.BoardId, 
        MatchId: item.MatchId,
        LocalGoals: item.LocalGoals,
        VisitorGoals: item.VisitorGoals, 
        UserId: item.UserId, 
        LocalName: item.Match.Local.Name, 
        VisitorName: item.Match.Visitor.Name,
        DateTime: item.Match.DateTime, 
        LocalImageFullPath: item.Match.Local.ImageFullPath, 
        VisitorImageFullPath: item.Match.Visitor.ImageFullPath,
      });
  }

  const renderRow = ({item}) => {
    return (
      <TouchableOpacity onPress={() => _onPress(item)}>
      <View style={[styles.listItem, {backgroundColor: colors.card}]}>
        <View style={styles.teamColumn}>
          <Image
            source={{uri: item.Match.Local.ImageFullPath}}
            style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
          />
          <View>
            {/* <Text style={[styles.item, {color: colors.text}]}>{item.Match.Local.Name}</Text> */}
            <Title style={{textAlign: 'center', fontWeight: 'bold', fontSize: 13, marginBottom:-6, marginTop: -6}}>{item.Match.Local.Name}</Title>

          </View>
        </View>

        <View style={styles.scoreColumn}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
              <Text style={[styles.goals, {color: colors.text}]}>{item.LocalGoals}</Text>
            </View>
            <View style={{flexDirection: 'column', alignSelf: 'center'}}>
            <Image source={require('@assets/ic_vs.png')} style={{resizeMode: 'stretch', height:25, width:25}}/>
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={[styles.goals, {color: colors.text}]}>{item.VisitorGoals}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Caption style={[styles.item, {color: colors.text}]}>{getParsedDateAndTime(item.Match.DateTime)}</Caption>
          </View>
        </View>

        <View style={styles.teamColumn}>
          <Image
            source={{uri: item.Match.Visitor.ImageFullPath}}
            style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
          />
          <View>
            {/* <Text style={[styles.item, {color: colors.text}]}>{item.Match.Visitor.Name}</Text> */}
            <Title style={{textAlign: 'center', fontWeight: 'bold', fontSize: 13, marginBottom:-6, marginTop: -6}}>{item.Match.Visitor.Name}</Title>

          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  const updateSearch = searchTxt => {
    const formattedQuery = searchTxt.toLowerCase();
    const data = _.filter(temp, item => {
      if (
        item.Match.Visitor.Name.toLowerCase().includes(formattedQuery) ||
        item.Match.Local.Name.toLowerCase().includes(formattedQuery)
      ) {
        return true;
      }
      return false;
    });
    setData(data);
    setSearchTxt(searchTxt);
  };


  function renderHeader() {
    return (
      <View>
        <Searchbar
          style={styles.search}
          onChangeText={text => updateSearch(text)}
          placeholder="Buscar..."
          value={searchTxt}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background2}]}>
      <View style={[styles.textAyuda, {backgroundColor: colors.box}]}>
        <Paragraph style={{fontWeight: 'bold'}}>Instrucciones:</Paragraph>
        <Text style={{color: colors.onSurface}}>
          1) Seleccione el cartón de juego en el que quiere ingresar sus predicciones.
        </Text>
        <Text style={{color: colors.onSurface}}>
          2) Seleccione los partidos disponibles y complete sus predicciones.
        </Text>
      </View>

    <DropDownPicker
      items={boardsArray}
      placeholder="Seleccione un cartón de juego"
      placeholderStyle={{
        color: colors.text,
        fontWeight: 'bold',
        textAlign: 'left'
      }}
      searchableError={boardsNotFound}
      containerStyle={{ height: 45, marginLeft: 10, marginRight: 10}}
      style={{
        backgroundColor: colors.card,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        //elevation: 1,
        borderColor: colors.border
      }}
      itemStyle={{
        justifyContent: 'flex-start'
      }}
      dropDownStyle={{
        borderBottomLeftRadius: 0, borderBottomRightRadius: 10, backgroundColor: colors.border,
        elevation: 1.5, borderColor: colors.disabled
      }}
      labelStyle={{color: colors.text}}
      arrowColor={colors.text}
      onChangeItem={item => _onchagePicker(item.key)}
    />
    <FlatList
      data={data}
      renderItem={renderRow}
      //ListHeaderComponent={renderHeader()}
      keyExtractor={(item, index) => item + index.toString()}
      contentContainerStyle={{
        padding: SPACING / 2,
        paddingTop: StatusBar.currentHeight - 15 || 42,
        backgroundColor: colors.background2,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          tintColor={'#FCF450'}
          onRefresh={reloadPredictions}
          refreshing={loadingPredictions}
        />
      }
      ListEmptyComponent={() => (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 18, color: colors.text }}>No se encontraron resultados</Text>
        </View>
      )}
    />
  </View>
  );
};

export default Predictions;

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
    textAlign: 'justify'
  },
  teamColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    flex: 1,
  },
  scoreColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    flex: 1,
  },
  goals: {
    fontSize: 40,
    textAlign: 'center',
    width: 50,
    marginLeft: 5,
    marginRight: 5,
    elevation: 3,
  },
  textVs: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 3,
    marginRight: 3,
  },
  fondo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  search: {
    marginBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    elevation: 3,
  },
  listItem: {
    margin: 1,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
  header: {
    padding: 0,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    height: 40,
    elevation: 3,
    marginBottom: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
});
