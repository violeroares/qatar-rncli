import React, { useReducer } from 'react';
import {Alert} from 'react-native';
import PredictionsContext from '@context/predictions/PredictionsContext';
import PredictionsReducer from '@context/predictions/PredictionsReducer';
import {authGet, authPost} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';

import { 
    GET_PREDICTIONS_REQUEST,
    GET_PREDICTIONS_SUCCESS,
    GET_PREDICTIONS_FAIL,
    SAVE_PREDICTION_REQUEST,
    SAVE_PREDICTION_SUCCESS,
    SAVE_PREDICTION_FAIL,
} from './PredictionsTypes';


const PredictionsState = (props) => {
    const initialState = {
        predictions:[],
        error:null,
        loading:false,
        loadingPredictions:false
    }

    const [state,dispatch] = useReducer(PredictionsReducer, initialState);

    const getMyPredictions = async (userId, boardId) => {
        dispatch({
            type:GET_PREDICTIONS_REQUEST
        });

        await authGet(apiRoutes.getMyPredictions + `/${userId}/${boardId}`).then(result => {
             const resultSortByDate = [...result].sort((a, b) => new Date(b.Match['DateTime']) < new Date(a.Match['DateTime']));
             dispatch({
                type:GET_PREDICTIONS_SUCCESS,
                payload: resultSortByDate
            });
        },
        error => {
            dispatch({
                type: GET_PREDICTIONS_FAIL,
                payload: "Error cargando las predicciones.",
            });
            },
        );
    };


    const postPrediction = async (predictionId, boardId, localGoals, visitorGoals, matchId, userId) => {
        dispatch({
            type:SAVE_PREDICTION_REQUEST
        });
        try {
            await authPost(apiRoutes.postPrediction, {
              PredictionId: predictionId,
              BoardId: boardId,
              LocalGoals: localGoals,
              VisitorGoals: visitorGoals,
              MatchId: matchId,
              UserId: userId,
              Points: 0,
            }).then(result => {
                dispatch({
                    type:SAVE_PREDICTION_SUCCESS,
                    payload: result
                });
                getMyPredictions(userId, boardId);
            },
            error => {
                dispatch({
                    type: SAVE_PREDICTION_FAIL,
                    payload: "Error guardando la prediccion.",
                });
                },
            );
          } catch (e) {
            Alert.alert('Error del servidor', 'Error conectando a los servicios, por favor intente mas tarde.', [
              {text: 'Aceptar'}
            ]);
          }
    }


    return (
        <PredictionsContext.Provider value={{
            predictions:state.predictions,
            error:state.error,
            loading:state.loading,
            loadingPredictions:state.loadingPredictions,
            getMyPredictions,
            postPrediction,
        }}>
            {props.children}
        </PredictionsContext.Provider>
    );
};

export default PredictionsState;