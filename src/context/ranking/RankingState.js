import React, {useReducer} from 'react';
import RankingContext from '@context/ranking/RankingContext';
import RankingReducer from '@context/ranking/RankingReducer';
import {authGet} from '@services/ApiService';
import apiRoutes from '@services/ApiRoutes';

import {
  GET_RANKING_REQUEST,
  GET_RANKING_SUCCESS,
  GET_RANKING_FAIL,
  GET_USER_RANKING_REQUEST,
  GET_USER_RANKING_SUCCESS,
  GET_USER_RANKING_FAIL,
} from './RankingTypes';

const RankingState = props => {
  const initialState = {
    ranking: [],
    error: null,
    loading: false,
    loadingRanking: false,
    loadingUserRanking: false,
  };

  const [state, dispatch] = useReducer(RankingReducer, initialState);

  const getRanking = async () => {
    dispatch({
      type: GET_RANKING_REQUEST,
    });

    await authGet(apiRoutes.getRanking).then(
      res => {
        dispatch({
          type: GET_RANKING_SUCCESS,
          payload: res,
        });
      },
      error => {
        dispatch({
          type: GET_RANKING_FAIL,
          payload: 'Error cargando el Ranking.',
        });
      },
    );
  };

  const getUserRanking = async userId => {
    dispatch({
      type: GET_USER_RANKING_REQUEST,
    });

    await authGet(apiRoutes.getRanking).then(
      res => {
        //console.log(res)
        var points = 0;
        var rankingId = 0;
        res.forEach(item => {
          if (item.User.UserId == userId) {
            points = item.Points;
            rankingId = item.RankingId;
          }
        });
        dispatch({
          type: GET_USER_RANKING_SUCCESS,
          userRanking: rankingId,
          userPoints: points,
        });
      },
      error => {
        dispatch({
          type: GET_USER_RANKING_FAIL,
          payload: 'Error cargando el Ranking.',
        });
      },
    );
  };

  return (
    <RankingContext.Provider
      value={{
        ranking: state.ranking,
        error: state.error,
        loading: state.loading,
        loadingRanking: state.loadingRanking,
        userPoints: state.userPoints,
        userRanking: state.userRanking,
        getRanking,
        getUserRanking,
      }}>
      {props.children}
    </RankingContext.Provider>
  );
};

export default RankingState;
