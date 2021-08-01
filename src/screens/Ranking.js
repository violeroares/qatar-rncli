import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import _ from 'lodash';
import RankingContext from '@context/ranking/RankingContext';
import {AuthContext} from '@context/auth/AuthContext';
const AVATAR_SIZE = 60;
const SPACING = 20;

const Ranking = ({navigation}) => {
  const {state} = useContext(AuthContext);
  const {colors} = useTheme();
  const {ranking, getRanking, loading, error} = useContext(RankingContext);
  const [data = ranking, setData] = useState();
  const [temp = ranking, setTemp] = useState();
  const [searchTxt, setSearchTxt] = useState('');
  const [loadingRanking = loading, setLoadingRanking] = useState();

  useEffect(() => {
    getRanking();
    console.log('useEffect Ranking');
  }, [state.user]);

  const reloadRanking = () => {
    getRanking();
    console.log('reloadRanking');
  };

  const _onPress = item => {
    if (item.StatusMatchId == 1) {
      Alert.alert(
        'Predicciones del Partido!',
        'Solo se podrán visualizar las predicciones de todos los usuarios cuando el partido este iniciado o haya finalizado.',
        [{text: 'Aceptar'}],
      );
      return;
    }
    navigation.navigate('matchPredictions', {
      data: item,
    });
  };

  const updateSearch = searchTxt => {
    const formattedQuery = searchTxt.toLowerCase();
    const data = _.filter(temp, item => {
      if (item.User.FullName.toLowerCase().includes(formattedQuery)) {
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
        <View style={[styles.header, {backgroundColor: colors.box}]}>
          <View
            style={{
              alignItems: 'flex-start',
              alignContent: 'center',
              alignSelf: 'center',
              flex: 1,
              marginLeft: 15,
            }}>
            <Text style={{fontWeight: 'bold'}}>Nombre</Text>
          </View>
          <TouchableOpacity
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginEnd: 10,
            }}>
            <Text style={{}}>Cartón</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{}}>Puntos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>#</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderRow = ({item}) => {
    return (
      <View style={[styles.listItem, {backgroundColor: colors.card}]}>
        <Image
          source={
            item.User.ImageFullPath && item.User.ImageFullPath != 'no_image'
              ? {uri: item.User.ImageFullPath}
              : require('@assets/Smiley.png')
          }
          style={{width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: 30}}
        />
        <View
          style={{
            alignItems: 'flex-start',
            alignContent: 'center',
            alignSelf: 'center',
            flex: 1,
            marginLeft: 15,
          }}>
          <Text style={{fontWeight: 'bold', fontFamily: Platform.OS !== 'android' ? "HelveticaNeue" : "Roboto"}}>
            {item.User.FullName}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginRight: 10,
          }}>
          <Text style={{color: colors.placeholder}}>{item.Board.BoardId}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{color: colors.placeholder}}>{item.Points}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 30,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{fontWeight: 'bold', color: colors.placeholder}}>
            {item.RankingId}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return error != null ? (
    <View style={styles.error}>
      <Text style={{padding: 10}}>{error}</Text>
      <Button title="Recargar" onPress={reloadRanking} />
    </View>
  ) : (
    <View style={[styles.container, {backgroundColor: colors.background2}]}>
      <FlatList
        data={data}
        ListHeaderComponent={renderHeader()}
        renderItem={item => renderRow(item)}
        keyExtractor={(item, index) => item + index.toString()}
        contentContainerStyle={{
          padding: SPACING / 2,
          paddingTop: 10,
          //paddingTop: StatusBar.currentHeight - 15 || 42,
          backgroundColor: colors.background2,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={'#FCF450'}
            onRefresh={reloadRanking}
            refreshing={loadingRanking}
          />
        }
        ListEmptyComponent={() => (
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <Text style={{fontSize: 18, color: colors.text}}>
              No se encontraron resultados
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Ranking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarColumn: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  userNameColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 20,
  },
  userNameText: {
    fontSize: 16,
  },
  boardColumn: {
    marginLeft: 10,
  },
  pointsColumn: {},
  rankingColumn: {},
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
    elevation: 0,
  },
  listItem: {
    margin: 1,
    padding: 10,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
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
    height: 40,
    //elevation: 1.5,
    marginBottom: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
  error: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
