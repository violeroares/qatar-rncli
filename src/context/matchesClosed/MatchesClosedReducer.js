import { 
  GET_MATCHES_CLOSED_REQUEST,
  GET_MATCHES_CLOSED_SUCCESS,
  GET_MATCHES_CLOSED_FAIL,
} from "./MatchesClosedTypes";

export default (state,action) => {
  switch(action.type) {

      /* GET_MATCHES_CLOSED */

        case GET_MATCHES_CLOSED_REQUEST:
            return {
                ...state,
                loadingMatches:true,
                loading: true,
                error: null,
            };
  
        case GET_MATCHES_CLOSED_SUCCESS :
            return {
                ...state,
                matches: action.payload,
                loadingMatches: false,
                loading: false,
                error: null,
            };
        case GET_MATCHES_CLOSED_FAIL :
            return {
                ...state,
                matches: [],
                loadingMatches: false,
                loading: false,
                error: action.payload,
            };
  }
}