import React from 'react';
import { View, Text, TouchableOpacity,Image } from 'react-native';

import { Color, Images } from '@common';

import { createStackNavigator } from 'react-navigation-stack';
// import Tabs from './Tabs';

//아임포트
import iamportLoading from '@screens/iamportScreen/iamportLoading';
import iamportMain from '@screens/iamportScreen/iamportMain';
import iamportResult from '@screens/iamportScreen/iamportResult';


//지갑
import WalletMain from '../screens/walletScreen/walletMain';
import WalletDetailMain from '../screens/walletScreen/walletDetail/walletDetailMain';
import WalletSend from '../screens/walletScreen/walletDetail/walletSend';
import AddCoin from '../screens/walletScreen/addCoin';
import WalletReceive from '../screens/walletScreen/walletDetail/walletReceive';
import emailCertification from '../screens/walletScreen/walletDetail/emailCertification';
import WalletSwap from '../screens/walletScreen/walletDetail/walletSwap';
import WalletSwapComplet from '../screens/walletScreen/walletDetail/walletSwapComplet';
import WalletSendComplet from '../screens/walletScreen/walletDetail/walletSendComplet';
import WalltePurchase from '../screens/walletScreen/walletDetail/walletPurchase';
import WalltePurchaseWaiting from '../screens/walletScreen/walletDetail/walletPurchaseWaiting';
import WalletTXID from '../screens/walletScreen/walletDetail/walletTXID';
import WalletPurchaseComplet from '../screens/walletScreen/walletDetail/walltePurchaseComplet';
import ScanScreen from '../screens/walletScreen/walletDetail/QRCodeScanner'
//상품
import ProductMain from '../screens/productScreen/productMain';

//알림
import PushMain from '../screens/pushScreen/PushMain'
//내역
import HistoryMain from '../screens/historyScreen/HistoryMain'
//마이페이지
import MyPageMain from '../screens/myPageScreen/myPageMain';
import BasicInfoMain from '../screens/myPageScreen/basicInfo/basicInfoMain';
import ManagementLogin from '../screens/myPageScreen/basicInfo/managementLogin';
import MemberShipWithdrawal from '../screens/myPageScreen/basicInfo/memberShipWithdrawal';
import SetPassword from '../screens/myPageScreen/setPassword';
import ManagementWalletAddr from '../screens/myPageScreen/managementWalletAddr';
import Recommender from '../screens/myPageScreen/recommender';
import BaseCurrency from '../screens/myPageScreen/baseCurrency';
import InquireMain from '../screens/myPageScreen/inquire/inquireMain';
import InquireDetail from '../screens/myPageScreen/inquire/inquireDetail';
import AppLockMain from '../screens/myPageScreen/appLock/appLockMain';
import PushSetting from '../screens/myPageScreen/pushSetting'
import NoticeMain from '../screens/myPageScreen/notice/noticeMain';
import NoticeDetail from '../screens/myPageScreen/notice/noticeDetail';
import TermsAndPolicyMain from '../screens/myPageScreen/termsAndPolicy/termsAndPolicyMain';
import TermsOfService from '../screens/myPageScreen/termsAndPolicy/termsOfService';
import PrivacyPolicy from '../screens/myPageScreen/termsAndPolicy/privacyPolicy';
import TermsOfDeposit from '../screens/myPageScreen/termsAndPolicy/termsOfDeposit';
import OtpStep1 from '../screens/myPageScreen/googleOtp/otpStep1';
import OtpStep2 from '../screens/myPageScreen/googleOtp/otpStep2';
import OtpStep3 from '../screens/myPageScreen/googleOtp/otpStep3';


//로그인 회원가입
import GmcLoginScreen from '../screens/gmcLoginScreen'
import GmcSingUpScreen from '../screens/gmcSignUpScreen'
import FindUserIdMain from '../screens/findUserIdScreen/findUserIdMain'
import FindUserPwMain from '../screens/findUserPwSrceen/findUserPwMain'
import FindUserIdComplet from '../screens/findUserIdScreen/findUserIdComplet'
import FindUserPwComplet from '../screens/findUserPwSrceen/findUserPwComplet'
import FindUserPwChange from '../screens/findUserPwSrceen/findUserPwChange'
import { store } from '../redux/store';

import { openDrawer, closeDrawer } from '../redux/actions/drawer';

// import Images from '@common/Images'


const _navigationOptions = ({ navigation }) => ({
    animationEnabled : false,
    headerMode:'none',
    headerTitle: null,
    animationEnabled: false,
    headerLeft: ()=>{
        return (
        <>
            <TouchableOpacity onPress={()=>{}} disabled >
                <View style={{flexDirection:"row",justifyContent:'center',paddingLeft:16,alignItems:'center'}}>
                    <Image source={Images.Logo} style={{width:140,height:16}}></Image>
                </View>
            </TouchableOpacity>

        </>
        )},
    headerRight: ()=>{
        return (
        <>  
            
                <View style={{flexDirection:'row',alignItems:'center',paddingRight:16}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate("PushMain")}} style={{marginRight:16}}>
                        <Image source={Images.notification} style={{width:20,height:20}}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.openDrawer(), store.dispatch({
                            type: 'OPEN',
                    })}}>
                        <Image source={Images.menu} style={{width:30,height:20}}></Image>
                    </TouchableOpacity>
                </View>
            
        </>
       )   
    },
    headerStyle: {
        elevation: 0,
        backgroundColor: "#1B2937",
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
        },
    },
    headerTitleStyle: {
        color: Color.white,
        fontSize: 20
    },
});

