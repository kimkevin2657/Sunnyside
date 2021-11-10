import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput, ImageStore, FlatList } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import RectangleButton from '../../../components/_gmcCustom/RectangleButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { commonApi } from '@common/ApiConnector';
import { store } from '@redux/store';
import ReactNativeBiometrics from 'react-native-biometrics'
import SimpleToast from 'react-native-simple-toast';

class FindUserPwMain extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            countryCode : "대한민국 +82",
            modalShow : false,
            lock : store.getState().user.pinPassword || null,
            countryCodeList : [
                {label : "대한민국 +82",value : "대한민국 +82"},
                {label : "미국 +82",value : "미국 +82"},
                {label : "태국 +82",value : "태국 +82"},
                {label : "중국 +82",value : "중국 +82"},
                {label : "인도 +82",value : "인도 +82"},
                {label : "일본 +82",value : "일본 +82"},
                {label : "러시아 +82",value : "러시아 +82"},
            ],
            mbEmail : "",
            mbCfCode : "",
            lockType : store.getState().user.lockType || "pin",
        }
    }

    onChangeEmail = (e)=>{
        this.setState({
            mbEmail : e
        })
    }

    findPw=()=>{
        let params = {
            // mbName : this.state.mbName,
            // mbPhone : this.state.mbPhone,
            // mb_cf_code : this.state.mbCfCode,
            mbEmail : this.state.mbEmail,
            process : "findPw"
        } 

        // let resultId = "test@test.kr"
        // console.log("params :: ",params)

        this.props.navigation.navigate("IamportMain",{certData : params})
    }


    // createSignature = ()=>{
    //     let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    //     let payload = epochTimeSeconds + 'some message'
        
    //     ReactNativeBiometrics.createSignature({
    //         promptMessage: ' ',
    //         payload: payload
    //     })
    //     .then((resultObject) => {
    //         const { success, signature } = resultObject
    //         if(success){
    //             this.cfSuccess()
    //         }
    //     }).catch((e)=>{
    //         if(e.message.indexOf("-128") < 0 || this.state.lockType == "face_id"){
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
    //                 this.props.navigation.navigate("LockScreen",{mode : 1,type : 'confirm',success : this.cfSuccess})
    //                 if(this.state.lockType !== "face_id"){
    //                     SimpleToast.show('Touch ID 가 잠금이 되었습니다. 설정에서 해제 후 다시 시도해주세요.', SimpleToast.SHORT)
    //                 }
    //             }
    //         }
    //     })
    // }
    //
    // cfSuccess=()=>{
    //     let params ={
    //         cert_type : this.state.lockType,
    //         cert_cause : "비밀번호 인증",
    //         cert_date : new Date()
    //     }

    //     console.log("params",params)
    //     this.props.navigation.navigate("FindUserPwChange",{mbEmail : this.state.mbEmail})
    //     SimpleToast.show('정상 처리 되었습니다.', SimpleToast.SHORT)
    // }

    // cfOnPress=()=>{
    //     if(this.state.lock !=="" && this.state.lock !== null){
    //         if( this.state.lockType =="pin"){
    //             this.props.navigation.navigate("LockScreen",{mode : 1,type : 'confirm',success : this.cfSuccess})
    //         }else {
    //             this.createSignature()
    //         }
    //     }else{
    //         Alert.alert('',"마이페이지에서 앱 잠금 설정 후 다시 시도해주세요.", [
    //             { text: "확인", onPress: () => false }
    //         ]);
    //     }
    // }

    render() {
        

        return (
            <SafeAreaView style={[Styles.Wrap, {}]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Find your password"></HeaderBar>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0} >
                    <ScrollView style={Styles.ScrollContainer}>
                        <View style={styles.container}>
                            <View style={{marginTop:67,justifyContent:'center',alignItems:'center'}}>
                                <Image source={Images.pwSequence_1} style={{width:192,height:30,resizeMode:"contain"}}></Image>
                            </View>
                            <View style={{marginTop:67}}>
                                <Text style={styles.fontSize16}>Please fill in the email address that you used for registering. Click the ‘Send auth Email’ button and proceed to the next.</Text>
                            </View>

                            <View style={{marginTop:23}}>
                                <View style={{borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                    <TextInput style={[styles.fontSize14,{padding:0,height:50}]} value={this.state.mbEmail} onChangeText={(e)=>{this.onChangeEmail(e)}} placeholder="이메일" placeholderTextColor={Color.textGray}></TextInput>
                                </View>
                            </View>

                            <View style={{marginTop:58,}}>
                                <RectangleButton style={{height:53}} title={"Send Auth Email"} onPress={()=>{this.findPw()}} disable={this.state.mbEmail == ""}></RectangleButton>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'400'
    },
    fontSize13:{
        fontSize:13,
        lineHeight:15,
        fontWeight:'400'
    },  
    fontSize16:{
        fontSize:16,
        lineHeight:20,
        fontWeight:'400'
    },
    warnText:{
        fontSize:11,
        lineHeight:13,
        fontWeight:'400',
        color:"#FF0000"
    },
    pickerTextStyle : {
        fontSize:14,
        lineHeight:17,
        fontWeight:'400',
        color:'#606060'
    },
    phoneView:{
        borderWidth:1,
        borderColor:"#D7D6D6",
        flex:1,
        paddingHorizontal:13,
        height:52,
        flexDirection:'row',
        justifyContent:'center',
        marginRight:10
    },
    checkBox:{
        width:15,
        height:15,
        marginRight: 10
    },
    modalView :{
        alignItems:'center',
        position: 'absolute',
        width: '100%',
        bottom : 0,
        height:200,
        backgroundColor : Color.white
    },
    modal:{
        alignItems:'center',
        width : '100%',
        margin : 0,
        padding :0,
    },
});


export default FindUserPwMain;
