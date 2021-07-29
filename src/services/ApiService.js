import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';

const get = async (apiRoute) => {
    try {
        var res = await fetch(apiRoute);
        var data = res.json();
        return data;
    
    } catch (error) {
        console.log("Error en ApiService Get: ", error)
        return null;
    } 
}

const authGet = async (apiRoute) => {
    try {
        var token = await AsyncStorage.getItem("token");
        token = JSON.parse(token);

        var res = await fetch(apiRoute, {
            method: "get",
            headers: new Headers({
                "Authorization": `Bearer ${token.access_token}`
            })
        })
        
        var data = res.json();
        return data;

    } catch (error) {
        console.log("Error en ApiService AuthGet: ", error)
        return null;
    } 
}

const post = async (apiRoute, body) => {
    try {
        var res = await fetch(apiRoute, {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
            }),
            body: JSON.stringify(body)
        })
        
        var data = res.json();
        return data;
        
    } catch (error) {
            console.log("Error en ApiService GET: ", error)
            return null;
    } 
}

const token = async (apiRoute, body) => {
    try {
        var res = await fetch(apiRoute, {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }),
            body: qs.stringify(body)
        })

        var data = res.json();
        return data;
    
    } catch (error) {
        console.log("Error en ApiService Token: ", error)
        return null;
    } 
}

const getUserByEmail = async (apiRoute, body, token) =>{
    try {
        var res = await fetch(apiRoute, {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": `Bearer ${token}`
            }),
            body: JSON.stringify(body)
        })

        // var data={};
        // if (res.status == "401") {
        //     data.success = false;
        //     data.errors = ["Unauthorized"];
        //     return data;
        // }

        var data = res.json();
        return data;

    } catch (error) {
        console.log("Error en ApiService GetUserByEmail: ", error)
        return null;
    } 
}

const authPost = async (apiRoute, body) => {
    try {
        var token = await AsyncStorage.getItem("token");
        token = JSON.parse(token);
        
        var res = await fetch(apiRoute, {
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": `Bearer ${token.access_token}`
            }),
            body: JSON.stringify(body)

        })

        // var data={};
        // if (res.status == "401") {
        //     data.success = false;
        //     data.errors = ["Unauthorized"];
        //     return data;
        // }

        // if (res.status == "400") {
        //     data.success = false;
        //     data.errors = ["Bad Request"];
        //     return data;
        // }

        var data = res.json();
        return data;

    } catch (error) {
        console.log("Error en ApiService AuthPost: ", error)
        return null;
    } 
}

const authPut = async (apiRoute, body) => {
    try {
        var token = await AsyncStorage.getItem("token");
        token = JSON.parse(token);

        var res = await fetch(apiRoute, {
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": `Bearer ${token.access_token}`
            }),
            body: JSON.stringify(body)
        })

        var data={};
        if (res.status == "401") {
            data.success = false;
            data.errors = ["Unauthorized"];
            return data;
        }

        data = res.json();
        return data;

    } catch (error) {
        console.log("Error en ApiService AuthPut: ", error)
        return null;
    } 
}

module.exports = {
    get,
    authGet,
    post,
    authPost,
    token,
    authPut,
    getUserByEmail,
}