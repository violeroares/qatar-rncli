import { 
    GET_PREDICTIONS_REQUEST,
    GET_PREDICTIONS_SUCCESS,
    GET_PREDICTIONS_FAIL,
    SAVE_PREDICTION_REQUEST,
    SAVE_PREDICTION_SUCCESS,
    SAVE_PREDICTION_FAIL,
  } from "./PredictionsTypes";
  
  export default (state,action) => {
    switch(action.type) {
  
        /* GET_PREDICTIONS */
  
          case GET_PREDICTIONS_REQUEST:
              return {
                  ...state,
                  loadingPredictions:true
              };
    
          case GET_PREDICTIONS_SUCCESS :
              return {
                  ...state,
                  predictions: action.payload,
                  loadingPredictions: false
              };
              case GET_PREDICTIONS_FAIL :
                return {
                    ...state,
                    predictions: [],
                    loadingPredictions: false,
                    loading: false,
                    error: action.payload,
                };

        /* SAVE_PREDICTIONS */

        case SAVE_PREDICTION_REQUEST:
            return {
                ...state,
                loading:true
            };

        case SAVE_PREDICTION_SUCCESS :
            return {
                ...state,
                //predictions: action.payload,
                loading:false
            };

            case SAVE_PREDICTION_FAIL :
                return {
                    ...state,
                    loading:false
                };
    }
  }