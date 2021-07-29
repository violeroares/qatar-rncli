import React, { useReducer } from 'react';
import MatchesClosedContext from '@context/matchesClosed/MatchesClosedContext';
import MatchesClosedReducer from '@context/matchesClosed/MatchesClosedReducer';
import {authGet} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';

import { 
    GET_MATCHES_CLOSED_REQUEST,
    GET_MATCHES_CLOSED_SUCCESS,
    GET_MATCHES_CLOSED_FAIL,
} from './MatchesClosedTypes';


const MatchesClosedState = (props) => {
    const initialState = {
        matches:[],
        error:null,
        loading:false,
        loadingMatches:false
    }

    const [state,dispatch] = useReducer(MatchesClosedReducer, initialState);

    const getMatchesClosed = async () => {
        dispatch({
            type:GET_MATCHES_CLOSED_REQUEST
        });

        await authGet(apiRoutes.getClosedMatches).then(res => {
             dispatch({
                type:GET_MATCHES_CLOSED_SUCCESS,
                payload: res
            });
        },
            error => {
                dispatch({
                  type: GET_MATCHES_CLOSED_FAIL,
                  payload: "Error cargando los partidos.",
                });
            },
          );
      };

    return (
        <MatchesClosedContext.Provider value={{
            matches:state.matches,
            error:state.error,
            loading:state.loading,
            loadingMatches:state.loadingMatches,
            getMatchesClosed,
        }}>
            {props.children}
        </MatchesClosedContext.Provider>
    );
};

export default MatchesClosedState;