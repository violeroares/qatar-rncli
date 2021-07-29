import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
//import { useTheme } from '@react-navigation/native';
import {useTheme, Text, Title} from 'react-native-paper';

export default function HeaderListMatch() {
  const {colors} = useTheme();

        return (
            <View style={[styles.header,{backgroundColor: colors.box}]}>
            <View style={{alignItems:"flex-start", alignContent:'center', alignSelf:'center', flex:1, marginLeft: 15}}>
              <Text style={{fontWeight:"bold", color: colors.text}}>Local</Text>
            </View>
            <TouchableOpacity style={{width:150, justifyContent:"center",alignItems:"center", alignSelf:'center'}}>
              <Title style={{fontWeight: "bold", fontSize: 16}}>Detalle del Partido</Title>
            </TouchableOpacity>
            <View style={{alignItems:"flex-end", alignContent:'center', alignSelf:'center', flex:1, marginRight: 15}}>
              <Text style={{fontWeight:"bold"}}>Visitante</Text>
            </View>
        </View>
        )
}

const styles = StyleSheet.create({
    header:{
      padding:0,
      width:"100%",
      flex:1,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:10,
      height: 40,
      elevation: 1.5,
      marginBottom: 5,
      borderTopLeftRadius: 10, 
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0, 
      borderBottomRightRadius: 10,
    }
  });
