import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Caption, Button, Title, Paragraph, Text} from 'react-native-paper';
import CustomButton from '@components/CustomButton';
import ImageCropPicker from '@components/ImageCropPicker';
import BoardsContext from '@context/boards/BoardsContext';
import {AuthContext} from '@context/auth/AuthContext';
import {useTheme} from '@react-navigation/native';

const SPACING = 20;

const Boards = ({navigation}) => {
  const {state} = useContext(AuthContext);
  const {boards, getBoards, postBoard, loading, loadingBoards, error} =
    useContext(BoardsContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const sheetRef = React.createRef();
  const {colors} = useTheme();

  useEffect(() => {
    getBoards(state.user.UserId);
    console.log('useEffect Boards');
  }, []);

  const reloadBoards = () => {
    getBoards(state.user.UserId);
    console.log('reloadBoards');
  };

  const onFileSelected = image => {
    closeSheet();
    if (image) {
      setImageData(image.data);
      setImageLoaded(true);
      setImagePath(image.path);
    }
  };

  const closeSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
  };

  const openSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.open();
    }
  };

  const addBoard = async () => {
    if (imageData == null) {
      Alert.alert(
        'Error',
        'Debes adjuntar la foto para solicitar uncartón de juego.',
        [{text: 'Aceptar'}],
      );
      return;
    }

    postBoard(state.user.UserId, imageData);
    reloadBoards(state.user.UserId);
  };

  function renderHeader() {
    return (
      <View style={[styles.header, {backgroundColor: colors.box}]}>
        <View
          style={{
            alignItems: 'flex-start',
            alignContent: 'center',
            alignSelf: 'center',
            flex: 1,
            marginLeft: 15,
          }}>
          <Text style={{fontWeight: 'bold', color: colors.text}}>Cartón</Text>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginEnd: 10,
          }}>
          <Text style={{color: colors.text}}></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 110,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{color: colors.text}}>Estado</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{color: colors.text, fontWeight: 'bold'}}>#</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderRow = ({item}) => {
    return (
      <View style={[styles.listItem, {backgroundColor: colors.card}]}>
        {item.ImageFullPath != 'no_image' ? (
          <Image
            source={{uri: item.ImageFullPath}}
            style={{width: 60, height: 60, borderRadius: 30}}
          />
        ) : (
          <Image
            source={require('@assets/Smiley.png')}
            style={{width: 60, height: 60, borderRadius: 30}}
          />
        )}
        <View
          style={{
            alignItems: 'flex-start',
            alignContent: 'center',
            alignSelf: 'center',
            flex: 1,
            marginLeft: 15,
          }}>
          <Text style={{fontWeight: 'bold'}}></Text>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginRight: 10,
          }}>
          <Text style={{fontWeight: 'bold'}}></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 120,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{color: colors.text}}>{item.BoardStatus.Name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 30,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{color: colors.text}}>{item.BoardId}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return error != null ? (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{padding: 10}}>{error}</Text>
      <Button title="Recargar" onPress={reloadBoards} />
    </View>
  ) : (
    <View style={[styles.container, {backgroundColor: colors.background2}]}>
      <View style={[styles.textAyuda, {backgroundColor: colors.box}]}>
        <Paragraph style={{fontWeight: 'bold'}}>Instrucciones:</Paragraph>
        <Text style={{color: colors.onSurface, textAlign: 'justify'}}>
          1) Cargue la foto de la solicitud. (Ver Reglamento)
        </Text>
        <Text style={{color: colors.onSurface, textAlign: 'justify'}}>
          2) Presione el botón "Solicitar Cartón" para confirmar.
        </Text>
        <Text style={{color: colors.onSurface, textAlign: 'justify'}}>
          NOTA: Puede consultar el estado de sus cartones en la lista inferior.
        </Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            openSheet();
          }}>
          <Image
            source={
              imagePath
                ? {uri: imagePath}
                : require('@assets/ic_cloud_upload.png')
            }
            style={{
              borderWidth: 0,
              borderColor: 'white',
              borderRadius: 10,
              height: 170,
              width: 170,
              resizeMode: 'stretch',
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 12,
            padding: 10,
            textAlign: 'center',
            color: colors.notification,
          }}>
          {' '}
          Toque la imágen para adjuntar la foto de la consigna.{'\n'}Luego
          presione en "Solicitar Cartón"
        </Text>
      </View>
      
      {/* <View style={{padding: 10}}>
        <CustomButton
          title="SOLICITAR CARTÓN"
          primary
          disabled={!imageLoaded}
          loading={loading}
          onPress={() => addBoard()}
        />
      </View> */}
      <View style={{padding: 10, marginTop: 10}}>
            <Button
                //color='#01AE9C'
                color='blue'
                mode='contained'
                //icon='account'
                disabled={!imageLoaded}
                loading={loading}
                onPress={() => addBoard()}
                style={{borderRadius: 50}}
                labelStyle={{ fontSize: 17 }}
                contentStyle={{ height: 46 }}>
                Solicitar Cartón
            </Button>
       </View>
      <FlatList
        data={boards}
        renderItem={renderRow}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: SPACING / 2,
          paddingTop: StatusBar.currentHeight - 15 || 42,
          backgroundColor: colors.background2,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={'#FCF450'}
            onRefresh={reloadBoards}
            refreshing={loadingBoards}
          />
        }
        ListEmptyComponent={() => (
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <Text style={{fontSize: 18}}>No se encontraron resultados</Text>
          </View>
        )}
      />
      <ImageCropPicker onFileSelected={onFileSelected} ref={sheetRef} />
    </View>
  );
};

export default Boards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F7F7F7',
  },
  textAyuda: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    elevation: 3,
  },
  fondo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  listItem: {
    margin: 1,
    padding: 10,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
  header: {
    padding: 0,
    //backgroundColor:"#E6F288",
    //backgroundColor: colors.secondaryVariantLigth,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    height: 40,
    elevation: 1.5,
    marginBottom: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
});
