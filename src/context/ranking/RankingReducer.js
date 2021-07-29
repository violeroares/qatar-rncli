import { 
    GET_RANKING_REQUEST,
    GET_RANKING_SUCCESS,
    GET_RANKING_FAIL,
    GET_USER_RANKING_REQUEST,
    GET_USER_RANKING_SUCCESS,
    GET_USER_RANKING_FAIL
  } from "./RankingTypes";
  
  export default (state,action) => {
    switch(action.type) {
  
        /* GET_RANKING */
  
        case GET_RANKING_REQUEST:
            return {
                ...state,
                loadingRanking:true,
                loading: true,
                error: null,
            };
  
        case GET_RANKING_SUCCESS :
            return {
                ...state,
                ranking: action.payload,
                loadingRanking: false,
                loading: false,
                error: null,
            };
        case GET_RANKING_FAIL :
            return {
                ...state,
                ranking: [],
                loadingRanking: false,
                loading: false,
                error: action.payload,
            };

            /* GET_USER_RANKING */
            case GET_USER_RANKING_REQUEST:
                return {
                    ...state,
                    loadingUserRanking:true,
                    loading: true,
                    error: null,
                };
      
            case GET_USER_RANKING_SUCCESS :
                return {
                    ...state,
                    userRanking: action.userRanking,
                    userPoints: action.userPoints,
                    loadingUserRanking: false,
                    loading: false,
                    error: null,
                };
            case GET_USER_RANKING_FAIL :
                return {
                    ...state,
                    userRanking: 0,
                    userPoints: 0,
                    loadingUserRanking: false,
                    loading: false,
                    error: action.payload,
                };
    }
  }