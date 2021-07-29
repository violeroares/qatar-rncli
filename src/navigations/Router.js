import React, {useContext, useEffect} from 'react';
import {useWindowDimensions, Platform, useColorScheme} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {AuthContext} from '@context/auth/AuthContext';
import {getUser, getToken, getTheme} from '@storage/AuthAsyncStorage';

import AuthStack from '@navigations/AuthStack';
import MyHits from '@screens/MyHits';
import AcercaDe from '@screens/AcercaDe';
import Boards from '@screens/Boards';
import LoadingApp from '@screens/LoadingApp';
import Instrucciones from '@screens/Instrucciones';
import MyTabs from '@navigations/BottomTabs';
//import MyTabs from '@navigations/MaterialBottomTabs';


import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

const Drawer = createDrawerNavigator();
import {DrawerContent} from '@navigations/DrawerContent';
import {createDrawerNavigator} from '@react-navigation/drawer';

export default function Router(props) {
  const isDarkMode = useColorScheme() === 'dark';
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const {state, dispatch, logout} = useContext(AuthContext);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      //OPCION 1
      // background: '#ffffff',
      // background2: '#F7F7F7',
      // tabBarColor: "#F3F2F3",
      // //text: '#333333',
      // border: '#F3F2F3',

      //OPCION 2
      // card: '#ffffff',
      // background: '#FFFFFF',
      // background2: '#F7F7F7',
      // text: '#2F2E2F',
      // primary: "#0280FF",
      // box: "#E5EBF1",
      // border: '#EEEDEF',
      // tabBarColor: "#F3F2F3",

      //opcion 3
      background: '#ffffff',
      background2: '#F7F7F7',
      surface: '#ffffff',
      primary: '#4890EF',
      box: "#ffffff",
      tabBarColor: "#ffffff",
      authScreensColor: '#05375a'
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      //OPCION 1
      // tabBarColor: "#232C37",
      // background: '#111D24',
      // background2: '#111D24',
      // text: '#FEFEFE',
      // card: '#232C37',
      // border: '#1C2830',

      //opcion 2
      // card: '#171617',
      // background: '#010000',
      // text: '#FBFAFB',
      // primary: "#4890EF",
      // box: "#022A4D",
      // border: '#2B2A2B',
      // tabBarColor: "#010000"

      //opcion 2
      background: '#111D24',
      //surface: '#232C37',
      surface: '#2E373D',
      card: '#212D35',
      //card: '#1D272D',
      box: "#022A4D",
      tabBarColor: "#111D24",
      border: '#1C2830',
      authScreensColor: '#111D24'
      //opcion 3
      //  surface: '#1E1E1E',
      //  card: '#1E1E1E',
      //  box: "#022A4D",
      //  tabBarColor: "#1E1E1E"
    },
  };

  //const theme = state.isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  const theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;
  useEffect(() => {
    const timeout = setTimeout(async () => {
      fetchSesion(dispatch);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);


  useEffect(() => {
    //console.log("Cambio de color de navigation Bar")
    if (Platform.OS == 'android'){
    const timeout = setTimeout(async () => {
     
       //if(state.isDarkTheme) {
         if(isDarkMode){
        const response = changeNavigationBarColor('#111D24', false);
        //console.log(response)// {success: true}
        }
        else
        {
          const response = changeNavigationBarColor('#FFFFFF', true);
          //console.log(response)// {success: true}
        }
    }, 1);
    return () => clearTimeout(timeout);
    }
  //}, [state.isDarkTheme]);
  },[isDarkMode]);

  async function fetchSesion(dispatch) {
    const user = await getUser();
    const token = await getToken();
    // const isDarkTheme = await getTheme();
    // dispatch({
    //   type: 'CHANGE_THEME',
    //   payload: {
    //     isDarkTheme: isDarkTheme,
    //   },
    // });
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        token: token,
        user: user,
      },
    });
  }

  if (state.loading) {
    return <LoadingApp />;
  }

  // if( state.loading ) {
  //   return(
  //     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
  //       <ActivityIndicator size="large" color="black"/>
  //     </View>
  //   );
  // }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        {state.token !== null ? (
          <MyTabs/>
          // <Drawer.Navigator
          //   drawerStyle={{width: 322}}
          //   //drawerStyle={isLargeScreen ? null : { width: '78%' }}
          //   drawerType={isLargeScreen ? 'permanent' : 'back'}
          //   drawerContent={props => <DrawerContent {...props} />}>
          //   <Drawer.Screen name="home" component={MyTabs} />
          //   <Drawer.Screen name="acercaDe" component={AcercaDe} />
          //   <Drawer.Screen name="instrucciones" component={Instrucciones} />

          //   <Drawer.Screen name="boards" component={Boards} />
          //   <Drawer.Screen name="myHits" component={MyHits} />
          // </Drawer.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
      {/* <SnackBar /> */}
    </PaperProvider>
  );
}
