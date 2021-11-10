import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import BottomTab from '../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../components/_gmcCustom/HeaderBar';
import RectangleButton from '../../components/_gmcCustom/RectangleButton';
import { commonApi } from '@common/ApiConnector';
import { store } from '@redux/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import SimpleToast from 'react-native-simple-toast';
import messaging from '@react-native-firebase/messaging';
import Icon from 'react-native-vector-icons/FontAwesome5';


class GmcLoginScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            mbId : "",
            password: "",
            warningEmailForm: false,
            warningPassword: false,
            hidePass: true,
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

    onChangeCountryCode=(value)=>{
        this.setState({
            countryCode : value,
            showModal : false
        })
    }

    onlogin = async () => {
        const fcmToken = await messaging().getToken()
        console.log('fm', fcmToken)
        if (!Util.isValidEmail(this.state.mbId)) {
            return SimpleToast.show('Invalid email format.', SimpleToast.SHORT);
        }
        if (!Util.passwordTest2(this.state.password)) {
            return  SimpleToast.show('You must use 8 to 15 digits of the combination of numbers, alphabetic and special characters.', SimpleToast.SHORT);
        }
        this.state.warningPassword = false
        let params = {
            mb_id : this.state.mbId,
            password : this.state.password,
            agent_os : Platform.OS === 'ios' ? 'ios' : 'android',
            agent_token : fcmToken
        }

        const response = commonApi('post',`/auth/open/loginUser`,params)
        response.then((result) => {
            console.log("result",result)
            if(result.data !=null) {
                let user = {
                    accessToken: result.data.accessToken,
                }
                store.dispatch({
                    type: 'SET_USER',
                    payload: user,
                });
                this.secondLogin()
            }else{
                console.log("error :: ",result)
                return SimpleToast.show('Invalid ID / Password.', SimpleToast.SHORT);
            }    
        }).catch((e)=>{
            SimpleToast.show('connection defuse. try again.', SimpleToast.SHORT)
            console.log("에러",e)
        })
    }

    secondLogin=()=>{
        console.log("second login start")
        let params = {
            se_num: '1111'
        }
        const secondLogin = commonApi('post','/auth/open/checkSeNum',params);
        secondLogin.then((result)=>{
            
            if(result.data != null){
                let user = {
                    uid : this.state.mbId,
                    accessToken : result.data.accessToken,
                    refreshToken : result.data.refreshToken
                }
                store.dispatch({
                    type: 'SET_USER',
                    payload: user,
                });
                console.log("result",result)
                this.props.navigation.push("WalletMain")
            }else {
                console.log("result",result)
            }
        }).catch((e)=>{
            console.log(e)
        })
    }
    
    render() {
        

        return (
            <>
            <SafeAreaView style={[Styles.Wrap, {}]}>
                {/* <HeaderBar noLeftBtn title="로그인"></HeaderBar> */}
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0} contentInset={{bottom :0}}>
                    <ScrollView style={Styles.ScrollContainer}>
                    <View style={styles.container}>
                        <View style={styles.titleView}>
                                <Text style={styles.login}>Login</Text>
                        </View>
                        <View style={{marginTop:67,borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                            <TextInput style={[styles.fontSize14,{padding:0,height:50, color:'black'}]} onChangeText={(e)=>{this.setState({mbId:e})}} placeholder="Email" placeholderTextColor={Color.textGray}></TextInput>
                        </View>

                        <View style={{marginTop:30,borderWidth:1,borderColor:"#D7D6D6",flexDirection:'row',paddingHorizontal:17}}>
                            <TextInput secureTextEntry={this.state.hidePass ? true : false} style={[styles.fontSize14,{flex:9,padding:0,height:50,color:'black'}]} onChangeText={(e)=>{this.setState({password:e})}} placeholder="Password" placeholderTextColor={Color.textGray}></TextInput>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Icon
                                
                                name={this.state.hidePass ? 'eye-slash' : 'eye'}
                                size={15}
                                color="grey"
                                onPress={() => {
                                    this.setState({
                                        hidePass: !this.state.hidePass
                                    })
                                }}
                                />
                            </View>
                            
                        </View>

                        <View style={{marginTop:36}}>
                            <RectangleButton style={{height:52, borderRadius:10}} disable={this.state.mbId ==="" || this.state.password ===""} title={"Sign in"} onPress={()=>{this.onlogin()}}></RectangleButton>
                        </View>
                        
                        <View style={{marginTop:18}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("GmcSingUpScreen")}}>
                                    <Text style={[styles.fontSize16,{color:'#1B2937'}]}>Sing up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("FindUserIdMain")}}>
                                    <Text style={[styles.fontSize16]}>Forgot your ID / Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                    </KeyboardAwareScrollView>
                    <BottomTab navigation={this.props.navigation} />

            </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20
    },
    titleView: {
        paddingTop: 40,
        
    },
    login: {
        textAlign:'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'400'
    },  
    fontSize16:{
        fontSize:16,
        lineHeight:20,
        fontWeight:'400'
    },
});


export default GmcLoginScreen;
