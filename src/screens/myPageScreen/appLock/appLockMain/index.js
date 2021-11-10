import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import { FlatList } from 'react-native-gesture-handler';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import CoinIdText from '../../../../components/_gmcCustom/CoinIdText'
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import { Switch } from 'react-native-paper';
import { store } from '@redux/store';
import FingerprintScanner from 'react-native-fingerprint-scanner';
// import ReactNativeBiometrics from '@common/react-native-biometrics'
import ReactNativeBiometrics from 'react-native-biometrics'
// import {RNLockScreen,} from 'react-native-lock-screen';
import Modal from "react-native-modal";
import SimpleToast from 'react-native-simple-toast';

class AppLockMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            useLock : store.getState().user.useLock,
            touchId : store.getState().user.lockType == "touch_id",
            faceID : store.getState().user.lockType == "face_id",
            biometricsId : store.getState().user.lockType == "biometrics_id",
            lockType : store.getState().user.lockType,
            biometricType : "",
            modalShow : false,
            certificationFalse : 0
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    }


    isSensorAvailable = ()=>{
        console.log("타입 확인")
        FingerprintScanner
        .isSensorAvailable()
        .then((biometryType)=>{
            console.log("biometryType :: ",biometryType)
            if (biometryType === "Touch ID") {
                console.log('TouchID is supported')
                this.setState({
                biometricType : 'touch_id'
                })
            } else if (biometryType === "Face ID") {
                console.log('FaceID is supported')
                this.setState({
                biometricType : 'face_id'
                })
            } else if (biometryType === "Biometrics") {
                console.log('Biometrics is supported')
                this.setState({
                    biometricType : 'biometrics_id'
                    })
            }  else {
                console.log('Biometrics not supported')
                this.setState({
                    biometricType : 'pinPassword'
                })
            }
        })
        .catch((e)=>{console.log(e.message)})
        // ReactNativeBiometrics.isSensorAvailable()
        // .then((resultObject) => {
        //     const { available, biometryType } = resultObject
        //     if (available && biometryType === ReactNativeBiometrics.TouchID) {
        //       console.log('TouchID is supported')
        //       this.setState({
        //         biometricType : 'touch_id'
        //       })
        //     } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        //       console.log('FaceID is supported')
        //       this.setState({
        //         biometricType : 'face_id'
        //       })
        //     } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        //         console.log('Biometrics is supported')
        //         this.setState({
        //             biometricType : 'biometrics_id'
        //           })
        //       }  else {
        //     console.log('Biometrics not supported')
        //         this.setState({
        //             biometricType : 'pinPassword'
        //         })
        //     }
        //   })
    }

    createKeys = ()=>{
        ReactNativeBiometrics.createKeys('Confirm fingerprint')
        .then((resultObject) => {
          const { publicKey } = resultObject
          console.log(publicKey)
        //   sendPublicKeyToServer(publicKey)
        }).then(()=>{
            this.biometricKeysExist()
        })
    }

    biometricKeysExist = ()=>{
        ReactNativeBiometrics.biometricKeysExist()
        .then((resultObject) => {
            const { keysExist } = resultObject

            if (keysExist) {
            console.log('Keys exist')
            } else {
            console.log('Keys do not exist or were deleted')
            }
        }).then(()=>{
            this.createSignature()
            // this.simplePrompt()
        }).catch((e)=>{
            console.log("e",e)
        })
    }
    
    createSignature = ()=>{
        let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
        let payload = epochTimeSeconds + 'some message'

        ReactNativeBiometrics.createSignature({
            promptMessage: ' ',
            payload: payload
        })
        .then((resultObject) => {
            const { success, signature } = resultObject
        }).catch((e)=>{
            console.log("e",e.message)
            if(e.message.indexOf("-128") < 0){
                if(this.state.certificationFalse <2){
                    this.setState({
                        certificationFalse : this.state.certificationFalse+1
                    })
                }else{
                    let user = {
                        lockType : "pin"
                    }
                    store.dispatch({
                        type: 'SET_USER',
                        payload: user,
                    });
                    this.props.navigation.replace("AppLockMain")
                    SimpleToast.show('TouchID was disabled in this app. please reset app lock option.', SimpleToast.SHORT)
                }
            }
        })
    }

    deleteKeys = ()=>{
        ReactNativeBiometrics.deleteKeys()
        .then((resultObject) => {
            const { keysDeleted } = resultObject

            if (keysDeleted) {
            console.log('Successful deletion')
            } else {
            console.log('Unsuccessful deletion because there were no keys to delete')
            }
        })
    }

    onChangeTouchId=(e)=>{
        this.setState({
            touchId : e,
            faceId : e ? false: this.state.faceId,
            biometricsId : e ? false: this.state.biometricsId
        })
        if(e){
            let user = {
                lockType : "touch_id"
            }
            store.dispatch({
                type: 'SET_USER',
                payload: user,
            });
            // this.test();
            // this.createKeys()
        }else{
            let user = {
                lockType : "pin"
            }
            store.dispatch({
                type: 'SET_USER',
                payload: user,
            });
            // this.test();
            // this.deleteKeys()
        }
    }

    onChangeFaceId=(e)=>{
        this.setState({
            faceId : e,
            touchId : e ? false : this.state.touchId,
            biometricsId : e ? false: this.state.biometricsId
        })
        if(e){
            let user = {
                lockType : "face_id"
            }
            store.dispatch({
                type: 'SET_USER',
                payload: user,
            });
            // this.test();
            // this.createKeys()
        }else{
            let user = {
                lockType : "pin"
            }
            store.dispatch({
                type: 'SET_USER',
                payload: user,
            });
            // this.test();
            // this.deleteKeys()
        }
    }

    onChangeBiometricsId=(e)=>{
        this.setState({
            biometricsId : e,
            touchId : e ? false : this.state.touchId,
            faceId : e ? false: this.state.faceId
        })
        if(e){
            let user = {
                lockType : "biometrics_id"
            }
            store.dispatch({
                type: 'SET_USER',
                payload: user,
            });
            // this.test();
            // this.createKeys()
        }else{
            let user = {
                lockType : "pin"
            }
            store.dispatch({
                type: 'SET_USER',
                payload: user,
            });
            // this.test();
            // this.deleteKeys()
        }
    }

    onChangeUseLock = (e)=>{
        if(e){
            this.setState({
                useLock : "Y",
                touchId : false,
                faceId :false
            })
            this.createPinPassword()
        }else {
            let user = {
                pinPassword: "",
                useLock : "N",
                lockType : "pin"
            }
            store.dispatch({
                type: 'SET_USER',
                payload: user,
            });
            this.setState({
                useLock : "N",
                touchId : false,
                faceId :false
            })
            this.deleteKeys()
        }
    }

    createPinPassword=()=>{
        this.props.navigation.navigate("LockScreen",{mode : 0,type:"create"})
    }

    changePinPassword=()=>{
        this.props.navigation.navigate("LockScreen",{mode : 1,type:"change"})
    }

    test = () =>{
        // console.log("뭐시여~")
        // FingerprintScanner
        // .isSensorAvailable()
        // .then((biometryType)=>{console.log("biometryType :: ",biometryType)})
        // .catch((e)=>{console.log(e.message)})
        // .catch(error => this.setState({ errorMessage: error.message }));
        FingerprintScanner
        .authenticate({ description: 'Scan your fingerprint on the device scanner to continue',fallbackEnabled: false })
        .then((resultObject) => {
            console.log("resultObject :: ",resultObject)
            // if(success){
            //     if(this.state.success){
            //     this.state.success()
            //     }
            //     this.props.navigation.goBack() 
            // }
            // this.props.handlePopupDismissed();
            // AlertIOS.alert('Authenticated successfully');
        })
        .catch((error) => {
            console.log("생체 error :: ",error)
            // this.props.handlePopupDismissed();
            // AlertIOS.alert(error.message);
        });
    }

    componentDidMount = ()=>{
        // this.test()
        this.isSensorAvailable();
    }

    render() {
        const propTypes ={
            headerFragmentProps : {
                icon : Images.lock
            }
        }
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="App lock password" border></HeaderBar>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.cardView}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                    <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>Use app lock password</Text>
                                    <Switch value={this.state.useLock == "Y" ? true : false} onValueChange={(e)=>{this.onChangeUseLock(e)}}></Switch>
                                </View>
                            </View>
                            {this.state.useLock == "Y" &&
                                <>
                                    <View style={[styles.cardView,{paddingVertical:17}]}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>Change app lock password</Text>
                                            <TouchableOpacity style={{}} onPress={()=>{this.changePinPassword()}}>
                                                <View style={{flex:1,width:20,alignItems:'center'}}><Image source={Images.rightArrow} style={{width:6,height:12}}></Image></View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                {this.state.biometricType == "touch_id" &&
                                    <View style={styles.cardView}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>Use TOUCH ID</Text>
                                            <Switch value={this.state.touchId} onValueChange={(e)=>{this.onChangeTouchId(e)}}></Switch>
                                        </View>
                                    </View>
                                }
                                {this.state.biometricType == "face_id" &&
                                    <View style={styles.cardView}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>Use FACE ID</Text>
                                            <Switch value={this.state.faceId} onValueChange={(e)=>{this.onChangeFaceId(e)}}></Switch>
                                        </View>
                                    </View>
                                }
                                
                                {this.state.biometricType == "biometrics_id" &&

                                    <View style={styles.cardView}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>Use BioCert</Text>
                                            <Switch value={this.state.biometricsId} onValueChange={(e)=>{this.onChangeBiometricsId(e)}}></Switch>
                                        </View>
                                    </View>
                                }
                                </>
                            }
                            
                        </View>
                    </ScrollView>
                    <BottomTab navigation={this.props.navigation}/>
                    
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        // paddingHorizontal:20,
    },
    warnText:{
        fontSize:11,
        lineHeight:16,
        fontWeight:'400',
        color:"#9A9A9A"
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'500'
    },
    fontSize16:{
        fontSize:16,
        lineHeight:20,
        fontWeight:'500'
    },
    cardView : {
        backgroundColor:'#FAFAFA',
        paddingHorizontal:20,
        paddingVertical:11,
        borderWidth:1,
        borderColor:Color.white 
    },
    modal:{
        
        flex:1,
        margin : 0,
        padding :0,
    },
   
});


export default AppLockMain;
