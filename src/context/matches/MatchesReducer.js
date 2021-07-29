import { 
  GET_MATCHES_REQUEST,
  GET_MATCHES_SUCCESS,
  GET_MATCHES_FAIL,
} from "./MatchesTypes";

export default (state,action) => {
  switch(action.type) {

      /* GET_MATCHES */

      case GET_MATCHES_REQUEST:
          return {
              ...state,
              loadingMatches:true,
              loading: true,
              error: null,
          };

      case GET_MATCHES_SUCCESS :
          return {
              ...state,
              matches: action.payload,
              loadingMatches: false,
              loading: false,
              error: null,
          };
          case GET_MATCHES_FAIL :
            return {
                ...state,
                matches: [],
                loadingMatches: false,
                loading: false,
                error: action.payload,
            };
  }
}