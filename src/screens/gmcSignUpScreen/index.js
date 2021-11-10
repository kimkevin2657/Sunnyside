import React from 'react';
import {  View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput, ImageStore, FlatList } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import BottomTab from '../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../components/_gmcCustom/HeaderBar';
import RectangleButton from '../../components/_gmcCustom/RectangleButton';
import PickerCustom from '../../components/_gmcCustom/PickerCustom'
/* 아임포트 모듈을 불러옵니다. */
import IMP from 'iamport-react-native';
import Loading from '../iamportScreen/iamportLoading'

import ModalPicker from '../../components/_gmcCustom/ModalPicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';
import { commonApi } from '@common/ApiConnector';
import Modal from 'react-native-modal';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SimpleToast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
class GmcSingUpScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            carrierCode : "KT",
            modalShow : false,
            carrierArray : [
                { label: 'KT', value: 'KT' },
                { label: 'SKT', value: 'SKT' },
                { label: 'LGT', value: 'LGT' },
                { label: '알뜰폰', value: 'MVNO' },
            ],
            mbId : "",
            mbPassword : "",
            mbPasswordSecond : "",
            mbName : "",
            mbTradePassword:"1111",
            mbCfCode : "",
            mbPhone : "",
            mbMarketingUseYn:"N",
            process: "signUp",
            mbIdCheck: true,
            mbIdReg:false,
            mbPasswordCheck:true,
            mbPasswordSecondCheck : true,
            termsCheck : false ,
            ageCheck: false,
            successValue: {
                email: false,
                phone:false,
            },
            isSignUp: true,
            IamModalShow:false,
            phoneInfo: {
                birthday: '',
                carrier: '',
                name: '',
                phone: ''
            },
            iamData: {}
        }
    }

    onChangeMbId = (e) => {
        this.setState({
            mbIdReg: false,
            successValue: {
                ...this.state.successValue,
                email: false
            }
        })
        if (e.length > 0) {
            if (Util.isValidEmail(e)) {
                    this.setState({
                        mbIdReg : true,
                    })
            } else {
                this.setState({
                    mbIdReg: false,
                })
            }
        }
        this.setState({
            mbId: e,
        })
    }

    onChangeMbName = (e)=>{
        this.setState({
            mbName : e
        })
    }

    onChangeMbPhone = (e)=>{
        this.setState({
            mbPhone : e
        })
    }

    onChangeMbPassword = (e)=>{
        let regex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        let newMbPasswordCheck = "";
        let newMbPasswordSecondCheck =true;
        if(e.length > 0){
            newMbPasswordCheck = e.match(regex)
            if(this.state.mbPasswordSecond !==""){
                newMbPasswordSecondCheck = this.state.mbPasswordSecond == e ? true : false
            }
            this.setState({
                mbPassword: e,
                mbPasswordCheck: newMbPasswordCheck == null ? false : true,
                mbPasswordSecondCheck: newMbPasswordSecondCheck,
            })
        } else {
            this.setState({
                mbPassword: '',
                mbPasswordCheck: false,
                mbPasswordSecondCheck: false,
            })
        }
        
    }

    onChangeMbPasswordSecond = (e) => {
        let newMbPasswordSecondCheck = true;
        if(e.length > 0 && this.state.mbPassword !==""){
            newMbPasswordSecondCheck = this.state.mbPassword == e ? true : false

            this.setState({
            mbPasswordSecond : e,
            mbPasswordSecondCheck : newMbPasswordSecondCheck,
            })
        } else {
            this.setState({
            mbPasswordSecond:'',
            mbPasswordSecondCheck : false,
            })
        }
        
    }

    onChangeMbCfCode = (e)=>{
        this.setState({
            mbCfCode : e
        })
    }
    handleAllChk = () => {
        const { termsCheck, ageCheck, mbMarketingUseYn } = this.state;
        let marketingChk = mbMarketingUseYn == "Y" ? true : false;
        if (termsCheck && ageCheck && marketingChk) {
            this.setState({ termsCheck: false, ageCheck: false, mbMarketingUseYn: "N" })
        } else {
            this.setState({ termsCheck: true, ageCheck: true, mbMarketingUseYn: "Y" })

        }
    }
    handleClickCertification = () => {
        this.startCertification();
    }
    startCertification = () => {
        /* 가맹점 식별코드 */
        const userCode = 'imp30018661';
        const data = {
            merchant_uid: `mid_${new Date().getTime()}`,  // 주문번호
            carrier: this.state.carrierCode,
            phone: this.state.mbPhone,
        };
        this.setState({
            iamData:data
        })
        this.setState({
            IamModalShow:true
        })
        // <IMP.Certification
        //     userCode={userCode}  // 가맹점 식별코드
        //     //   tierCode={'ABC'}      // 티어 코드: agency 기능 사용자에 한함
        //     loading={<Loading />} // 웹뷰 로딩 컴포넌트
        //     data={data}           // 본인인증 데이터
        //     callback={response => this.callBack(response)}
        // />
        // const { IMP } = window;
        // IMP.init(userCode);
        // IMP.certification(data, callback);
        // this.props.navigation.navigate("IamportMain", { certData: data })
    }
    /* 본인인증 후 콜백함수 */
    callback = (response) => {
        console.log(response,'188')

        const { success, error_code, error_msg, imp_uid, merchant_uid, pg_provider, pg_type } = response;

        const params = {
            imp_uid, //imp_619801221355
            merchant_uid, //mid_1624258800604
            success, // true
            process: 'signUp', // signUp (회원가입 휴대폰인증), userCert(본인인증)
            error_code,
            error_msg,
            pg_provider,
            pg_type,
            mb_id: this.state.mbId, // dkkim@upchain.kr
            mb_password: this.state.mbPassword, // 1qaz2wsx#EDC
            // mb_Name: name, // 김동균
            mb_trade_password: "1111",
            mb_cf_code: this.state.mbCfCode, // "" (추천인코드 공백가능)
            mb_marketing_use_yn: this.state.mbMarketingUseYn, // Y
        }
        console.log(params, '189');

        const rs = commonApi('post', '/member/open/securityProcDanalHistory', params);
        rs.then(({ data }) => {
            console.log('휴대폰 인증 데이타', data)
            if (params.success) {
                // insertUser();
                this.setState({
                    phoneInfo: {
                        ...this.state.phoneInfo,
                        birthday: data.birthday,
                        carrier: data.carrier,
                        name: data.name,
                        phone: data.phone
                    }
                })
                SimpleToast.show('Mobile phone authentication complete', SimpleToast.LONG);
                
                this.setState({
                    successValue: {
                        ...this.state.successValue,
                        phone: true,
                    }
                })
                this.setState({
                    IamModalShow: false,
                })
            } else {
                SimpleToast.show('Mobile authentication failed. Please try again later.', SimpleToast.LONG);
            }
        })
            .catch(e => {
                SimpleToast.show('connection defuse. try again.', SimpleToast.SHORT)
                console.log(e)
            });
    }

    hanldeSamEmailChk = (email) => {
        const param = {
            mb_id: email
        }
        const respopnse = commonApi('post', '/member/open/emailDuplication', param);
        respopnse.then((result) => {
            console.log(result)
            if (result.success) {
                this.setState({
                    mbIdCheck: true,
                    successValue: {
                        ...this.state.successValue,
                        email : true
                    }
                })
                SimpleToast.show('This email is available.')
            } else {
                this.setState({
                    mbIdCheck: false,
                    successValue: {
                        ...this.state.successValue,
                        email: false
                    }
                })
            }
        })
            .catch((e) => {
                SimpleToast.show('connection defuse. try again.', SimpleToast.SHORT)
                console.log("에러",e)
            })
    }

    submit=()=>{
        let params = {
            mb_id : this.state.mbId,
            mb_password: this.state.mbPassword,
            mb_trade_password: "1111",
            mb_cf_code : this.state.mbCfCode,
            name: this.state.phoneInfo.name,
            birthday: this.state.phoneInfo.birthday,
            phone :this.state.phoneInfo.phone,
            carrier : this.state.carrierCode,
            mb_marketing_use_yn : this.state.mbMarketingUseYn,
        } 

        const response = commonApi('put', '/auth/open/addUser', params);
        response.then(({ data }) => {
            console.log('adduser', data)
            if (data.success) {
                    Alert.alert('Welcome to the Defiance Wallet!\n', "Authentication has been sent to the email address you joined.\n\nOnce you've completed your e-mail verification,\n\nYou can use the Defiance Wallet Service.", [
                        {
                            text: 'go to Login',
                            onPress: () => this.props.navigation.replace('GmcLoginScreen')
                        }
                    ])
            } else {
                if (data.code == 2005) {
                    return SimpleToast.SHORT('You are already a member.', SimpleToast.SHORT)
                } else {
                    return SimpleToastl.SHORT('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
                }
            }
        })
            .catch(e => {
                return swal('connection defuse. try again', SimpleToast.SHORT)
            })
        console.log("params :: ",params)
    }

    componentDidUpdate(prevProps, prevState) {
        // if()
        const { mbPasswordSecondCheck, mbPasswordCheck, mbIdCheck, successValue, name, termsCheck, ageCheck } = this.state;
            if (mbPasswordSecondCheck && mbPasswordCheck && successValue.email && successValue.phone && termsCheck && ageCheck) {
                this.setState({
                    isSignUp: false
                })
            }
        }
    componentDidMount() {
        
    }
    render() {
        

        return (
            <SafeAreaView style={[Styles.Wrap, {}]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Sign up"></HeaderBar>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0}>
                    <ScrollView style={Styles.ScrollContainer}>
                    <View style={styles.container}>
                        <View style={{marginTop:7,justifyContent:'center',alignItems:'center'}}>
                            <Image source={Images.signUp} style={{height:120,resizeMode:'contain'}}></Image>
                        </View>

                        <View style={{marginTop:22}}>
                            <Text style={[styles.fontSize16,{}]}>After filling in the member information below, a verification confirmation will be sent through the email you entered. </Text>
                            <Text style={[styles.fontSize16,{fontWeight:'700'}]}>You may start using DFians Wallet service normally when your email verification is completed.</Text>
                        </View>
                        
                        <View style={{marginTop:23}}>
                            <View style={{justifyContent:'space-between',flexDirection:'row', }}>
                                    <TextInput style={[styles.fontSize14, { paddingHorizontal: 17, flexGrow: 1, height: 50, borderWidth: 1, borderColor: !this.state.mbIdCheck  ?"#FF0000" : "#D7D6D6",}]} value={this.state.mbId} onChangeText={(e) => { this.onChangeMbId(e) }} placeholder="Email" placeholderTextColor={Color.textGray}></TextInput>
                                    <RectangleButton disable={!this.state.mbIdReg || this.state.successValue.email} style={{ height: 50, marginLeft: 10, paddingHorizontal: 10 }} center title={'Email\nCheck'} onPress={() => { this.hanldeSamEmailChk(this.state.mbId) }} />
                            </View>
                            <View style={{marginTop:3}}>
                                {!this.state.mbIdCheck &&
                                    <Text style={styles.warnText}>The email you entered is already in use.</Text>
                                }
                            </View>
                        </View>

                        <View style={{marginTop:30}}>
                                <View style={{ borderWidth: 1, borderColor: !this.state.mbPasswordCheck ?"#FF0000":"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                <TextInput secureTextEntry={true} style={[styles.fontSize14,{padding:0,height:50}]} value={this.state.mbPassword} onChangeText={(e)=>{this.onChangeMbPassword(e)}} placeholder="Password" placeholderTextColor={Color.textGray}></TextInput>
                            </View>
                            <View style={{marginTop:3}}>
                                {!this.state.mbPasswordCheck &&
                                    <Text style={styles.warnText}>Your password must be at least 8-15 digits and includes uppercase English letters, lowercase letters, numbers, and special characters (~!@#$%^*).</Text>
                                }
                            </View>
                        </View>

                        <View style={{marginTop:30}}>
                                <View style={{ borderWidth: 1, borderColor: this.state.mbPassword !== "" && !this.state.mbPasswordSecondCheck  ? "#FF0000" : "#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                <TextInput secureTextEntry={true} style={[styles.fontSize14,{padding:0,height:50}]} value={this.state.mbPasswordSecond} onChangeText={(e)=>{this.onChangeMbPasswordSecond(e)}} placeholder="Confirmed password" placeholderTextColor={Color.textGray}></TextInput>
                            </View>
                            <View style={{marginTop:3}}>
                                {this.state.mbPassword !=="" && !this.state.mbPasswordSecondCheck &&
                                    <Text style={styles.warnText}>The confirmed password does not match with the password.</Text>
                                }
                            </View>
                        </View>

                        <View style={{marginTop:38}}>
                            <Text style={[styles.fontSize14,{color:"#606060"}]}>Mobile phone identification</Text>

                            {/* <View style={{borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                <TextInput style={[styles.fontSize14,{padding:0,height:50}]} value={this.state.mbName} onChangeText={(e)=>{this.onChangeMbName(e)}} placeholder="Name" placeholderTextColor={Color.textGray}></TextInput>
                            </View> */}
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:4,}}>
                                <View style={styles.phoneView}>
                                    <PickerCustom disabled={this.state.successValue.phone} pickerTextStyle={styles.pickerTextStyle} selected={this.state.carrierCode == 'MVNO' ? '알뜰폰' : this.state.carrierCode} onPress={()=>{this.setState({modalShow : true})}}></PickerCustom>
                                    <TextInput editable={!this.state.successValue.phone}  style={{ flex: 1, marginLeft: 10 }} value={this.state.mbPhone} onChangeText={(e) => { this.onChangeMbPhone(e) }} placeholder="Please enter your phone number without -." keyboardType="number-pad" placeholderTextColor={Color.textGray}></TextInput>
                                </View>
                                    <RectangleButton style={{paddingHorizontal:10, height:50}}center  disable={this.state.mbPhone.length < 9 || this.state.successValue.phone} onPress={() => this.handleClickCertification()} title={this.state.successValue.phone ? 'complete' : 'To \nauthenticate'}></RectangleButton>
                            </View>
                        </View>

                        <View style={{marginTop:21}}>
                            <View style={{borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                <TextInput style={[styles.fontSize14,{padding:0,height:50}]} placeholder="(Optional) Referral code" onChangeText={(e)=>this.onChangeMbCfCode(e)} placeholderTextColor={Color.textGray}></TextInput>
                            </View>
                        </View>

                        <View style={{ marginTop: 47, flex: 1 }}>
                            <View style={{ flexDirection: 'row' ,alignItems:'center'}}>
                                    <CheckBox ref={(ref) => this.checkBoxRef = ref} style={Platform.OS == "ios" ? styles.checkBox : null} value={this.state.termsCheck && this.state.ageCheck && this.state.mbMarketingUseYn == "Y" ? true : false} onValueChange={(e) => { this.handleAllChk(e)}}></CheckBox>
                                    <TouchableOpacity onPress={() => {this.handleAllChk() }}  style={{ flex: 1 }}>
                                    <Text la style={[styles.fontSize13, {}]}>All agree</Text>
                                </TouchableOpacity>
                            </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:15}}>
                                <CheckBox style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.termsCheck} onValueChange={(e)=>{this.setState({termsCheck : e})}}></CheckBox>
                                    <TouchableOpacity onPress={() => this.setState({termsCheck : !this.state.termsCheck})} style={{flex:1}}>
                                    <Text style={[styles.fontSize13,{}]}>I confirm to read and agree to<Text style={[styles.fontSize13,{textDecorationLine:'underline'}]}>the terms of service</Text> and <Text style={[styles.fontSize13,{textDecorationLine:'underline'}]}>privacy policy.</Text> </Text>
                                </TouchableOpacity>
                            </View>
                                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center'}}>
                                <CheckBox style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.ageCheck} onValueChange={(e)=>{this.setState({ageCheck : e})}}></CheckBox>
                                <TouchableOpacity onPress={() => this.setState({ ageCheck: !this.state.ageCheck })} style={{flex:1}}>
                                    <Text style={[styles.fontSize13,{}]}>I am over 18 years of age.</Text>
                                </TouchableOpacity>
                            </View>
                                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center'}}>
                                <CheckBox style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.mbMarketingUseYn == "Y" ? true : false} onValueChange={(e)=>{this.setState({mbMarketingUseYn : e? "Y":"N"})}}></CheckBox>
                                    <TouchableOpacity onPress={() => this.setState({ mbMarketingUseYn: this.state.mbMarketingUseYn=="Y" ? "N" : "Y"  })} style={{flex:1}}>
                                    <Text style={[styles.fontSize13,{}]}>(Optional)I agree to receive further promotion, offers, and communication from DFians Wallet.</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={{marginTop:58,marginBottom:44}}>
                                <RectangleButton style={{ height: 53 }} disable={this.state.isSignUp} title={"SIGN UP"} onPress={()=>{this.submit()}}></RectangleButton>
                        </View>
                    </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <BottomTab navigation={this.props.navigation} />
                <Modal
                    style={{width:'100%',height: '100%',paddingVertical:50,margin:0}}
                    isVisible={this.state.IamModalShow}
                    onBackButtonPress={() => { this.setState({ IamModalShow: false })}}
                    onBackdropPress={() => { this.setState({ IamModalShow: false }) }}
                    backdropOpacity={0.5}
                    backgroundColor={'black'}
                // backdropColor = {'red'}
                >
                    <IMP.Certification
                            userCode={'imp30018661'}  // 가맹점 식별코드
                            //   tierCode={'ABC'}      // 티어 코드: agency 기능 사용자에 한함
                            loading={<Loading />} // 웹뷰 로딩 컴포넌트
                            data={this.state.iamData}           // 본인인증 데이터
                            callback={response => {
                                if (!response.success) {
                                    if (response.error_code == "F0000") {
                                        SimpleToast.show('Authentication canceled by user.', SimpleToast.SHORT),
                                        this.setState({ IamModalShow: false })
                                    } else {
                                        SimpleToast.show(response.error_code, SimpleToast.SHORT),
                                            this.setState({ IamModalShow: false })
                                    }
                                } else {
                                    this.callback(response)
                                }
                                console.log(response)
                            }}
                            />
                </Modal>
                <Modal
                    style={styles.modal}
                    isVisible={this.state.modalShow}
                    onBackdropPress={() => { this.setState({ modalShow: false }) }}
                    onBackButtonPress={() => { this.setState({ modalShow: false })}}
                    backdropOpacity={0.5}
                    // backdropColor = {'red'}
                >
                    <View style={styles.modalView}>
                        <View style={{height:50,width:'100%',padding:10,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',borderBottomWidth:1,borderColor:"#D7D6D6"}}>
                                {/* <Text style={[styles.fontSize16,{fontWeight:'600'}]}>country code</Text> */}
                                <TouchableOpacity onPress={()=>{this.setState({modalShow:false})}}>
                                    <Text style={styles.fontSize14}>Cancel</Text>
                                </TouchableOpacity>
                        </View>
                        <View style={{marginTop:20,width:"100%"}}>
                            <FlatList
                                data={this.state.carrierArray}
                                style={{maxHeight:100}}
                                renderItem={({item})=>
                                    <TouchableOpacity style={{width:"100%",}} onPress={()=>{this.setState({carrierCode : item.value,modalShow:false})}}>
                                        <View style={{paddingVertical:10,paddingHorizontal:10,alignItems:'center'}}>
                                            <Text style={styles.fontSize14}>{item.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={(item, index) => `${index}`}
                            />
                        </View>
                    </View>
                </Modal>
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
        lineHeight: 17,
        fontWeight:'400',
        color:'#606060'
    },
    phoneView:{
        borderWidth:1,
        borderColor:"#D7D6D6",
        flex:1,
        paddingHorizontal: 13,
        marginRight: 10,
        height:52,
        flexDirection:'row',
        justifyContent:'center',
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


export default GmcSingUpScreen;
