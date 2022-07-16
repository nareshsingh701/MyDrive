import React, { useState, useEffect } from 'react'
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'

const MyDrive = (props) => {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    syncLocalStorage()
  }, [])

  const syncLocalStorage = async () => {
    const localImageData = await getData();
    localImageData && setImageData(localImageData)
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('imageData', jsonValue)
    } catch (e) {
      console.log("AsyncStorage Error", e);
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('imageData')
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.log("AsyncStorage Error", e);
    }
  }


  const openPicker = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 10
    }, (response) => {
      if (response.didCancel) {
        console.log("User Not Selected any Item");
      } else if (response.assets) {
        const tempArr = [...imageData, ...response.assets];
        setImageData(tempArr)
        storeData(tempArr)
      }
    });
  }

  const renderAllImages = ({ item, index }) => {
    const { uri } = item;
    return (
      <Image style={styles.imageStyle} source={{ uri: uri }} />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Drive</Text>
      </View>
      <FlatList
        data={imageData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAllImages}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
      <TouchableOpacity
        onPress={openPicker}
        style={styles.viewStyle}>
        <Image resizeMode={'cover'} style={styles.imageBackground} source={require('../assets/images/plusButton.png')} />
      </TouchableOpacity>
    </View>
  )

}

export default MyDrive;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  flatListContainer: {
    backgroundColor: "#ffffff",
    marginTop: 2
  },
  imageStyle: {
    width: "50%",
    height: 200
  },
  headerView: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: "#000"
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },
  viewStyle: {
    bottom: 20,
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 25,
    right: 20,
    zIndex: 100
  },
  imageBackground: {
    width: 24,
    height: 24,
    alignSelf: 'center',
    marginTop: 12,
  },
  viewImage: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 25,

  },
})