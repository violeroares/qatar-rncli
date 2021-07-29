import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';
const THEME_KEY = 'isDarkTheme';

async function getTheme() {
  try {
    const item = await AsyncStorage.getItem(THEME_KEY);
    let isDarkTheme = false;
    if (item) isDarkTheme = JSON.parse(item);
    //return item
    return isDarkTheme;
  } catch (error) {
    // Error retrieving data
    console.log('AsyncStorage, Error al recuperar el Estilo:' + error.message);
    return null;
  }
}

async function changeTheme(isDarkTheme) {
  try {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDarkTheme));
    return JSON.stringify(isDarkTheme);
  } catch (error) {
    //Error
    console.log('Error al guardar el Estilo: ' + error.message);
    return 'Error de sintaxis';
  }
}

async function saveUser(user) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return JSON.stringify(user);
  } catch (error) {
    //Error
    console.log('Error al guardar el usuario: ' + error.message);
    return 'Error de sintaxis';
  }
}

async function getUser() {
  try {
    const item = await AsyncStorage.getItem(USER_KEY);
    let user = [];
    if (item) user = JSON.parse(item);
    //return item
    return user;
  } catch (error) {
    // Error retrieving data
    console.log('AsyncStorage, Error al recuperar el usuario:' + error.message);
    return null;
  }
}

async function deleteUser() {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    const item = await AsyncStorage.getItem(USER_KEY);
    return item == null
      ? 'Usuario removido del Storage'
      : 'Usuario NO removido de Storage';
  } catch (error) {
    console.log('Error al eliminar el usuario' + error.message);
    return 'Error de sintaxis';
  }
}

async function saveToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    return JSON.stringify(token);
  } catch (error) {
    //Error
    console.log('error al guardar el Token: ' + error.message);
    return 'Error de sintaxis';
  }
}

async function getToken() {
  try {
    const item = await AsyncStorage.getItem(TOKEN_KEY);
    let token = null;
    if (item) token = JSON.parse(item);
    return token;
  } catch (error) {
    // Error retrieving data
    console.log('AsyncStorage Error al recuperar el Token:' + error.message);
    return null;
  }
}

async function deleteToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    const item = await AsyncStorage.getItem(TOKEN_KEY);
    return item == null
      ? 'Token removido del Storage'
      : 'Token NO removido del Storage';
  } catch (error) {
    console.log('Error al eliminar el Token' + error.message);
    return 'Error de sintaxis';
  }
}

async function deleteThemeConfig() {
  try {
    await AsyncStorage.removeItem(THEME_KEY);
    const item = await AsyncStorage.getItem(THEME_KEY);
    return item == null
      ? 'Configuración de estilo removida del Storage'
      : 'Configuración de estilo NO removido del Storage';
  } catch (error) {
    console.log(
      'Error al eliminar la configuración de estilos.' + error.message,
    );
    return 'Error de sintaxis';
  }
}

export {
  saveUser,
  getUser,
  deleteUser,
  saveToken,
  getToken,
  deleteToken,
  changeTheme,
  getTheme,
  deleteThemeConfig,
};
