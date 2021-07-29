import React, {useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';

import Matches from '@screens/Matches'
import MatchPredictions from '@screens/MatchPredictions'
import MatchesClosed from '@screens/MatchesClosed'
import Predictions from '@screens/Predictions'
import PredictionEdit from '@screens/PredictionEdit'
import Ranking from '@screens/Ranking'
import Profile from '@screens/Profile'
import ProfileEdit from '@screens/ProfileEdit'
import Instrucciones from '@screens/Instrucciones'
import Boards from '@screens/Boards'
import MyHits from '@screens/MyHits'
import ChangePassword from '@screens/ChangePassword';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function MyTabs() {
  const {colors} = useTheme();
    return (
      <Tab.Navigator
        initialRouteName="matches"
        screenOptions={({ route }) => ({
          
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "matches") {
              (iconName = focused ? "football-sharp" : "football-outline"), 
              (color = focused ? "#7982FF" : "grey"),
              (size = focused ?  28 : 23);
            } else if (route.name === "matchesClosed") {
              (iconName = focused ? "calendar" : "calendar-outline"),
              (color = focused ? "#30B0A1" : "grey"),
              (size = focused ?  26 : 22);
            }
                else if (route.name === "predictions") {
                  (iconName = focused ? "bar-chart" : "bar-chart-outline"),
                  (color = focused ? "#9CD31D" : "grey"),
                  (size = focused ?  26 : 22);
            } else if (route.name === "ranking") {
              (iconName = focused ? "trophy" : "trophy-outline"),
              (color = focused ? "#69A7F2" : "grey"),  
              (size = focused ?  26 : 22);
            } else if (route.name === "profile") {
              (iconName = focused ? "person" : "person-outline"),
              (color = focused ? "#F77F74" : "grey"),
              (size = focused ?  26 : 22);
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
            inactiveTintColor: colors.placeholder,
            activeTintColor: colors.text,
            style:{
              //height: 55,
              //borderTopLeftRadius:10, 
              //borderTopRightRadius:10,
              backgroundColor: colors.tabBarColor,
            },
            labelStyle: {
              fontSize: 12,
              margin: 0,
              paddingBottom: 3,
              marginTop: -4,
            },
        }}
        
      >
      <Tab.Screen
            name="matches"
            component={MatchesStack}
            options={{
              tabBarLabel: 'Próximos',
            }}
          />
        <Tab.Screen
          name="matchesClosed"
          component={MatchesClosedStack}

          options={{
            tabBarLabel: 'Cerrados',
          }}
        />
        <Tab.Screen
          name="predictions"
          component={PredictionsStack}
          options={{
            tabBarLabel: 'Predicciones',
          }}
        />
        <Tab.Screen
          name="ranking"
          component={RankingStack}
          options={{
            tabBarLabel: 'Ranking',
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileStack}
          options={{
            tabBarLabel: 'Mi Perfil',
          }}
        />
      </Tab.Navigator>
    );
}

export default MyTabs;

const StackMatches = createStackNavigator();
function MatchesStack ({navigation, route}) {
  const {colors} = useTheme();
    const routeName = getFocusedRouteNameFromRoute(route);

    useEffect(() => {
      if(routeName ===  "matchPredictions"){
          navigation.setOptions({tabBarVisible: false})
      }else{
          navigation.setOptions({tabBarVisible: true})
      }
    }, [route])

    return (
        <StackMatches.Navigator initialRouteName="matches">
            <StackMatches.Screen 
            name="matches" 
            component={Matches} 
            options={{title: "Próximos Partidos", //headerTitleAlign: "center",
            headerBackTitleVisible: false,    
            // headerLeft: () => (
                //     <Icon2.Button name="menu" color={colors.text} size={25} backgroundColor={colors.card} onPress={() => navigation.openDrawer()}></Icon2.Button>
                // ),
                // headerStyle: {
                //   backgroundColor: '#1771E6',
                // },
            }} />
        <StackMatches.Screen name="matchPredictions" component={MatchPredictions} options={{title: "Predicciones del Partido"}}/>
        </StackMatches.Navigator>
    )
}

const StackMatchesClosed = createStackNavigator();
function MatchesClosedStack ({navigation, route}) {
  const {colors} = useTheme();
  const routeName = getFocusedRouteNameFromRoute(route);

  useEffect(() => {
      if(routeName ===  "matchPredictions"){
          navigation.setOptions({tabBarVisible: false})
      }else{
          navigation.setOptions({tabBarVisible: true})
      }
    }, [route])
    return (
        <StackMatchesClosed.Navigator initialRouteName="matchesClosed">
            <StackMatchesClosed.Screen 
            name="matchesClosed" 
            component={MatchesClosed} 
            options={{ title: "Partidos Cerrados", //headerTitleAlign: "center",
                // headerLeft: () => (
                //     <Icon2.Button name="menu" color={colors.text} size={25} backgroundColor={colors.card} onPress={() => navigation.openDrawer()}></Icon2.Button>
                // )
            }} />
            <StackMatches.Screen 
              name="matchPredictions" 
              component={MatchPredictions} 
              options={{
                title: "Predicciones del Partido",
                headerBackTitleVisible: false,
                //headerBackTitle: "Atrás",
              }}/>
        </StackMatchesClosed.Navigator>
    )
}

const StackPredictions = createStackNavigator();
function PredictionsStack ({navigation, route}) {
  const {colors} = useTheme();
  const routeName = getFocusedRouteNameFromRoute(route);

    useEffect(() => {
        if(routeName ===  "predictionEdit"){
            navigation.setOptions({tabBarVisible: false})
        }else{
            navigation.setOptions({tabBarVisible: true})
        }
      }, [route])

    return (
        <StackPredictions.Navigator initialRouteName="predictions">
            <StackPredictions.Screen 
            name="predictions" 
            component={Predictions} 
            options={{ title: "Realizar Predicciones", //headerTitleAlign: "center",
                // headerLeft: () => (
                //     <Icon2.Button name="menu" color={colors.text} size={25} backgroundColor={colors.card} onPress={() => navigation.openDrawer()}></Icon2.Button>
                // )
            }} />
            <StackPredictions.Screen name="predictionEdit" component={PredictionEdit} options={{title: "Realizar Predicción", headerBackTitleVisible: false}}/>
        </StackPredictions.Navigator>
    )
}


const StackProfile = createStackNavigator();
function ProfileStack ({navigation, route}) {
    const {colors} = useTheme();
    const routeName = getFocusedRouteNameFromRoute(route);
    //console.log(routeName)
    useEffect(() => {
        if(routeName === "profileEdit" || 
           routeName ===  "boards" || 
           routeName ===  "instrucciones" ||
           routeName ===  "changePassword" ||
           routeName ===  "myHits"){
           navigation.setOptions({tabBarVisible: false})
        } else {
            navigation.setOptions({tabBarVisible: true})
        }
      }, [route])

    return (
        <StackProfile.Navigator initialRouteName="profile">
            <StackProfile.Screen 
            name="profile" 
            component={Profile} 
            options={{ 
              title: "Mi Perfil",
              // headerLeft: () => (
              //     <Icon2.Button 
              //         name="menu" 
              //         color={colors.text} 
              //         size={25} 
              //         backgroundColor={colors.card} 
              //         onPress={() => navigation.openDrawer()}
              //     />
              // ),
              // headerRight: () => (
              //     <View style={{marginRight: 10}}>
              //       <Icon2.Button
              //         name="account-edit"
              //         color="black" 
              //         size={25}
              //         backgroundColor="white"
              //         onPress={() => navigation.navigate('editProfile')}
              //       />
              //     </View>
              // ),
          }}/>
            <StackProfile.Screen name="profileEdit" component={ProfileEdit} options={{title: "Modificar Perfil"}}/>
            <StackProfile.Screen name="instrucciones" component={Instrucciones} options={{title: "Instrucciones"}}/>
            <StackProfile.Screen name="boards" component={Boards} options={{title: "Mis Cartones"}}/>
            <StackProfile.Screen name="myHits" component={MyHits} options={{title: "Mis Aciertos"}}/>
            <StackProfile.Screen name="changePassword" component={ChangePassword} options={{title: "Cambiar Contraseña", headerBackTitleVisible: false}}/>

        </StackProfile.Navigator>
    )
}

const StackRanking = createStackNavigator();
function RankingStack ({navigation, route}) {
  const {colors} = useTheme();
    return (
        <StackRanking.Navigator initialRouteName="ranking">
            <StackRanking.Screen 
            name="ranking" 
            component={Ranking} 
            options={{ title: "Ranking",//headerTitleAlign: "center",
                // headerLeft: () => (
                //     <Icon2.Button name="menu" color={colors.text} size={25} backgroundColor={colors.card} onPress={() => navigation.openDrawer()}></Icon2.Button>
                // )
            }} />
        </StackRanking.Navigator>
    )
}
