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

class FindUserPwChange extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            mbEmail : this.props.navigation.getParam('mbEmail'),
            mbPassword : "",
            mbPasswordSecond : "",
            mbPasswordCheck:true,
            mbPasswordSecondCheck : true,
        }
    }


    onChangeMbPassword = (e)=>{
        let regex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        let newMbPasswordCheck = "";
        let newMbPasswordSecondCheck =true;
        if(e){
            newMbPasswordCheck = e.match(regex)
            if(this.state.mbPasswordSecond !==""){
                newMbPasswordSecondCheck = this.state.mbPasswordSecond == e ? true : false
            }
        }
        this.setState({
            mbPassword : e,
            mbPasswordCheck : newMbPasswordCheck == null ? false : true,
            mbPasswordSecondCheck : newMbPasswordSecondCheck,
        })
    }

    onChangeMbPasswordSecond = (e)=>{
        if(e && this.state.mbPassword !==""){
            newMbPasswordSecondCheck = this.state.mbPassword == e ? true : false
        }
        this.setState({
            mbPasswordSecond : e,
            mbPasswordSecondCheck : newMbPasswordSecondCheck,
        })
    }

    userPwChange=()=>{
        this.props.navigation.navigate("FindUserPwComplet",{mbEmail:this.state.mbEmail})
    }


    render() {
        

        return (
            <SafeAreaView style={[Styles.Wrap, {}]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="비밀번호 찾기"></HeaderBar>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0}>
                    <ScrollView style={Styles.ScrollContainer}>
                        <View style={styles.container}>
                            <View style={{marginTop:67,justifyContent:'center',alignItems:'center'}}>
                                <Image source={Images.pwSequence_2} style={{width:192,height:30,resizeMode:"contain"}}></Image>
                            </View>
                            <View style={{marginTop:67}}>
                                <Text style={styles.fontSize16}>변경하실 비밀번호를 입력해주세요.</Text>
                            </View>

                            <View style={{marginTop:30}}>
                                <View style={{borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                    <TextInput secureTextEntry={true} style={[styles.fontSize14,{padding:0,height:50}]} value={this.state.mbPassword} onChangeText={(e)=>{this.onChangeMbPassword(e)}} placeholder="비밀번호" placeholderTextColor={Color.textGray}></TextInput>
                                </View>
                                <View style={{marginTop:3}}>
                                    {!this.state.mbPasswordCheck &&
                                        <Text style={styles.warnText}>숫자와 영문자와 특수문자 조합으로 8~15자리를 사용해야 합니다.</Text>
                                    }
                                </View>
                            </View>

                            <View style={{marginTop:30}}>
                                <View style={{borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                    <TextInput secureTextEntry={true} style={[styles.fontSize14,{padding:0,height:50}]} value={this.state.mbPasswordSecond} onChangeText={(e)=>{this.onChangeMbPasswordSecond(e)}} placeholder="비밀번호 확인" placeholderTextColor={Color.textGray}></TextInput>
                                </View>
                                <View style={{marginTop:3}}>
                                    {this.state.mbPassword !=="" && !this.state.mbPasswordSecondCheck &&
                                        <Text style={styles.warnText}>패스워드가 일치하지 않습니다.</Text>
                                    }
                                </View>
                            </View>


                            <View style={{marginTop:58,}}>
                                <RectangleButton style={{height:53}} title={"확인"} disable={this.state.mbPassword =="" || this.state.mbPasswordSecond == "" || !this.state.mbPasswordSecondCheck || !this.state.mbPasswordCheck} onPress={()=>{this.userPwChange()}}></RectangleButton>
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


export default FindUserPwChange;
