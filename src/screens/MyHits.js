import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';
import {Searchbar, Text, Title, Caption, Paragraph} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {AuthContext} from '@context/auth/AuthContext';
import {getParsedDateAndTime} from '@helpers/helpers';

const AVATAR_SIZE = 90;
const SPACING = 25;

export default function MyHits() {
  const {state, getMyHits} = useContext(AuthContext);
  const {colors} = useTheme();
  const [data = state.myHits, setData] = useState();
  const [temp = state.myHits, setTemp] = useState();
  const [searchTxt, setSearchTxt] = useState('');

  useEffect(() => {
    getMyHits(state.user.UserId);
    console.log('useEffect MyHits');
  }, [state.user]);

  const refresh = () => {
    getMyHits(state.user.UserId);
    console.log('reloadMyHits');
  };

  const updateSearch = searchTxt => {
    const formattedQuery = searchTxt.toLowerCase();
    const data = _.filter(temp, item => {
      //console.log(item);
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

  const renderRow = ({item}) => {
    return (
      <View>
        <View style={[styles.listItem, {backgroundColor: colors.card}]}>
          <View style={[styles.title, {borderBottomColor: colors.separator}]}>
            <Title
              style={{
                textAlign: 'center',
                marginTop: 10,
                color: colors.text,
                marginBottom: 10,
                fontWeight: 'bold',
              }}>
              Resultado del Partido
            </Title>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.teamColumn}>
              <Image
                source={{uri: item.Match.Local.ImageFullPath}}
                style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
              />
              <View>
                <Text style={styles.team}>{item.Match.Local.Name}</Text>
              </View>
            </View>
            <View style={styles.scoreColumn}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.goals}>{item.Match.LocalGoals}</Text>
                </View>
                <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                  <Image
                    source={require('@assets/ic_vs.png')}
                    style={{resizeMode: 'stretch', height: 25, width: 25}}
                  />
                </View>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.goals}>{item.Match.VisitorGoals}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 12, marginTop: 20}}>
                  {getParsedDateAndTime(item.Match.DateTime)}
                </Text>
              </View>
            </View>

            <View style={styles.teamColumn}>
              <Image
                source={{uri: item.Match.Visitor.ImageFullPath}}
                style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
              />
              <View>
                <Text style={styles.team}>{item.Match.Visitor.Name}</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.title2,
              {
                marginTop: 15,
                borderBottomColor: colors.separator,
                borderTopColor: colors.separator,
              },
            ]}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 10,
                color: colors.text,
                fontWeight: 'bold',
              }}>
              Mi Predicción
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.scoreColumn}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.goals}>{item.LocalGoals}</Text>
                </View>
                <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                  <Image
                    source={require('@assets/ic_vs.png')}
                    style={{resizeMode: 'stretch', height: 25, width: 25}}
                  />
                </View>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.goals}>{item.VisitorGoals}</Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 10,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              Puntos Obtenidos: {item.Points}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return state.error != null ? (
    <View style={styles.error}>
      <Text style={{padding: 10}}>{state.error}</Text>
      <Button title="Recargar" onPress={refresh} />
    </View>
  ) : (
    <View style={[styles.container, {backgroundColor: colors.background2}]}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item + index.toString()}
        ListHeaderComponent={renderHeader()}
        renderItem={item => renderRow(item)}
        contentContainerStyle={{
          padding: SPACING / 2,
          paddingTop: 10,
          // paddingTop: StatusBar.currentHeight - 15 || 42,
          backgroundColor: colors.background2,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <Text style={{fontSize: 18, color: colors.text}}>
              No se encontraron resultados
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            tintColor={'#FCF450'}
            onRefresh={refresh}
            refreshing={state.loadingMyHits}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    fontSize: 40,
    textAlign: 'center',
    width: 50,
    marginLeft: 5,
    marginRight: 5,
    elevation: 3,
  },
  textVs: {
    flex: 1,
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
    elevation: 0,
  },
  listItem: {
    margin: 5,
    backgroundColor: '#FFF',
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    elevation: 4,
  },
  header: {
    padding: 0,
    backgroundColor: '#E6F288',
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
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginBottom: 5,
    borderTopLeftRadius: 10,
  },
  title2: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  team: {
    textAlign: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    width: 120,
  },
  error: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
