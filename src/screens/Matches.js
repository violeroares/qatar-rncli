import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import _ from 'lodash';
import {AuthContext} from '@context/auth/AuthContext';
import MatchesContext from '@context/matches/MatchesContext';
import Match from '@components/Match';
import HeaderListMatch from '@components/HeaderListMatch';
const SPACING = 20;

const Matches = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {state} = useContext(AuthContext);
  const {colors} = useTheme();
  const {matches, getMatches, loading, error} = useContext(MatchesContext);
  const [data = matches, setData] = useState();
  const [temp = matches, setTemp] = useState();
  const [searchTxt, setSearchTxt] = useState('');
  const [loadingMatches = loading, setLoadingMatches] = useState();

  useEffect(() => {
    getMatches();
    console.log('useEffect Matches');
  }, [state.user]);

  const loadMatches = () => {
    getMatches();
    console.log('reloadMatches');
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
      if (
        item.Visitor.Name.toLowerCase().includes(formattedQuery) ||
        item.Local.Name.toLowerCase().includes(formattedQuery)
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
        <HeaderListMatch />
      </View>
    );
  }

  return error != null ? (
    <View style={styles.error}>
      {/* {state.isDarkTheme ? ( */}
      {isDarkMode ? (
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />
      ) : (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
      )}
      <Text style={{padding: 10}}>{error}</Text>
      <Button title="Recargar" onPress={loadMatches} />
    </View>
  ) : (
    <View style={[styles.container, {backgroundColor: colors.background2}]}>
      {/* {state.isDarkTheme ? ( */}
        {isDarkMode ? (
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />
      ) : (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
      )}
      <FlatList
        data={data}
        ListHeaderComponent={renderHeader()}
        renderItem={({item}) => {
          return <Match item={item} onPress={_onPress} />;
        }}
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
            onRefresh={loadMatches}
            refreshing={loadingMatches}
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

export default Matches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    elevation: 0,
  },
  error: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
