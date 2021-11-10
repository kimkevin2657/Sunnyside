import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,FlatList,Text, ScrollView, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar'
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import { Switch } from 'react-native-paper';
import { store } from '@redux/store';
import { commonApi } from '@common/ApiConnector';

class PushSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            revenue : false,
            deposit : false,
            notice : false,
            gmcEvent : false,
            inquireMain : false,
            login : false,
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

    onChangeDeposit=(e)=>{
        if(e == true) {
            const param = {
                mb_alarm_trade : 'Y'
            }
            const response = commonApi('patch', `/mypage/onOffPushTrade`,param);
            response.then( ({data}) => {
                this.setState({
                    deposit: true
                })
            }).catch(e => {
                console.log('error:: ',e);
            })
        } else {
            const param = {
                mb_alarm_trade : 'N'
            }
            const response = commonApi('patch', `/mypage/onOffPushTrade`,param);
            response.then( ({data}) => {
                this.setState({
                    deposit: false
                })
            }).catch(e => {
                console.log('error:: ',e);
            })
        }

    }
    onChangeNotice=(e)=>{
        if(e == true) {
            const param = {
                mb_alarm_etc : 'Y'
            }
            const response = commonApi('patch', `/mypage/onOffPushEtc`,param);
            response.then( ({data}) => {
                this.setState({
                    notice: true
                })
            }).catch(e => {
                console.log('error:: ',e);
            })
        } else {
            const param = {
                mb_alarm_etc : 'N'
            }
            const response = commonApi('post', `/mypage/onOffPushEtc`,param);
            response.then( ({data}) => {
                this.setState({
                    notice: false
                })
            }).catch(e => {
                console.log('error:: ',e);
            })
        }
    }
    onChangeLogin=(e)=>{

        if(e == true) {
            const param = {
                mb_alarm_login : 'Y'
            }
            const response = commonApi('post', `/mypage/onOffPushLogin`,param);
            response.then( ({data}) => {
                this.setState({
                    login: true
                })
            }).catch(e => {
                console.log('error:: ',e);
            })
        } else {
            const param = {
                mb_alarm_login : 'N'
            }
            const response = commonApi('post', `/mypage/onOffPushLogin`,param);
            response.then( ({data}) => {
                this.setState({
                    login: false
                })
            }).catch(e => {
                console.log('error:: ',e);
            })
        }
    }

    getBasicInfo() {
        const response = commonApi('post', `/mypage/myInfo`);
        response.then( ({data}) => {
            console.log('info data ::: ',data)
            this.setState({
                notice: data.member.mb_alarm_etc == 'Y' ? true: false,
                deposit: data.member.mb_alarm_trade  == 'Y' ? true: false,
                login: data.member.mb_alarm_login == 'Y' ? true: false
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    getYnState() {

    }

    componentDidMount(){
        this.getBasicInfo()
    }

    render() {
        const propTypes ={
            headerFragmentProps : {
                icon : Images.lock
            }
        }
        // console.log("useLock",this.state.useLock)
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="알림 설정" border></HeaderBar>
                    <ScrollView>
                        <View style={styles.container}>  
                            <View style={styles.cardView}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                    <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>디파이언스 알림 수신</Text>
                                    <Switch value={this.state.notice} color={"#FFD700"} onValueChange={(e)=>{this.onChangeNotice(e)}}></Switch>
                                </View>
                            </View>
                            <View style={styles.cardView}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                    <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>입출금 알림 수신</Text>
                                    <Switch value={this.state.deposit} color={"#FFD700"} onValueChange={(e)=>{this.onChangeDeposit(e)}}></Switch>
                                </View>
                            </View>
                            <View style={styles.cardView}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                    <Text style={[styles.fontSize14,{color:'#4A4A4A'}]}>로그인 알림 수신</Text>
                                    <Switch value={this.state.login} color={"#FFD700"} onValueChange={(e)=>{this.onChangeLogin(e)}}></Switch>
                                </View>
                            </View>
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


export default PushSetting;
