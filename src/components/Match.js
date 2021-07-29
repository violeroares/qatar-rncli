import React from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
//import { useTheme } from '@react-navigation/native';
import {getParsedDateAndTime} from '@helpers/helpers';
import { useTheme, Caption, Title } from 'react-native-paper';
const AVATAR_SIZE = 68;

export default function Match({item, onPress}) {
    const {colors} = useTheme();
    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <View style={[styles.listItem,
            {
                backgroundColor: colors.card,
                //shadowColor: colors.card,
                
            }
            ]}>
            <View style={styles.teamColumn}>
              <Image
                source={{uri: item.Local.ImageFullPath}}
                style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
              />
              <View>
                {/* <Text style={[styles.item,{color: colors.text}]}>{item.Local.Name}</Text> */}
                <Title style={{textAlign: 'center', fontWeight: 'bold', fontSize: 13, marginBottom:-6, marginTop: -6}}>{item.Local.Name}</Title>

              </View>
            </View>
            <View style={styles.scoreColumn}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={[styles.goals, {color: colors.text}]}>{item.LocalGoals}</Text>
                </View>
                <View style={{flexDirection: 'column', alignSelf: 'center'}}>
                  <Image source={require('@assets/ic_vs.png')} style={{resizeMode: 'stretch', height:25, width:25}}/>
                  {/* <Text style={styles.textVs}>vs</Text> */}
                </View>
                <View style={{flexDirection: 'column'}}>
                  <Text style={[styles.goals, {color: colors.text}]}>{item.VisitorGoals}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Caption style={[styles.item, {color: colors.text}]}>
                  {getParsedDateAndTime(item.DateTime)}
                </Caption>
              </View>
            </View>
            <View style={styles.teamColumn}>
              <Image
                source={{uri: item.Visitor.ImageFullPath}}
                style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
              />
              <View>
                {/* <Text style={[styles.item, {color: colors.text}]}>{item.Visitor.Name}</Text> */}
                <Title style={{textAlign: 'center', fontWeight: 'bold', fontSize: 13, marginBottom:-6, marginTop: -6}}>{item.Visitor.Name}</Title>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
}

const styles = StyleSheet.create({
    teamColumn: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 1,
      flex: 1,
    },
    scoreColumn: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
      flex: 1,
    },
    goals: {
      fontSize: 40,
      textAlign: 'center',
      width: 50,
      marginLeft: 5,
      marginRight: 5,
      elevation: 3,
    },
    textVs: {
      fontSize: 14,
      textAlign: 'center',
      marginLeft: 3,
      marginRight: 3,
    },
    listItem: {
      margin: 1,
      //backgroundColor: '#FFF',
      width: '100%',
      flex: 1,
      alignSelf: 'center',
      flexDirection: 'row',
      borderRadius: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 10,
      //elevation: 3
    },
  });
  
