import { 
    GET_BOARDS_REQUEST,
    GET_BOARDS_SUCCESS,
    GET_BOARDS_FAIL,
    SAVE_BOARDS_REQUEST,
    SAVE_BOARDS_SUCCESS,
    SAVE_BOARDS_ERROR
  } from "./BoardsTypes";
  
  export default (state,action) => {
    switch(action.type) {
  
        /* GET_BOARDS */
  
          case GET_BOARDS_REQUEST:
              return {
                  ...state,
                  loadingBoards:true,
                  loading: true,
                  error: null
              };
    
          case GET_BOARDS_SUCCESS :
              return {
                  ...state,
                  boards: action.payload,
                  boardsArray: action.boardsArray,
                  loadingBoards: false,
                  loading: false,
                  error: null
              };
          case GET_BOARDS_FAIL :
                return {
                    ...state,
                    boards: [],
                    boardsArray: [],
                    loadingBoards: false,
                    loading: false,
                    error: action.payload,
                };

        /* SAVE_BOARDS */

        case SAVE_BOARDS_REQUEST:
            return {
                ...state,
                loading:true,
                error: null
            };

        case SAVE_BOARDS_SUCCESS :
            return {
                ...state,
                loading:false,
                error: null
            };
        case SAVE_BOARDS_ERROR :
            return {
                ...state,
                loading:false,
                error: action.payload,
            };
    }
  }