import React, { useReducer} from 'react';
import {Alert, Platform} from 'react-native';
// import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { saveUser, getUser, deleteUser, saveToken, getToken, deleteToken, changeTheme, deleteThemeConfig } from '@storage/AuthAsyncStorage'
import {token, getUserByEmail, authGet, authPut} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';

import { 
    LOGIN_SUCCESS,
    LOGIN_REQUEST,
    LOGIN_ERROR,
    LOGOUT,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_ERROR,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    CHANGE_THEME,
    GET_MYHITS_REQUEST,
    GET_MYHITS_SUCCESS,
    GET_MYHITS_FAIL,
} from "./AuthTypes";

const initialState = {
    loading: true,
    user: [],
    token: null,
    myHits: [],
    error: null,
    authenticated:false,
    isDarkTheme: false,
    loadingMyHits: true,
  };

  const authReducer = (state = initialState, action) => {
    switch(action.type) {

        /* CHANGE THEME */
        case CHANGE_THEME :
            changeTheme(action.payload.isDarkTheme);
            return {
                ...state,
                isDarkTheme: action.payload.isDarkTheme,
            };

        /* USER AUTH LOGIN-TOKEN-LOGOUT */
        case LOGIN_REQUEST :
            return {
                ...state,
                loading:true
            };

        case LOGIN_SUCCESS :
            saveUser(action.payload.user);
            saveToken(action.payload.token);

            return {
                ...state,
                authenticated:true,
                token: action.payload.token,
                user: action.payload.user,
                error: null,
                loading:false
            };

        case LOGIN_ERROR :
                return {
                    ...state,
                    authenticated:false,
                    token: null,
                    user: null,
                    loading: false,
                    error: action.payload,
                };

        case LOGOUT:
            //REMOVE DATA
            deleteUser();
            deleteToken()
            deleteThemeConfig();
            return {
                ...state,
                isDarkTheme: false,
                authenticated:false,
                user: null,
                token: null,
                error: null,
                loading:false
            };

        /* USER REGISTER */    
        case REGISTER_REQUEST:
            return {
                ...state,
                loading:true
            };

        case REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading:false
            };

        case REGISTER_ERROR:
                return {
                    ...state,
                    error: action.payload,
                    token: null,
                    user: null,
                    loading:false
                };

        /* UPDATE USER */    
        case UPDATE_USER_REQUEST:
            return {
                ...state,
                loading:true
            };

        case UPDATE_USER_SUCCESS:
            saveUser(action.payload.user);
            return {
                ...state,
                user: action.payload.user,
                loading:false
            };

        case UPDATE_USER_FAIL:
                return {
                    ...state,
                    error: action.payload,
                    user: null,
                    loading:false
                };

        /* GET USER DATA */    
        case GET_USER_REQUEST:
            return {
                ...state,
                loading:true
            };

        case GET_USER_SUCCESS:
            let user = getUser();
            return {
                ...state,
                user: user,
                loading:false
            };

        case GET_USER_FAIL:
                return {
                    ...state,
                    error: action.payload,
                    user: [],
                    loading:false
                };

        case GET_MYHITS_REQUEST :
            return {
                ...state,
                loadingMyHits:true
            };


        case GET_MYHITS_SUCCESS :
            return {
                ...state,
                myHits: action.payload.myHits,
                error: null,
                loadingMyHits:false
            };

        case GET_MYHITS_FAIL:
            return {
                ...state,
                error: action.payload,
                myHits: [],
                loadingMyHits:false
            };
        
        default:
           return state;
    }
}

const AuthContext = React.createContext((initialState));

function AuthProvider(props){

    const [state, dispatch] = useReducer(authReducer, initialState)
    
    const login = async (username, password) => {
        // dispatch({
        //     type:LOGIN_REQUEST
        // });
        //Login
       await token(apiRoutes.getToken, {
            userName : username,
            password : password,
            grant_type : 'password',
            }).then(
            async (response) => {
                //console.log(response)
                //authToken(response.access_token);
                await getUserByEmail(apiRoutes.getUserByEmail,
                    {Email : username}, 
                    JSON.parse(JSON.stringify(response.access_token)))
                    .then((user) => {
                    //console.log(user.data)
                    dispatch({
                        type:LOGIN_SUCCESS,
                        payload: {
                            token:response,
                            //expiration: response.data.access_token,
                            user:user
                        }
                    });
                    
                });
            
        }, 
        (error) => {
            console.log(error.response.status)
            dispatch({
                type:LOGIN_ERROR,
                payload: {
                    error: error.response 
                }
            });

            if(error.response.status == 400){
                Alert.alert('Inicio de Sesión:', 'Nombre de Usuario o Contraseña incorrectos.', [
                    {text: 'Aceptar'}
                ]);
            }
        });
    } 
    
    const logout = () => {
        dispatch({
            type:LOGOUT
        });
    }

    const updateUser = async (userId, userTypeId, email, firstName, lastName, telephone, imagePath, imageData) => {
        // dispatch({
        //     type:UPDATE_USER_REQUEST
        // });
        // Update user
        await authPut(apiRoutes.putUser + `/${userId}`, {
            UserId: userId,
            UserTypeId: userTypeId,
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Telephone: telephone,
            ImagePath: imagePath,
            ImageArray: null,
            ImageBase64: imageData || null,
          }).then(result => {
                //console.log(result)
                dispatch({
                    type:UPDATE_USER_SUCCESS,
                    payload: {
                        user:result
                    }
                });
        }, 
        (error) => {
            console.log(error.response.status)
            dispatch({
                type:UPDATE_USER_FAIL,
                payload: {
                    error: error.response 
                }
            });

            if(error.response.status == 400){
                Alert.alert('Error:', 'No se pudo actualizar el usuario.', [
                    {text: 'Aceptar'}
                ]);
            }
        });
    } 

    const getMyHits = async (userId) => {
        // dispatch({
        //      type:GET_MYHITS_REQUEST
        //  });
        await authGet(apiRoutes.getMyHits + `/${userId}`).then(result => {
                //console.log(result)
                dispatch({
                    type:GET_MYHITS_SUCCESS,
                    payload: {
                        myHits:result
                    }
                });
        }, 
        (error) => {
            console.log(error.response.status)
            dispatch({
                type:GET_MYHITS_ERROR,
                payload: {
                    error: error.response 
                }
            });

            if(error.response.status == 400){
                Alert.alert('Error:', 'No se pudieron cargar los aciertos.', [
                    {text: 'Aceptar'}
                ]);
            }
        });
    } 

    const toggleTheme = () => {
        dispatch({
            type:CHANGE_THEME,
            payload: {
                isDarkTheme: !state.isDarkTheme 
            }
        });
    }

    return(
        <AuthContext.Provider value={{
            state, 
            dispatch, 
            login,
            logout,
            updateUser,
            toggleTheme,
            getMyHits,
            }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider}