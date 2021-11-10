
import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View
} from 'react-native';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { RNCamera } from 'react-native-camera';

class ScanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onQrSuccess : this.props.navigation.getParam('onQrSuccess'),
        }
    } 
    onSuccess = e => {
        this.state.onQrSuccess(e.data)
        this.props.navigation.goBack()
    //   Linking.openURL(e.data).catch(err =>
    //     console.error('An error occured', err)
    //   );
    };
  
    render() {
      return (
        <QRCodeScanner
          onRead={this.onSuccess}
        //   containerStyle={{flex:1}}
         reactivate={true}
         showMarker={true}
          cameraStyle={{height:"100%",width:"100%"}}
        //   flashMode={RNCamera.Constants.FlashMode.torch}
        //   topContent={
            // <Text style={styles.centerText}>
            //   Go to{' '}
            //   <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            //   your computer and scan the QR code.
            // </Text>
        //   }
          bottomContent={
            <View style={{flex:1,alignItems:'center',justifyContent:'center',bottom:50}}>
                <RectangleButton style={{width:80,height:50,borderRadius:50,backgroundColor:Color.white,borderColor :"#1B2937",borderWidth:1}} textColor={"#1B2937"} title={"Cancel"} onPress={()=>{this.props.navigation.goBack()}}></RectangleButton>
            </View>
          }
        />
      );
    }
  }
  
  const styles = StyleSheet.create({
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777'
    },
    textBold: {
      fontWeight: '500',
      color: '#000'
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
      padding: 16
    }
  });

  export default ScanScreen;
  