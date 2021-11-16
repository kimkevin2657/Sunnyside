import React from 'react';
import {  View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput, ImageStore, FlatList } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';

/* 아임포트 모듈을 불러옵니다. */

import {ButtonGradient, ButtonSecundary} from '@components';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';
import SimpleToast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer';
class TermsScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            mbMarketingUseYn:"N",
            termsCheck : false ,
            personalCheck: false,
            locationCheck: false,
        }
    }

    handleAllChk = () => {
        const { termsCheck, personalCheck, locationCheck, mbMarketingUseYn } = this.state;
        let marketingChk = mbMarketingUseYn == "Y" ? true : false;
        if (termsCheck && personalCheck && locationCheck && marketingChk) {
            this.setState({ termsCheck: false, personalCheck: false, locationCheck: false, mbMarketingUseYn: "N" })
        } else {
            this.setState({ termsCheck: true, personalCheck: true, locationCheck: true, mbMarketingUseYn: "Y" })

        }
    }

    handleClickCertification = () => {
        this.startCertification();
    }

    onLoginPressHandle = () => {
        const {termsCheck, personalCheck, locationCheck} = this.state

        if(termsCheck === false || personalCheck === false || locationCheck === false) {
            SimpleToast.show('필수 항목에 동의해주세요.', SimpleToast.BOTTOM)
            return
        }

        this.props.navigation.navigate('SignUpScreen')
    }
    

    render() {
        

        return (
            <SafeAreaView style={[Styles.Wrap, {}]}>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0}>
                    <ScrollView style={Styles.ScrollContainer}>
                        <View style={styles.container}>
                            <View style={styles.logoImageContainer}>
                                <Image style={styles.logoImage} source={Images.sunnysideLogo} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <CheckBox tintColors={{true: '#FF843A'}} ref={(ref) => this.checkBoxRef = ref} style={Platform.OS == "ios" ? styles.checkBox : null} value={this.state.termsCheck && this.state.personalCheck && this.state.locationCheck && this.state.mbMarketingUseYn == "Y" ? true : false} onValueChange={(e) => { this.handleAllChk(e)}} />
                                <TouchableOpacity onPress={() => {this.handleAllChk() }}  style={{ flex: 1 }}>
                                    <Text style={[styles.fontSize16,{}]}>써니큐 이용약관, 개인정보 수집 및 이용, 위치정보 이용약관(선택), 프로모션 정보 수신(선택)에 모두 동의합니다. </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 47, flex: 1 }}>
                                <View style={{ flexDirection: 'row' ,alignItems:'center', justifyContent: 'center'}}>
                                    <CheckBox tintColors={{true: '#FF843A'}} style={Platform.OS == "ios" ? styles.checkBox : null} value={this.state.termsCheck} onValueChange={(e)=>{this.setState({termsCheck : e})}} />
                                    <TouchableOpacity onPress={() => {this.setState({termsCheck: !this.state.termsCheck}) }}  style={{ flex: 1 }}>
                                        <Text la style={[styles.fontSize16, {}]}>써니큐 서비스 이용약관 동의 <Text style={[styles.fontSize13, {color: '#FF843A'}]}>(필수)</Text></Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.termsContainer} nestedScrollEnabled={true} scrollEnabled={true}>
                                    <Text>
                                        써니큐 서비스 및 제품(이하 ‘서비스’)을 이 용해 주셔서 감사합니다. 본 약관은 다양한 써니큐 서비스의 이용과 관련하여 써니큐 서비스를 제공하는 써니사이드 주식회사와 이를 이용하는 써니큐 서비스 회원(이하 ‘회원’) 또는 비회원과의 관계를 설명하며, 아울러 여러분의 써니큐 서비스 이용에 도움이 될 수 있는 유익한 정보를 포함하고 있습니다.
                                    </Text>
                                </ScrollView>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:15, justifyContent: 'center'}}>
                                    <CheckBox tintColors={{true: '#FF843A'}} style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.personalCheck} onValueChange={(e)=>{this.setState({personalCheck : e})}} />
                                    <TouchableOpacity onPress={() => this.setState({personalCheck : !this.state.personalCheck})} style={{flex:1}}>
                                        <Text style={[styles.fontSize16,{}]}>개인정보 및 민감정보 처리방침 약관 동의 <Text style={[styles.fontSize13, {color: '#FF843A'}]}>(필수)</Text></Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.termsContainer} nestedScrollEnabled={true} scrollEnabled={true}>
                                    <Text>
                                        개인정보보호법에 따라 써이큐 회원가입 신청하시는 분께 수집하는 개인정보의  개인 정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
                                    </Text>
                                </ScrollView>
                                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                                    <CheckBox tintColors={{true: '#FF843A'}} style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.locationCheck} onValueChange={(e)=>{this.setState({locationCheck : e})}} />
                                    <TouchableOpacity onPress={() => this.setState({ locationCheck: !this.state.locationCheck })} style={{flex:1}}>
                                        <Text style={[styles.fontSize16,{}]}>위치정보 이용약관 동의 <Text style={[styles.fontSize13, {color: '#FF843A'}]}>(필수)</Text></Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.termsContainer} nestedScrollEnabled={true} scrollEnabled={true}>
                                    <Text>
                                        위치정보 이용약관에 동의하시면, 위치를 활용한  정보 수신 등을 포함하는 써니큐 위치기반 서비스를 이용할 수 있습니다.
                                    </Text>
                                </ScrollView>
                                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                                    <CheckBox tintColors={{true: '#FF843A'}} style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.mbMarketingUseYn == "Y" ? true : false} onValueChange={(e)=>{this.setState({mbMarketingUseYn : e? "Y":"N"})}} />
                                    <TouchableOpacity onPress={() => this.setState({ mbMarketingUseYn: this.state.mbMarketingUseYn=="Y" ? "N" : "Y"  })} style={{flex:1, justifyContent: 'center'}}>
                                        <Text style={[styles.fontSize16,{}]}>프로모션 및 마케팅 정보수신 동의 <Text style={[styles.fontSize13, {color: '#FF843A'}]}>(선택)</Text></Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.termsContainer} nestedScrollEnabled={true} scrollEnabled={true}>
                                    <Text>
                                        써니큐에서 제공하는 이벤트/혜택 등 다양한 정보 및 공지 휴대전화(써니큐 앱 알림 또는 문자), 이메일로 받아보실 수 있습니다.
                                    </Text>
                                </ScrollView>
                            </View>
                            
                            <View style={{marginTop:58, marginBottom:100, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%'}}>
                                <ButtonSecundary
                                    text="취소"
                                    disabled={this.state.isLoading}
                                    containerStyle={styles.loginButton}
                                    onPress={() => this.props.navigation.pop()}
                                />
                                <ButtonGradient
                                    text="확인"
                                    disabled={this.state.isLoading}
                                    containerStyle={styles.loginButton}
                                    onPress={() => this.onLoginPressHandle()}
                                />
                            </View>
                        </View>
                        <Footer />
                    </ScrollView>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImageContainer: {
        marginVertical: 30,
    },
    logoImage: {
        transform: [{scale: 0.8}],
        resizeMode: 'contain',
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'400'
    },
    fontSize13:{
        fontSize:13,
        // lineHeight:15,
        fontWeight:'400'
    },  
    fontSize16:{
        fontSize:16,
        // lineHeight:20,
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
    termsContainer: {
        height: 50,
        zIndex: 99,
        padding: 10,
    },
});


export default TermsScreen;
