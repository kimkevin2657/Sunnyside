import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, TextInput, Platform, AppState } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
// import {RNLockScreen,} from 'react-native-lock-screen';
import PINCode, {hasUserSetPinCode} from '@haskkor/react-native-pincode'
import { store } from '@redux/store';
import moment from 'moment';
import ReactNativeBiometrics from 'react-native-biometrics'
import FingerprintScanner from 'react-native-fingerprint-scanner';
import SimpleToast from 'react-native-simple-toast';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import RNExitApp from 'react-native-exit-app';

class LockScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            mode : this.props.navigation.getParam('mode'),
            lock : store.getState().user.pinPassword || null,
            type : this.props.navigation.getParam('type'),
            success : this.props.navigation.getParam('success'),
            headerFragmentProps : {},
            lockType : store.getState().user.lockType || "pin",
            curTime : new Date(),
            certificationFalse : 0,
            appState : AppState.currentState,
            start : this.props.navigation.getParam('start'),
            background : this.props.navigation.getParam("background"),
        }
    }

    onCapture = (lock)=>{
        let user = {
            useLock : "Y",
            pinPassword: lock
        }
        store.dispatch({
            type: 'SET_USER',
            payload: user,
        });
        this.props.navigation.goBack()
    }

    setHeaderFragmentProps = ()=>{
        // if(this.state.mode == 0){
        //     let headerFragmentProps = {
        //         defaultState:{title:"등록 하실 PIN 번호 6자리를 입력하세요"},
        //         backgroundColor:"#1B2937",
        //         reenterState:{title:"다시 한번 비밀번호를 입력해주세요."},
        //         successState:{title:"비밀 번호가 설정 되었습니다.",
        //     }
        // }
        //     this.setState({
        //         headerFragmentProps : headerFragmentProps
        //     })
        // }else if(this.state.mode == 1 && this.state.type =="confirm"){
        //     let headerFragmentProps = {
        //         defaultState:{title:"PIN 번호 6자리를 입력하세요"},
        //         backgroundColor:"#1B2937",
        //         successState:{title:"비밀 확인이 완료되었습니다.",
        //     }
        // }
        //     this.setState({
        //         headerFragmentProps : headerFragmentProps
        //     })
        // }else if(this.state.type =="change"){
        //     let headerFragmentProps = {
        //         defaultState:{title:"기존 PIN 번호 6자리를 입력하세요"},
        //         backgroundColor:"#1B2937",
        //         successState:{title:"비밀 확인이 완료되었습니다.",
        //     }
        // }
        //     this.setState({
        //         headerFragmentProps : headerFragmentProps
        //     })
        // }
    }

    componentDidMount=()=>{
        this.setHeaderFragmentProps()
        FingerprintScanner.release()
        AppState.addEventListener('change', this.handleAppStateChange);
        if(this.state.lockType !== "pin" && this.state.start){
            this.createSignature()
        }
    }

    componentWillUnmount() {

        FingerprintScanner.release()
    }

    onVerified=()=>{
        if(this.state.type == "change"){
            this.props.navigation.replace("LockScreen",{mode : 0,type : 'create'})
        }else if(this.state.type="Confirm"){
            if(this.state.success){
                this.state.success()
                this.props.navigation.goBack()
            }else{
                this.props.navigation.goBack()    
            }
        }
    }

    androidSignature = (e) =>{
        console.log("FingerprintScanner error :: ",e)
    }

    createSignature = ()=>{
        console.log("호호호호호호호호")
        FingerprintScanner
        .authenticate(Platform.OS =='ios' ? { description: 'Scan your fingerprint on the device scanner to continue',fallbackEnabled: false } :{description : "Scan your fingerprint on the device scanner to continue",onAttempt:this.androidSignature} )
        .then((resultObject) => {
            
            if(resultObject){
                if(this.state.success){
                    this.state.success()
                }
                    this.props.navigation.goBack()
            }
        })
        .catch((error) => {
            console.log("error.name :: ",error.name)
            console.log(this.state.lockType,"eqweqwewq")
            FingerprintScanner.release()
            if(error.name == "DeviceLockedPermanent"){
                SimpleToast.show(error.message, SimpleToast.SHORT)
                let user = {
                    lockType : "pin"
                }
                store.dispatch({
                    type: 'SET_USER',
                    payload: user,
                });
                this.props.navigation.replace("LockScreen",{mode : 1,type : 'confirm',success : this.state.success})
            }else if(error.name == "UserCancel" && this.state.lockType !="face_id" && this.state.lockType !="biometrics_id"){
                console.log("1st")
                RNExitApp.exitApp()
            }else if(error.name == "AuthenticationFailed"){
                console.log("2nd")
                this.createSignature()   
            }else if(error.name == "SystemCancel"){
                console.log("3rd")
                this.createSignature()
            }else if(error.name == "UserCancel" && this.state.lockType =="face_id"){
                console.log("4th")
                this.createSignature()   
            } else if (error.name == "UserCancel" && this.state.lockType =="biometrics_id") {
                console.log("gkgkgkgk")
                if(this.state.certificationFalse < 3){
                    this.setState({
                        certificationFalse : this.state.certificationFalse+1
                    })
                    this.createSignature()
                }else{
                    let user = {
                        lockType : "pin"
                    }
                    store.dispatch({
                        type: 'SET_USER',
                        payload: user,
                    });
                    this.props.navigation.replace("LockScreen",{mode : 1,type : 'confirm',success:this.state.success})
                }
            }
        });
        
        // let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
        // let payload = epochTimeSeconds + 'some message'
        
        // ReactNativeBiometrics.createSignature({
        //     promptMessage: ' ',
        //     payload: payload
        // })
        // .then((resultObject) => {
        //     const { success, signature } = resultObject
        //     console.log("resultObject",resultObject)
        //     if(success){
        //         if(this.state.success){
        //         this.state.success()
        //         }
        //         this.props.navigation.goBack() 
        //     }else {
        //         RNExitApp.exitApp()
        //     }
        // }).catch((e)=>{
            
        //     if(this.state.lockType == "face_id"){
        //         RNExitApp.exitApp()
        //     }else{
        //         if(e.message.indexOf("-128") <0){
        //             if(this.state.certificationFalse <1){
        //                 this.setState({
        //                     certificationFalse : this.state.certificationFalse+1
        //                 })
        //             }else{
        //                 let user = {
        //                     lockType : "pin"
        //                 }
        //                 store.dispatch({
        //                     type: 'SET_USER',
        //                     payload: user,
        //                 });
        //                 this.props.navigation.replace("LockScreen",{mode : 1,type : 'confirm',success:this.state.success})
        //                 SimpleToast.show('TouchID was disabled in this app. please reset app lock option.', SimpleToast.SHORT)
        //             }
        //         }
        //         if(e.message.indexOf("-128") > 0 && this.state.background){
        //             RNExitApp.exitApp()
        //         }
        //         if(e.message.indexOf("-128") > 0 && this.state.start){
        //             RNExitApp.exitApp()
        //         }
        //         if(e.message.indexOf("Too many attempts.") > 0  && this.state.background){
        //             let user = {
        //                 lockType : "pin"
        //             }
        //             store.dispatch({
        //                 type: 'SET_USER',
        //                 payload: user,
        //             });
        //             this.props.navigation.replace("LockScreen",{mode : 1,type : 'confirm',success:this.state.success})
        //         }
        //         if(e.message.indexOf("Too many attempts.") > 0  && this.state.background){
        //             let user = {
        //                 lockType : "pin"
        //             }
        //             store.dispatch({
        //                 type: 'SET_USER',
        //                 payload: user,
        //             });
        //             this.props.navigation.replace("LockScreen",{mode : 1,type : 'confirm',success:this.state.success})
        //         }
        //     }
        // })
    }


    rederItem = ()=>{
        // const checkHasPinSet = await hasUserSetPinCode()
        if(this.state.lockType =="pin"){
            console.log("this.state.lock",this.state.lock)
            console.log("this.state.success",this.state.success)
            if(this.state.lock == null){
                console.log("this.state.lock",this.state.lock)
                return(
                <PINCode status={'choose'} disableLockScreen touchIDDisabled finishProcess={async(pinCode)=>{ this.onCapture(pinCode)}}/>
                )
            }else if(this.state.lock != null && this.state.type == "change"){
                return (
                    <PINCode status={'enter'} disableLockScreen touchIDDisabled finishProcess={async(pinCode)=>{
                        this.props.navigation.replace("LockScreen",{mode : 0,type : 'create',success:this.state.success})
                    }}/>
                    )
            }else if(this.state.type == "create"){
                return(
                    <PINCode status={'choose'} disableLockScreen touchIDDisabled finishProcess={async(pinCode)=>{ this.onCapture(pinCode)}}/>
                    )
            }else{
                return(
                <PINCode status={'enter'} disableLockScreen touchIDDisabled touchIDDisabled finishProcess={async(pinCode)=>{
                    console.log("finish enter code",pinCode);
                    this.state.success&& this.state.success(),this.props.navigation.goBack()}}/>
                )
            }
        
            
        } else {
            if(Platform.OS !== "ios"){
                return(
                    <View style={{alignItems:'center',flex:1}}>
                        <View style={{position:'absolute',bottom:0,marginBottom:88,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>{this.createSignature()}} >
                                <Image source={Images.fingerprint} style={{width : 65,height:71}}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        }
        // if(this.state.lockType =="pin"){
        //     return(
        //         <RNLockScreen 
        //         type={RNLockScreen.Type.Pin}  
        //         mode={this.state.mode} 
        //         onCapture={lock => {this.onCapture(lock)}}
        //         onVerified={() => {this.onVerified()}}
        //         headerFragmentProps = {this.state.headerFragmentProps}
        //         errorState = {{title:"잘못된 비밀번호 입니다."}}
        //         backgroundImage={{}}
        //         clearLockOnError ={true}
        //         lockFragmentProps={{
        //             style: {
        //             backgroundColor: '#1B2937'
        //             }
        //         }}
        //         pinProps={{
        //             confirmPin:{
        //             title: "ok",
        //             style: {
        //                 color: '#006400'
        //             }
        //             },
        //             rippleProps:{
        //             rippleColor: 'transparent'
        //             },
        //             containerStyle:{
        //             backgroundColor: 'transparent'
        //             },
        //             textStyle:{
        //             fontSize:20,
        //             color: Color.white
        //             },
        //             suggestionStyle: {
        //             color: 'transparent'
        //             },
        //             alphabetPinSuggestion: true
        //         }}
        //         lockLimit = {6}
        //         lock = {this.state.lock}
        //         clearLockOnError={false}
        //         >
        //     </RNLockScreen>
        //     )
        // }
        // else if (this.state.lockType !== "pin"){
        //     if(Platform.OS !== "ios"){
        //         return(
        //             <View style={{alignItems:'center',flex:1}}>
        //                 <View style={{position:'absolute',bottom:0,marginBottom:88,justifyContent:'center',alignItems:'center'}}>
        //                     <TouchableOpacity onPress={()=>{this.createSignature()}} >
        //                         <Image source={Images.fingerprint} style={{width : 65,height:71}}></Image>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View>
        //         )
        //     }
        // }
    }

    handleAppStateChange = nextAppState => {
        this.setState({
            appState :AppState.currentState
        })
    };

    componentDidUpdate(prevProps,prevState){
        if(prevState.appState == "background" && this.state.appState == "active"){
            if(this.state.lockType !== "pin"){
                this.createSignature()
            }
        }
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'#1B2937'}}>
                {this.rederItem()}
           </View>
        );
    }
}

const styles = StyleSheet.create({
   
});


export default LockScreen;
