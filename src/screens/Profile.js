import React, { useCallback, useContext, useEffect } from 'react';
import {
  Alert,
  Button,
  Linking,
  Platform,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '@context/auth/AuthContext';
import RankingContext from '@context/ranking/RankingContext';
import { useTheme } from '@react-navigation/native';

const qatarGPUrl =
  'https://play.google.com/store/apps/details?id=com.fixsis.Rusia';

export default function Profile({ navigation }) {
  const { error, userPoints, userRanking, getUserRanking } = useContext(
    RankingContext,
  );
  const { state, logout, toggleTheme } = useContext(AuthContext);
  const { colors } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      getUserRanking(state.user.UserId);
      console.log('useEffect User');
    }, 1);
    return () => clearTimeout(timeout);
  }, [state.user]);

  // useEffect(() => {
  //   getUserRanking(state.user.UserId);
  //   console.log('useEffect User');
  // }, [state.user]);

  function reloadRankingData() {
    getUserRanking(state.user.UserId);
  }

  const OpenURLButton = ({ url, children }) => {
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
      <TouchableRipple onPress={handlePress}>
        <View style={styles.menuItem}>
          <Icon name="heart-outline" color="#607E94" size={25} />
          <Text style={styles.menuItemText}>{children}</Text>
        </View>
      </TouchableRipple>
    );
  };

  function desconectarse() {
    Alert.alert('Salir', '¿Está seguro que desea salir?.', [
      {
        text: 'Si',
        onPress: () => {
          logout();
          //toggleTheme();
        },
      },
      {
        text: 'No',
        onPress: () => { },
        style: 'cancel',
      },
    ]);
  }

  return error ? (
    <View style={styles.error}>
      <Text style={{ padding: 10 }}>{error}</Text>
      <Button title="Recargar" onPress={reloadRankingData} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      {/* {state.isDarkTheme 
        ? <StatusBar  barStyle="ligth-content" backgroundColor={colors.background} />
        : <StatusBar  barStyle="dark-content" backgroundColor={colors.background} />
      }  */}
      <ScrollView>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 58,
                borderColor: colors.text,//'#02AE9C',
              }}>
              <Avatar.Image
                source={
                  state.user.ImageFullPath &&
                    state.user.ImageFullPath != 'no_image'
                    ? { uri: state.user.ImageFullPath }
                    : require('@assets/Smiley.png')
                }
                size={80}
                style={{ margin: 3 }}
              />
            </View>
            <View style={{ marginLeft: 20 }}>
              <Title
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    marginTop: 15,
                    marginRight: 70,
                    marginBottom: 5,
                    textAlign: 'center',
                  },
                ]}>
                {state.user.FullName}
              </Title>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="phone" color={colors.placeholder} size={20} />
            <Text style={{ color: colors.placeholder, marginLeft: 20 }}>
              {state.user.Telephone}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" color={colors.placeholder} size={20} />
            <Text style={{ color: colors.placeholder, marginLeft: 20 }}>
              {state.user.Email}
            </Text>
          </View>
        </View>
        <View style={[styles.infoBoxWrapper, { borderBottomColor: colors.border, borderTopColor: colors.border }]}>
          <View
            style={[styles.infoBox, {
              borderRightColor: colors.border,
              borderRightWidth: 1,
            },
            ]}>
            <Title style={{ fontSize: 24 }}>{userRanking}</Title>
            <Caption>Ranking</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title style={{ fontSize: 24 }}>{userPoints}</Title>
            <Caption>Puntos</Caption>
          </View>
        </View>
        <View style={styles.menuWrapper}>
          <TouchableRipple
            onPress={() =>
              navigation.navigate('profileEdit', { user: state.user })
            }>
            <View style={styles.menuItem}>
              <Icon name="account-check-outline" color="#7982FF" size={25} />
              <Text style={styles.menuItemText}>Cambiar mis datos</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => navigation.navigate('instrucciones')}>
            <View style={styles.menuItem}>
              <Icon name="information-outline" color="#F77F74" size={25} />
              <Text style={styles.menuItemText}>Reglamento</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => navigation.navigate('boards', { user: state.user })}>
            <View style={styles.menuItem}>
              <Icon name="clipboard-list-outline" color="#9CD31D" size={25} />
              <Text style={styles.menuItemText}>Mis cartones</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => navigation.navigate('myHits', { user: state.user })}>
            <View style={styles.menuItem}>
              <Icon name="check-circle-outline" color="#69A7F2" size={25} />
              <Text style={styles.menuItemText}>Mis aciertos</Text>
            </View>
          </TouchableRipple>

          {/* <TouchableRipple onPress={() => {toggleTheme()}}>
              <View style={styles.menuItem}>
                  <Icon name="invert-colors" color="#9CD31D" size={25} />
                  <Text style={styles.menuItemText}>Tema Oscuro</Text>
                  <View pointerEvents="none" style={{alignItems:'stretch', flex:1}}>
                  <Switch style={{marginTop: 1, alignSelf: 'flex-end'}} value={state.isDarkTheme}/>
                  </View>
              </View>
          </TouchableRipple> */}


          <OpenURLButton url={qatarGPUrl}>Califica esta App</OpenURLButton>
          <TouchableRipple
            onPress={() => desconectarse()}>
            <View style={styles.menuItem}>
              <Icon name="exit-to-app" color="#FFA744" size={25} />
              <Text style={styles.menuItemText}>Cerrar Sesión</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  title: {
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    fontSize: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 80,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 17,
    lineHeight: 26,
    fontFamily: 'HelveticaNeue',
    fontWeight: '300',
  },
  error: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preference: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginLeft: 20,
  },
});
