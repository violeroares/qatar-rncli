import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Searchbar, Text, Caption, Title} from 'react-native-paper';
import {getParsedDateAndTime} from '@helpers/helpers';
import _ from 'lodash';

const AVATAR_SIZE = 60;
const SPACING = 25;
export default function MatchPredictions({navigation, route}) {
  const {colors} = useTheme();
  const [data = route.params.data, setData] = useState();
  const [temp = route.params.data.Predictions, setTemp] = useState();
  const [predictions = route.params.data.Predictions, setPredictions] =
    useState();
  const [searchTxt, setSearchTxt] = useState('');

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
            <Text style={{fontWeight: 'bold'}}>Usuario</Text>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginEnd: 0,
            }}>
            <Text>L</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginEnd: 10,
            }}>
            <Text>V</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 55,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginEnd: 10,
            }}>
            <Text style={{fontWeight: 'bold'}}>Puntos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const updateSearch = searchTxt => {
    const formattedQuery = searchTxt.toLowerCase();
    const predictions = _.filter(temp, item => {
      if (item.User.FullName.toLowerCase().includes(formattedQuery)) {
        return true;
      }
      return false;
    });
    setPredictions(predictions);
    setSearchTxt(searchTxt);
  };

  const renderRow = ({item}) => {
    return (
      <View style={[styles.listItem, {backgroundColor: colors.card}]}>
        {item.User.ImageFullPath != 'no_image' ? (
          <Image
            source={{uri: item.User.ImageFullPath}}
            style={{width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: 30}}
          />
        ) : (
          <Image
            source={require('@assets/Smiley.png')}
            style={{width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: 30}}
          />
        )}
        <View
          style={{
            alignItems: 'flex-start',
            alignContent: 'center',
            alignSelf: 'center',
            flex: 1,
            marginLeft: 15,
          }}>
          <Text style={{fontWeight: 'bold'}}>{item.User.FullName}</Text>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginRight: 0,
          }}>
          <Text>{item.LocalGoals}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginEnd: 10,
          }}>
          <Text>{item.VisitorGoals}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginEnd: 10,
          }}>
          <Text>{item.Points}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background2}]}>
      <View style={styles.matchDetail}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.teamColumn}>
            <Image
              source={{uri: data.Local.ImageFullPath}}
              style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
            />
            <View>
              <Title style={{textAlign: 'center', fontWeight: 'bold', fontSize: 14}}>{data.Local.Name}</Title>
            </View>
          </View>
          <View style={styles.scoreColumn}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.goals}>{data.LocalGoals}</Text>
              </View>
              <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                <Text style={styles.textVs}>vs</Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.goals}>{data.VisitorGoals}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Caption style={styles.item}>
                {getParsedDateAndTime(data.DateTime)}
              </Caption>
            </View>
          </View>

          <View style={styles.teamColumn}>
            <Image
              source={{uri: data.Visitor.ImageFullPath}}
              style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
            />
            <View>
            <Title style={{textAlign: 'center', fontWeight: 'bold', fontSize: 14}}>{data.Visitor.Name}</Title>
            </View>
          </View>
        </View>
      </View>
      <FlatList
        data={predictions}
        keyExtractor={(item, index) => item + index.toString()}
        ListHeaderComponent={renderHeader()}
        renderItem={renderRow}
        contentContainerStyle={{
          padding: SPACING / 2,
          paddingTop: 10,
          // paddingTop: StatusBar.currentHeight - 15 || 42,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <Text style={{fontSize: 18}}>No se encontraron resultados</Text>
          </View>
        )}
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
  matchDetail: {
    margin: 1,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
  title: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  search: {
    marginBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    elevation: 0,
  },
  header: {
    padding: 0,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    height: 40,
    elevation: 1.5,
    marginBottom: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
});
