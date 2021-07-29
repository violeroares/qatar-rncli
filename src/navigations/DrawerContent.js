import React, {useContext} from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  useTheme,
  Switch,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '@context/auth/AuthContext';

export function DrawerContent(props) {
  const paperTheme = useTheme();
  const {state, logout, toggleTheme} = useContext(AuthContext);

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
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  }

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <Drawer.Section>
            <View style={styles.userInfoSection}>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                {state.user.ImageFullPath &&
                state.user.ImageFullPath != 'no_image' ? (
                  <Avatar.Image
                    size={64}
                    source={{uri: state.user.ImageFullPath}}
                  />
                ) : (
                  <Avatar.Image
                    size={64}
                    source={require('@assets/Smiley.png')}
                  />
                )}
                <View style={{marginLeft: 15, flexDirection: 'column'}}>
                  <Title style={styles.title}>
                    {state.user.FirstName} {state.user.LastName}
                  </Title>
                  <Caption style={styles.caption}>{state.user.Email}</Caption>
                </View>
              </View>
            </View>
          </Drawer.Section>
          <Drawer.Section title="Home" style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  name="home-outline"
                  //color={color}
                  color="#7982FF"
                  size={size}
                />
              )}
              label="Próximos partidos"
              onPress={() => {
                props.navigation.navigate('matches');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-outline" color="#F77F74" size={size} />
              )}
              label="Mi perfil"
              onPress={() => {
                props.navigation.navigate('profile');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon2
                  name="solar-panel-large"
                  name="md-bar-chart"
                  color="#9CD31D"
                  size={size}
                />
              )}
              label="Predicciones"
              onPress={() => {
                props.navigation.navigate('predictions');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-multiple" color="#69A7F2" size={size} />
              )}
              label="Ranking"
              onPress={() => {
                props.navigation.navigate('ranking');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="information" color="#607E94" size={size} />
              )}
              label="Acerca de esta App"
              onPress={() => {
                props.navigation.navigate('acercaDe');
              }}
            />
          </Drawer.Section>
          <Drawer.Section title="Preferencias">
            <TouchableRipple
              onPress={() => {
                toggleTheme();
              }}>
              <View style={styles.preference}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="invert-colors" color="#9CD31D" size={24} />
                <Text style={{marginLeft: 34}}>Tema Oscuro</Text>
              </View>
              <View pointerEvents="none">
                  <Switch value={paperTheme.dark} />
              </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.drawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color="#FFA744" size={size} />
          )}
          label="Cerrar Sesión"
          onPress={() => desconectarse()}
          // onPress={() => {signOut()
          // }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
    fontFamily: 'HelveticaNeue',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 0,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
