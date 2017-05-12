'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  Alert,
  TouchableHighlight,
  View
} from 'react-native';
import Camera from 'react-native-camera';

class Barcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert : false
    };
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={this._onBarCodeRead}>
        </Camera>
      </View>
    );
  }

  _onBarCodeRead(e) {
    if(!this.state.alert) {
      this.state.alert = true;
      /* The library adds an extra 0 and treats UPC barcodes as EAN barcodes so
       * we strip the first 0. The second 0 is stripped as well as the barcodes
       * in the online DB do not have the first digit i.e the country code
       */
      fetch('https://shrouded-fjord-44294.herokuapp.com/upc?upc='+e.data.substring(2))
      .then( (response) => {
        setTimeout(() => null, 0); // Work out to wait for data
        return response.json();
      })
      .then( (responseData) => {
        if(responseData.length == 1) {
          Alert.alert("Product Found", "Name: "+responseData[0]["product_name"],
          [{text: 'OK', onPress: () => this.state.alert = false}],
          { cancelable: true });
        }
        else {
          Alert.alert("Product Not Found", "Not Present in Database",
          [{text: 'OK', onPress: () => this.state.alert = false}],
          { cancelable: true });
        }
      })
      .done();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  button: {
        backgroundColor: '#eee',
        padding: 10,
        marginRight: 5,
        marginLeft: 5,
    }
});

AppRegistry.registerComponent('Barcode', () => Barcode);