const HomeRoutes = createStackNavigator(
    {
        WalletMain: {
            screen: WalletMain,
            navigationOptions: _navigationOptions
        },
        WalletDetailMain: {
            screen: WalletDetailMain,
            navigationOptions: _navigationOptions
        },
        WalletSend: {
            screen: WalletSend,
            navigationOptions: _navigationOptions
        },
        WalletSendComplet: {
            screen: WalletSendComplet,
            navigationOptions: _navigationOptions
        },
        AddCoin: {
            screen: AddCoin,
            navigationOptions: _navigationOptions
        },
        WalletReceive: {
            screen: WalletReceive,
            navigationOptions: _navigationOptions
        },
        emailCertification: {
            screen: emailCertification,
            navigationOptions: _navigationOptions
        },
        WalletSwap: {
            screen: WalletSwap,
            navigationOptions: _navigationOptions
        },
        WalletSwapComplet: {
            screen: WalletSwapComplet,
            navigationOptions: _navigationOptions
        },
        WalltePurchase: {
            screen: WalltePurchase,
            navigationOptions: _navigationOptions
        },
        WalltePurchaseWaiting: {
            screen: WalltePurchaseWaiting,
            navigationOptions: _navigationOptions
        },
        WalletTXID: {
            screen: WalletTXID,
            navigationOptions: _navigationOptions
        },
        WalletPurchaseComplet: {
            screen: WalletPurchaseComplet,
            navigationOptions: _navigationOptions
        },
        ScanScreen: {
            screen: ScanScreen,
            navigationOptions: _navigationOptions
        },
        ProductMain: {
            screen: ProductMain,
            navigationOptions: _navigationOptions
        },
        HistoryMain: {
            screen: HistoryMain,
            navigationOptions: _navigationOptions
        },
        MyPageMain: {
            screen: MyPageMain,
            navigationOptions: _navigationOptions
        },
        BasicInfoMain: {
            screen: BasicInfoMain,
            navigationOptions: _navigationOptions
        },
        ManagementLogin: {
            screen: ManagementLogin,
            navigationOptions: _navigationOptions
        },
        MemberShipWithdrawal: {
            screen: MemberShipWithdrawal,
            navigationOptions: _navigationOptions
        },
        SetPassword: {
            screen: SetPassword,
            navigationOptions: _navigationOptions
        },
        ManagementWalletAddr: {
            screen: ManagementWalletAddr,
            navigationOptions: _navigationOptions
        },
        Recommender: {
            screen: Recommender,
            navigationOptions: _navigationOptions
        },
        BaseCurrency: {
            screen: BaseCurrency,
            navigationOptions: _navigationOptions
        },
        InquireMain: {
            screen: InquireMain,
            navigationOptions: _navigationOptions
        },
        InquireDetail: {
            screen: InquireDetail,
            navigationOptions: _navigationOptions
        },
        GmcLoginScreen: {
            screen : GmcLoginScreen,
            navigationOptions : _navigationOptions
        },
        GmcSingUpScreen :{
            screen : GmcSingUpScreen,
            navigationOptions : _navigationOptions
        },
        NoticeMain: {
            screen: NoticeMain,
            navigationOptions: _navigationOptions
        },
        NoticeDetail: {
            screen: NoticeDetail,
            navigationOptions: _navigationOptions
        },
        AppLockMain :{
            screen: AppLockMain,
            navigationOptions : _navigationOptions
        },
        PushSetting : {
            screen : PushSetting,
            navigationOptions : _navigationOptions
        },
        TermsAndPolicyMain: {
            screen: TermsAndPolicyMain,
            navigationOptions: _navigationOptions
        },
        TermsOfService: {
            screen: TermsOfService,
            navigationOptions: _navigationOptions
        },
        PrivacyPolicy: {
            screen: PrivacyPolicy,
            navigationOptions: _navigationOptions
        },
        TermsOfDeposit: {
            screen: TermsOfDeposit,
            navigationOptions: _navigationOptions
        },
        OtpStep1: {
            screen: OtpStep1,
            navigationOptions: _navigationOptions
        },
        OtpStep2: {
            screen: OtpStep2,
            navigationOptions: _navigationOptions
        },
        OtpStep3: {
            screen: OtpStep3,
            navigationOptions: _navigationOptions
        },
        PushMain : {
            screen : PushMain,
            navigationOptions: _navigationOptions
        },
        FindUserIdMain : {
            screen : FindUserIdMain,
            navigationOptions: _navigationOptions
        },
        FindUserPwMain : {
            screen : FindUserPwMain,
            navigationOptions: _navigationOptions
        },
        FindUserIdComplet : {
            screen : FindUserIdComplet,
            navigationOptions: _navigationOptions
        },
        FindUserPwChange : {
            screen : FindUserPwChange,
            navigationOptions: _navigationOptions
        },
        FindUserPwComplet : {
            screen : FindUserPwComplet,
            navigationOptions: _navigationOptions
        },
        IamportLoading: {
            screen: iamportLoading,
            navigationOptions: _navigationOptions
        },
        IamportMain: {
            screen: iamportMain,
            navigationOptions: _navigationOptions
        },
        IamportResult: {
            screen: iamportResult,
            navigationOptions: _navigationOptions
        },
    },
    {
        initialRouteName: 'WalletMain',
        headerMode: 'float',
        mode: 'modal',
    },
);

export default HomeRoutes;