import React, { useReducer } from 'react';
import {Alert} from 'react-native'
import BoardsContext from '@context/boards/BoardsContext';
import BoardsReducer from '@context/boards/BoardsReducer';
import {authPost, authGet} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';
//import { AlertContext } from '@context/AlertContext';
import { 
    GET_BOARDS_REQUEST,
    GET_BOARDS_SUCCESS,
    GET_BOARDS_FAIL,
    SAVE_BOARDS_REQUEST,
    SAVE_BOARDS_SUCCESS,
    SAVE_BOARDS_ERROR,
} from './BoardsTypes';


const BoardsState = (props) => {
    //const {dispatchAlert} = React.useContext(AlertContext);
    const initialState = {
        boards:[],
        error:null,
        loading:false,
        loadingBoards:false
    }

    const [state, dispatch] = useReducer(BoardsReducer, initialState);

    function setBoardsArray (res) {
      const array = []
      res.map(b => {
        const clave = b.BoardId
        const boardStatusId = b.BoardStatusId
        array.push({ "key": clave, "label": clave.toString(), "value": clave, "boardStatusId": boardStatusId })
      });
  
      const array2 = array.filter(function (item) {
        return item.boardStatusId == 2;
      }).map(function ({ key, label, value, boardStatusId }) {
        return { key, label, value, boardStatusId };
      });
  
      return array2;
    };


    const getBoards = async (userId) => {
        await authGet(apiRoutes.getMyBoards + `/${userId}`).then(result => {
            dispatch({
                type:GET_BOARDS_SUCCESS,
                payload: result,
                boardsArray: setBoardsArray(result),
            });
        },
        error => {
            //console.log(result)
            dispatch({
              type: GET_BOARDS_FAIL,
              payload: "Error cargando los cartones.",
            });
          },
        );
    }

   const postBoard = async (userId, imageBase64) => {
        dispatch({
            type:SAVE_BOARDS_REQUEST
        });
        await authPost(apiRoutes.addBoard, {
            UserId: userId,
            BoardStatusId: 1,
            WasPayed: false,
            ImageArray: null,
            ImageBase64: imageBase64 || null,
          }).then(function(response) {
            if(response != null){
                if(response.Message == "Error 001"){
                  Alert.alert(
                    'Solicitud de nuevo cartón',
                    'No se permiten agregar más cartones.',
                    [{text: 'Aceptar'}],
                  );
                  dispatch({
                    type:SAVE_BOARDS_ERROR,
                    payload: null
                });
                }
                else{
                //console.log(response)
                  Alert.alert(
                    'Solicitud de nuevo cartón',
                    'Su cartón ha sido enviado exitósamente. Puede consultar su estado en la lista inferior.',
                    [{text: 'Aceptar'}],
                  );
                  dispatch({
                    type:SAVE_BOARDS_SUCCESS,
                    payload: response
                });
                getBoards(userId);
                }
              }
            //response= JSON.stringify(response); 
            // console.log(response)
            // if(response.ok){
            //     console.log("OK")
            //     Alert.alert(
            //         'Solicitud de nuevo cartón',
            //         'Su cartón ha sido enviado exitósamente. Puede consultar su estado en la lista inferior.',
            //         [{text: 'Aceptar'}],
            //       );
            //       console.log(response)
            //       dispatch({
            //         type:SAVE_BOARDS_SUCCESS,
            //         payload: response
            //     });
            // }
            // else{
            //     if(response.status == "400")
            //     {
            //         // dispatchAlert({
            //         //     type: 'open',
            //         //     alertType: 'error',
            //         //     message: 'No se permiten agregar más cartones'
            //         //   });
            //         console.log("400")
            //         dispatch({
            //             type:SAVE_BOARDS_ERROR,
            //             payload: null,
            //         });
            //         Alert.alert(
            //             'Solicitud de nuevo cartón',
            //             'No se permiten agregar más cartones.',
            //             [{text: 'Aceptar'}],
            //           );
            //     }
            //     else{
            //         dispatch({
            //             type:SAVE_BOARDS_ERROR,
            //             payload: 'Error de servidor. Por favor intente más tarde.',
            //         });
            //     };
            // }

          })
          .catch(function(error) {
            console.log('Ocurrio un problema de red:' + error.message);
          });
    }

    return (
        <BoardsContext.Provider value={{
            boards:state.boards,
            error:state.error,
            loading:state.loading,
            loadingBoards:state.loadingBoards,
            boardsArray:state.boardsArray,
            getBoards,
            postBoard,
        }}>
            {props.children}
        </BoardsContext.Provider>
    );
};

export default BoardsState;