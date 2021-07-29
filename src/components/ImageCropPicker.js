import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon} from 'react-native-elements';
import ImagePickerCropper from 'react-native-image-crop-picker';
import { Icon2 } from 'react-native-elements';
import { useTheme, Caption, Title, Paragraph, Text} from 'react-native-paper';
import {AuthContext} from '@context/auth/AuthContext';


const ImageCropPicker = React.forwardRef(({onFileSelected}, ref) => {
  const {colors} = useTheme();
  const {state} = React.useContext(AuthContext);
  const options = [
    {
      name: 'Desde la Cámara',
      //icon: <Icon color='grey' size={26} name="camera" />
      icon: <View style={[styles.dm, {backgroundColor: state.isDarkTheme ? "#02AE9C" : "#E6E6EC"}]}><Icon 
            color={state.isDarkTheme ? 'white' : "black"}
            size={22} 
            name="camera" />
          </View>

    ,
      onPress: () => {
        ImagePickerCropper.openCamera({
          mediaType: 'photo',
          width: 300,
          height: 300,
          cropping: true,
          freeStyleCropEnabled: true, 
          includeBase64: true,
          multiple: false,
        })
          .then((images) => {
            onFileSelected(images);
          })
          .catch((error) => {});
      },
    },
    {
      name: 'Desde la Galería',
      //icon: <Icon name="image" color='grey' size={26} />
      // icon: <View style={styles.dm}><Icon color='black' size={22} name="image" /></View>,
      icon: <View style={[styles.dm, {backgroundColor: state.isDarkTheme ? "#02AE9C" : "#E6E6EC"}]}><Icon 
          color={state.isDarkTheme ? 'white' : "black"}
          size={22} 
          name="image" />
        </View>,
      onPress: () => {      
        ImagePickerCropper.openPicker({
          mediaType: 'photo',
          width: 300,
          height: 300,
          cropping: true,
          freeStyleCropEnabled: true,
          includeBase64: true,
          multiple: false,
        })
          .then((images) => {
            onFileSelected(images);
          })
          .catch((error) => {console.log(error)});
      },
    },
  ];
  return (
    <RBSheet
      ref={ref}
      height={220}
      openDuration={250}
      dragFromTopOnly
      closeOnDragDown
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor:colors.card
        },
      }}>
      <View style={styles.optionsWrapper}>
        <Caption style={{textAlign: 'center', fontSize:16, fontWeight: 'bold', color: colors.primary, marginBottom:10}}>¿De donde quieres tomar la imágen?</Caption>
        {options.map(({name, onPress, icon}) => (
          <TouchableOpacity
            onPress={onPress}
            style={styles.pickerOption}
            key={name}>
            {icon}
            <Text style={styles.text}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </RBSheet>
  );
});

export default ImageCropPicker;

const styles = StyleSheet.create({
  pickerOption: {
    flexDirection: 'row',
    paddingTop: 15,
    alignItems: 'center',
  },

  optionsWrapper: {
    //paddingHorizontal: 15,
    marginHorizontal: 15,
  },

  text: {
    fontSize: 17,
    paddingLeft: 15,
    fontWeight: 'bold'
  },
  dm: {
    padding: 9,
    //backgroundColor: "#E6E6EC",
    borderRadius: 20
    //position: 'absolute',
    // top: 20,
    // left: 0,
  },
});