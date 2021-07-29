import React from 'react';
import {View, TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';

import colors from '@assets/theme/colors';
import {windowHeight, windowWidth} from '@utils/Dimentions';

const CustomButton = ({
  title,
  color,
  accent,
  secondary,
  primary,
  success,
  danger,
  disabled,
  loading,
  onPress,
  style,
}) => {
  const getBgColor = () => {
    if (disabled) {
      return colors.grey;
    }
    if (primary) {
      return colors.primary;
    }
    if (danger) {
      return colors.danger;
    }
    if (secondary) {
      return colors.secondary;
    }
    if (success) {
      return colors.success;
    }
    if (accent) {
      return colors.accent;
    }
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.wrapper, {backgroundColor: getBgColor()}, style]}>
      <View style={[styles.loaderSection]}>
        {loading && (
          <ActivityIndicator
            //color={primary ? colors.success : colors.primary}
            color='white'
          />
        )}
        {title && (
          <Text
            style={[styles.panelButtonTitle,{
              //color: disabled ? 'black' : colors.white,
              paddingLeft: loading ? 10 : 0,
            }]}>
            {loading ? 'CARGANDO...' : title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    elevation:2
  },
  loaderSection: {
    flexDirection: 'row',
  },
  textInput: {
    //flex: 1,
    width: '100%',
  },

  error: {
    color: colors.danger,
    paddingTop: 4,
    fontSize: 12,
  },
  panelButtonTitle: {
    fontSize: 17,
    //fontWeight: 'bold',
    color: 'white',
  },
});
