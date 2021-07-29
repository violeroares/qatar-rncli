import React, { useReducer } from 'react';
import MatchesContext from '@context/matches/MatchesContext';
import MatchesReducer from '@context/matches/MatchesReducer';
import {authGet} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';

import { 
    GET_MATCHES_REQUEST, 
    GET_MATCHES_SUCCESS,
    GET_MATCHES_FAIL,
} from './MatchesTypes';


const MatchesState = (props) => {
    const initialState = {
        matches:[],
        error:null,
        loading:false,
        loadingMatches:false
    }

    const [state,dispatch] = useReducer(MatchesReducer, initialState);

    const getMatches = async () => {
        dispatch({
            type:GET_MATCHES_REQUEST
        });

        await authGet(apiRoutes.getMatches).then(res => {
             //console.log(res)
             const resultFiltered = [...res].filter((a) => (a.StatusMatchId == 1));
             dispatch({
                type:GET_MATCHES_SUCCESS,
                payload: resultFiltered
            });
        },
        error => {
            dispatch({
              type: GET_MATCHES_FAIL,
              payload: "Error cargando los partidos.",
            });
          },
        );
    };

    return (
        <MatchesContext.Provider value={{
            matches:state.matches,
            error:state.error,
            loading:state.loading,
            loadingMatches:state.loadingMatches,
            getMatches,
        }}>
            {props.children}
        </MatchesContext.Provider>
    );
};

export default MatchesState;