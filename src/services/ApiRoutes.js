const API_URL = "http://200.32.43.207:3001/";

module.exports = {
    appVersion : API_URL + "api/appVersion",
    register: API_URL + "api/Users",
    login: API_URL + "api/auth/login",
    getToken: API_URL + "Token",
    getUserByEmail: API_URL + "api/Users/GetUserByEmail",
    getMatches: API_URL + "api/Matches",
    getClosedMatches: API_URL + "api/Matches/GetClosedMatches", 
    getRanking: API_URL + "api/Predictions/GetRanking", 
    getMyBoards: API_URL + "api/Boards",
    getMyPredictions: API_URL + "api/Predictions/GetPrediction", 
    postPrediction: API_URL + "api/Predictions/PostPrediction",
    getMyHits: API_URL +  "api/Predictions/GetHits",
    putUser: API_URL + "api/Users",
    changePassword: API_URL + "api/Users/ChangePassword",
    passwordRecovery: API_URL + "api/Users/PasswordRecovery",
    addBoard: API_URL + "api/Boards",
}