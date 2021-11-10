import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert,FlatList, Linking,TouchableOpacity, BackHandler,Text, ScrollView, TextInput, Platform, Dimensions } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
// import { FlatList,TouchableOpacity } from 'react-native-gesture-handler';
import { store } from '@redux/store';
import CheckBox from '@react-native-community/checkbox';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import Modal from "react-native-modal";
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import SimpleToast from 'react-native-simple-toast';
import { commonApi } from '@common/ApiConnector';
import ReactNativeBiometrics from 'react-native-biometrics'
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

class WalletSend extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            coinData : this.props.navigation.getParam('coinData', {}),
            idx : '',
            walletData : {},
            isCheckedAddress : false,
            walletAddr : "",
            withdrawHistoryList : [],
            recentTxData : {},
            currentTab : 1,
            inputFavAddress : "",
            inputFavName : "",
            isAllQty : false,
            otp : false,
            otpCode: "",
            biometrics : false,
            withdrawalResultQty : "",
            withdrawalRequestQty : "",
            lockType : store.getState().user.lockType || "pin",
            modalShow : false,
            soltType: "favorites",
            searchValue : "",
            favoritesList : [],
            maxSendValue : 10,
            sendCoin : '',
            nickname :  "",
            modalData : {},
            selectIndex : 0,
            sendWallteAdress : "",
            maxCheck : false,
            memo : "",
            // certificationFalse : 0,
            lock : store.getState().user.pinPassword || null,
            unit : this.props.navigation.getParam("unit","$"),
            exchangeRate :this.props.navigation.getParam("exchangeRate",1),
            // qrScannerShow : false
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    } 

    addressChk = (obj,maxByte,type) => {

        const value = obj;
        const regType = /^[A-Za-z0-9+]*$/;
        
        const valueLength = value.length;
        let chkByte = 0;
        let chkLen = 0;
        let oneChar = '';
        let result = '';


        if (this.state.coinData.coinType == 'BTC') {
            if (obj.substr(0, 1) != '1') {
            SimpleToast.show('please enter address start with "1"', SimpleToast.SHORT)
            // alert('please enter address start with "1"')
            this.setState({
                walletAddr : ''
            })
            // setWalletAddr('')
            return false
        }
        if (!regType.test(obj)) {
            SimpleToast.show('write only english and decimal', SimpleToast.SHORT)
            // alert('write only english and decimal')
            return false
        }
        
        for (var i = 0; i < valueLength; i++) {

                oneChar = value.charAt(i);
                if (escape(oneChar).length > 4) {
                    chkByte += 2; //한글
                } else {
                    chkByte++;
                }
                if (chkByte <= 34) {
                    chkLen = i + 1;
                }
        }
       
        if (chkByte != 34) {
            SimpleToast.show(`address length must set "34 Byte"`, SimpleToast.SHORT)
            // alert(`address length must set "34 Byte"`);
            result = value.substr(0, chkLen);
            obj = result;
            this.setState({
                walletAddr : obj
            })
            // walletAddrRef.current.focus();
            return false;
        } else{
            SimpleToast.show(`address check has been successful`, SimpleToast.SHORT)
            // alert(`address check has been successful`);
        }
        return true;
        } else {
            if (obj.substr(0, 2) != '0x') {
            SimpleToast.show('please enter address start with "0x"', SimpleToast.SHORT)
            // alert('please enter address start with "0x"')
            this.setState({
                walletAddr : ''
            })
            return false
        }
        if (!regType.test(obj)) {
            SimpleToast.show('write only english and decimal', SimpleToast.SHORT)
            // alert('write only english and decimal')
            return false
        }
        
        for (var i = 0; i < valueLength; i++) {
                oneChar = value.charAt(i);
                if (escape(oneChar).length > 4) {
                    chkByte += 2; //한글
                } else {
                    chkByte++;
                }
                if (chkByte <= maxByte) {
                    chkLen = i + 1;
                }
        }
       
        if (chkByte != maxByte) {
            SimpleToast.show(`address length must set "${maxByte} Byte"`, SimpleToast.SHORT)
            // alert(`address length must set "${maxByte} Byte"`);
            result = value.substr(0, chkLen);
            obj = result;
            this.setState({
                walletAddr : obj
            })
            // walletAddrRef.current.focus();
            return false;
        } else{
            SimpleToast.show(`address check has been successful`, SimpleToast.SHORT)
            // alert(`address check has been successful`);
        }

        if(type == 'favAdd'){
            this.setState({
                isCheckedAddress : true
            })
            // setIsCheckedAddress(true)
        }
        
        return true;
        }
        
    }
    handleChangeOtpCode = e => {
        if(e.length < 7){
            this.setState({
                otpCode : e
            })
        }
    }

    handleClickVerify = () => {
                
        const param = {
            se_num: this.state.otpCode
        }
        console.log("param :: ",param)
        const otpResponse = commonApi('post', '/auth/open/checkOtpCodeForExchange',param);
        otpResponse.then((data) => {
            if(data.success == true ) {
                SimpleToast.show("otp certification was finish", SimpleToast.SHORT)
                // alert("otp certification was finish")
                // setIsOtp(true)
                this.setState({
                    biometrics : true,
                    otp : true
                })
            } else {
                if(data.code == 6600) {
                    SimpleToast.show("otp certification was failed, please check otp code", SimpleToast.SHORT)
                } else {
                    SimpleToast.show("server connection failed, please try again", SimpleToast.SHORT)
                }
                
            }
            
            
        })
        .catch(e => {
            console.log(e)
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
                // swal('Warning', 'Server Connection Failed ,Please wait a moment and try again.')
            }
            }); // 401일때 로그인으로 보냄

    }


    getWithdrawalHistory = (tab) => {

        //여기서 즐겨찾기, 최근보낸유저 리스트 나옴
        //최근보낸 유저
        const favParam = {
          "coin_type": this.state.coinData,
        }
        //txlist
        const favDataResponse = commonApi('post', '/exchange/ExchangeFavList',{coin_type:favParam.coin_type.coinType});
        favDataResponse.then(({ data }) => {
            

            var tempListData = data.favList
            var tempFavData = []
            tempListData.forEach(element => {

                element.bookmark = true
                tempFavData.push(element)
            })

            console.log("tempFavData :: ",tempFavData)
            this.setState({
                withdrawHistoryList : tempFavData
            })
            // setWithdrawHistoryList(tempFavData)
        })
        .catch(e => {
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
                // swal('Warning', 'Server Connection Failed ,Please wait a moment and try again.')
            }
        });//401일때 로그인으로 보냄


        //최근보낸 유저
        const param = {
          "coin_type": this.state.coinData,
        //   "page_no": "0",
        //   "page_size": "5"
        }

        //txlist
        const recentListResponse = commonApi('post', '/exchange/recentList', {coin_type:param.coin_type.coinType});
        recentListResponse.then(({ data }) => {
            
            var tempRecentTxData = []
            if (data.list == null) {
                return tempRecentTxData
            }

            var tempListData = data.list
            var date;
            tempListData.forEach(element => {
                date = '';
                if (element.reg_date != '') {
                        data = element.reg_date;
                        element.reg_date  = `${data}`
                }

                    //즐겨찾기 데이터랑 한번 비교 해봄. -> 체크할만한 겹치는 키가 없다. 일단 false고정
                    element.bookmark = false
                    tempRecentTxData.push(element)
                }
            )
            // console.log(tempRecentTxData)
            this.setState({
                recentTxData : tempRecentTxData
            })
            // setRecentTxData(tempRecentTxData)
        })
        .catch(e => {
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
                // swal('Warning', 'Server Connection Failed ,Please wait a moment and try again.')
            }
        });//401일때 로그인으로 보냄 
        console.log("this.state.recentTxData :: ",this.state.recentTxData)
        this.setState({
            withdrawHistoryList : tab == 1 ? this.state.withdrawHistoryList : this.state.recentTxData,
        })
        // setWithdrawHistoryList(tab == 1 ? withdrawHistoryList : recentTxData);
    }


    getWalletData = () => {

        //get user info
        const userCardResponse = commonApi('post', '/asset/accountList');
        userCardResponse.then(({ data }) => {
            var result = data.result
            var resultData = data.result.coins;
            let amount;
            console.log("coin",this.state.coinData.coinType)
            if (this.state.coinData.coinType == 'DFSD') {
                amount = 1
            } else if (this.state.coinData.coinType == 'DFSC') {
                amount = 0.02
            } else {
                amount = result[`${this.state.coinData.coinType.toLowerCase()}`]?.price;
            }
            console.log(data)
            resultData.forEach(element => {

                var tempFee = 0
                if(element.coin_type == 'BTC') {
                    tempFee = result.btc_fee.out_fee
                } else if (element.coin_type == 'ETH') {
                    tempFee = result.eth_fee.out_fee
                } else if (element.coin_type == 'DFSD') {
                    tempFee = result.dfsd_fee.out_fee
                } else if (element.coin_type == 'DFSC') {
                    tempFee = result.dfsc_fee.out_fee
                }

                if(element.coin_type == this.state.coinData.coinType) {
                    var setParam = {
                    coinType: element.coin_type,
                    coinImage: element.file_url,
                    balance: element.exchange_can,
                    amount1: amount, // $37,831,07
                        amount2: amount*element.exchange_can, // $0.000
                    fee: tempFee,
                    detailURL: `/wallet/WalletDetail/1`
                    }
                    this.setState({
                        walletData : setParam
                    })
                    this.setState({
                        maxSendValue : element.exchange_can - tempFee
                    })
                    // setWalletData(setParam);
                }
                    
                
            });
            
        })
        .catch(e => {
            console.log("ee :: ",e)
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
            }
            }); // 401일때 로그인으로 보냄

        //임시
        
        this.getWithdrawalHistory(1);
    }

    removeFav = (value) => {
        
        const deleteFavDataResponse = commonApi('delete', '/exchange/deleteExchangeFav',value);

        deleteFavDataResponse.then((data) => {
            if(data.success == true) {
                if(data.code == "0000") {
                    this.getWalletData()
                } else if(data.code == "9999") {
                    SimpleToast.show('server connection fail. try again.', SimpleToast.SHORT)
                    // alert("server connection fail. try again.")
                } else {
                    SimpleToast.show("no search favorite user info. check address please.", SimpleToast.SHORT)
                    // alert("no search favorite user info. check address please.")
                }
                
            }
            
        })
        .catch(e => {
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
            }
        });
    }

    handleChangeBookmark = () => {
        // let wHistoryList = [];
        // withdrawHistoryList.map((value, index) => {
        //     if (value.idx == idx) {
        //         wHistoryList.push({ ...value, bookmark: false });
        //     } else {
        //         wHistoryList.push(value);
        //     }
        // })
        // setWithdrawHistoryList(wHistoryList);
    }


    handleShowModal = (idx, address) => {
        this.setState({
            modalShow : true,
            idx :idx,
            inputFavAddress : address
        })
    }

    handleCloseModal = (value) => {

        this.addressChk(value.fav_address,42,"favAdd")
        
        const favParam = {
            "coin_type": this.state.coinData
            }
        //txlist
        const insertFavDataResponse = commonApi('post', '/exchange/insertExchangeFav',{
            coin_type:favParam.coin_type.coinType,
            fav_name: value.fav_name,
            fav_address: value.fav_address
            });

        insertFavDataResponse.then((data) => {
                //  [
                //     {
                //         "mb_idx": 226,
                //         "fav_name": "dkkim",
                //         "reg_date": "2021-07-04T12:41:16.000+0000",
                //         "fav_address": "0x27dc904c987556fbb91f51fCE4f55BE17b77fF15",
                //         "coin_type": "DFSD"
                //     }
                // ]
            if(data.success == true) {
                if(data.code == "0000") {
                    SimpleToast.show("favorite user was added!", SimpleToast.SHORT)
                    // alert("favorite user was added!")
                    this.setState({
                        inputFavName : "",
                        modalShow : false
                    })
                } else {
                    this.setState({
                        inputFavName : ""
                    })
                    SimpleToast.show("already added favorite user. check address please.", SimpleToast.SHORT)
                    // alert("already added favorite user. check address please.")
                }
                
            }
            
        })
        .catch(e => {
            console.log(e)
        });    
    }

    checkConfirmSend  = () => {

        console.log("wd",this.deleteComma(this.state.sendCoin))
        console.log("withdrawalResultQty",Number(this.replaceNum(Number(this.deleteComma(this.state.sendCoin))+this.state.walletData.fee)))
        // console.log("withdrawalRequestQty", this.state.sendCoin)
        //        if (withdrawalRequestQty <= 0 || withdrawalResultQty <= 0 || withdrawalRequestQty == '' || withdrawalResultQty == '') {
            
        // return;
        if (Number(this.deleteComma(this.state.sendCoin)) <= 0 || Number(this.replaceNum(Number(this.deleteComma(this.state.sendCoin))+this.state.walletData.fee)) <= 0 || this.deleteComma(this.state.sendCoin) == '' || this.replaceNum(Number(this.deleteComma(this.state.sendCoin))+this.state.walletData.fee) == '') {
            return SimpleToast.show("Please enter a value", SimpleToast.SHORT)
            // return swal('Please enter a value')
        }
        if (Number(this.deleteComma(this.state.sendCoin)) > this.state.walletData.balance) {
            return SimpleToast.show("You cannot exceed your current holdings.", SimpleToast.SHORT)
        } else {
            //verify = > otp chec
        //checkedaddress => address check
        //withrawal req qty = > amount check
        let param = {
            coinType: this.state.coinData.coinType,
            address : this.state.walletAddr,
            amount: this.replaceNum(Number(this.deleteComma(this.state.sendCoin))+this.state.walletData.fee),
            user_memo : this.state.memo==''? '' : this.state.memo,
            otpCode : this.state.otpCode,
        }
        console.log(param)
        if(this.state.isCheckedAddress == true || Number(this.deleteComma(this.state.sendCoin)) != 0  ) {
            const sendDataResponse = commonApi('put', '/exchange/outRequest',param);
            sendDataResponse.then((data) => {
                    console.log(data,'2123')
                if (data.code == '0000') {
                    const datas = {
                        coinType:this.state.coinData.coinType,
                        amount: Number(this.replaceNum(Number(this.deleteComma(this.state.sendCoin))+this.state.walletData.fee)),
                        totalAmount: Util.currency(Util.decimalPointEight(Number(this.replaceNum(Number(this.deleteComma(this.state.sendCoin))+this.state.walletData.fee)) *  this.state.walletData.amount1 * 1)),
                        address: this.state.walletAddr,
                        user_memo: this.state.memo == '' ? '' : this.state.memo,
                    }
                    this.props.navigation.navigate("WalletSendComplet",{datas:datas,coinData:this.state.coinData})
                }
            })
            .catch(e => {
                console.log(e)
                if (e.response?.status == 401) {
                    console.log(e)
                } else {
                    SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
                    // swal('Warning', 'Server Connection Failed ,Please wait a moment and try again.')
                }
            });//401일때 로그인으로 보냄 
        } else {
            SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
            // swal('Warning', 'Server Connection Failed ,Please wait a moment and try again.')
        }
        }

        
    }

    // handleChangeWithdrawalRequestQty = e => {
    //     console.log(e)
    //     var tempAmountValue = e
    //     // tempAmountValue = Util.removeChar(e)

    //     if (tempAmountValue != this.state.walletData) {
    //         this.setState({
    //             isAllQty : false
    //         })
    //     }
    //     tempAmountValue = tempAmountValue.replace(/,/gi, '').replace(/-/gi, '')

    //     if (tempAmountValue > Number(this.state.walletData.balance) + Number(this.state.walletData.fee)) {
    //             tempAmountValue = Number(this.state.walletData.balance)
    //         SimpleToast.show('Insufficient balance. check your balance.', SimpleToast.SHORT)
    //         this.setState({
    //             withdrawalResultQty : '',
    //             withdrawalRequestQty : ''
    //         })
    //     }
    //     if (tempAmountValue.length <= 1 && tempAmountValue == '.') {
    //         tempAmountValue = ''
    //     }
  
    //     console.log("tempAmountValue",tempAmountValue)
    //     this.setState({
    //         withdrawalResultQty : tempAmountValue
    //     })
    //     // setWithdrawalRequestQty(tempAmountValue);
    //     if (Number(tempAmountValue) > 0) {
    //         tempAmountValue = Number(tempAmountValue) + Number(this.state.walletData.fee)
    //     } else {
    //         tempAmountValue = Number(tempAmountValue)
    //     }   
    //     if (tempAmountValue > this.state.walletData.balance) {
    //         SimpleToast.show('Insufficient balance. check your balance.', SimpleToast.SHORT)
    //         this.setState({
    //             withdrawalResultQty : '',
    //             withdrawalRequestQty : ''
    //         })
    //     } else {
    //         this.setState({
    //             withdrawalResultQty : tempAmountValue
    //         })
    //     }   
    // }


    
    componentWillUnmount() {

        FingerprintScanner.release()
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    }

    //콤마 추가
    addComma=(num)=>{
        const regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');   
    }
    //콤마 제거
    deleteComma=(num)=>{
        let newNum = num.toString().replace(/,/g,"")
        return newNum
    }

    replaceNum=(num)=>{
        console.log("num :: ",num)
        if(String(num).includes('.')){
            let pointCheck = String(num).split(".")
            let firstNum = pointCheck[0]
            let lastNum = pointCheck[1]
            firstNum = this.addComma(this.deleteComma(firstNum))
            return `${firstNum}.${lastNum}`;
        }else{
            return this.addComma(num);
        }
    }

    onChangeSendCoin = (e)=>{
        let pointCheck = e.split(".")
        if(pointCheck.length< 3){
            if(pointCheck.length >1){
                let firstNum = pointCheck[0]
                let lastNum = pointCheck[1]
                firstNum = this.addComma(this.deleteComma(firstNum))
                if(Number(this.deleteComma(e)) <= this.state.maxSendValue){
                    console.log(pointCheck)
                    this.setState({sendCoin : `${firstNum}.${lastNum}`})
                }else if(Number(this.deleteComma(e)) > this.state.maxSendValue){
                    this.setState({sendCoin : Util.currency(Util.decimalPointEight(this.state.maxSendValue))})
                }
            }else{
                if(Number(this.deleteComma(e)) <= this.state.maxSendValue){
                    this.setState({sendCoin : this.addComma(this.deleteComma(e))})
                }else if(Number(this.deleteComma(e)) > this.state.maxSendValue){
                    this.setState({sendCoin : Util.currency(Util.decimalPointEight(this.state.maxSendValue))})
                } 
            }
            
            // if(Number(e) <= this.state.maxSendValue){
            //     this.setState({sendCoin : e})
            // }else if(Number(e) > this.state.maxSendValue){
            //     this.setState({sendCoin : String(this.state.maxSendValue)})
            // }
        }
    }

    onClickMaxSend=(e)=>{
        if(e){
            this.onChangeSendCoin(this.state.maxSendValue.toString())
        }else{
            this.onChangeSendCoin("")
        }
    }


    favoritesOnPress = (item,index) =>{
        let newFavoritesList = [...this.state.favoritesList]

        if(item.favorites){
            newFavoritesList[index].favorites = false
            this.setState({
                favoritesList : newFavoritesList
            })
        }else {
            this.setState({
                modalShow : true,
                modalData : item,
                selectIndex : index,
            })
        }
    }

    addFavorites = () =>{
        let newFavoritesList = [...this.state.favoritesList]
        let index = this.state.selectIndex
        newFavoritesList[index].name = this.state.nickname
        newFavoritesList[index].favorites = true
        
        this.setState({
            modalShow:false,
            modalData:{},
            nickname : "",
            favoritesList : newFavoritesList
        })
    }

    onQrSuccess=(e)=>{
        this.setState({
            walletAddr : e
        })
        console.log("ㅋㅠ아ㄹ  메메세세지지~~~~~~",e)
    }

    onQrScanner=()=>{
        this.props.navigation.navigate("ScanScreen",{onQrSuccess : this.onQrSuccess})
    }

    favoritesItem = (item,index)=>{
        let soltType = this.state.soltType === "favorites"

        if(item.name.includes(this.state.searchValue)){
            if(soltType ? item.favorites : true){
                return(
                    <View style={{borderColor:"#D7D6D6",borderBottomWidth:1,flexDirection:'row'}}>
                        <View style={{flex:7.6,paddingTop:18,}}>
                            <View><Text style={{fontWeight:'500',lineHeight:14,fontSize:12}}>{item.name}</Text></View>
                            <View style={{paddingLeft:1,marginTop:6,marginBottom:18}}><Text style={{fontSize:12,lineHeight:14,fontWeight:'400'}}>{item.id}</Text></View>
                        </View>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{this.favoritesOnPress(item,index)}}>
                                <Image source={item.favorites? Images.StarOn :Images.StarOff} style={{width:28,height:28}}></Image>
                                {/* <View style={{width:28,height:28,backgroundColor:'#1B2947'}}></View> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        }
    }

    androidSignature = (e) =>{
        console.log("FingerprintScanner error :: ",e)
    }
    createSignature = ()=>{
        console.log("dsahjkdlasjdaklsajsdkl")
        FingerprintScanner
        .authenticate(Platform.OS =='ios' ? { description: 'Scan your fingerprint on the device scanner to continue',fallbackEnabled: false } :{description : "Scan your fingerprint on the device scanner to continue",onAttempt:(e)=>this.androidSignature(e)} )
        .then((resultObject) => {
            console.log("엘렐레 ")
            if(resultObject){
                this.cfSuccess()
            }
        })
        .catch((error) => {
            console.log("error ::",error)
            if(error.name == "DeviceLockedPermanent"){
                SimpleToast.show(error.message, SimpleToast.SHORT)
                let user = {
                    lockType : "pin"
                }
                store.dispatch({
                    type: 'SET_USER',
                    payload: user,
                });
                this.props.navigation.navigate("LockScreen",{mode : 1,type : 'confirm',success : this.cfSuccess})
            }
            // this.props.handlePopupDismissed();
            // AlertIOS.alert(error.message);
        });
    }
    
    
    
    cfSuccess=()=>{
        this.setState({
            biometrics : true,
            otp : true
        })
    }

    cfOnPress=()=>{
        if(this.state.lock !=="" && this.state.lock !== null){
            console.log("lockType :: ",this.state.lockType)
            if( this.state.lockType =="pin"){
                this.props.navigation.navigate("LockScreen",{mode : 1,type : 'confirm',success : this.cfSuccess})
            }else {
                this.createSignature()
            }
        }else{
            Alert.alert('',"please set app lock option.", [
                { text: "confirm", onPress: () => false }
            ]);
        }
    }

    componentDidMount=()=>{
        this.getWalletData();
    }

    render() {

        return (
            <SafeAreaView style={[Styles.Wrap]}>
                
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Send" border></HeaderBar>
                <KeyboardAwareScrollView style={Styles.ScrollContainer} extraScrollHeight={Platform.OS ==='ios' ? 100: 0} enableResetScrollToCoords={false}>
                    {/* <ScrollView style={Styles.ScrollContainer}> */}
                        <View style={styles.container}>

                            <View style={{marginTop:8}}>
                                <View style={{height:30,flex:1,marginBottom:20}}><Text style={{fontWeight:'bold',fontSize:24}}>My assets</Text></View>
                                <ExchangeBox exchangeBoxStyle={{marginBottom:20,backgroundColor:'#FAFAFA',borderWidth:2,borderColor:"#000000"}} border exchangeRate={this.state.exchangeRate} data={this.state.coinData} unit={this.state.unit}  disabled={true} />
                            </View>

                            <View style={{marginTop:40}}>
                                <View style={{height:30}}><Text style={{fontSize:18,fontWeight:'bold'}}>Wallet address</Text></View>
                                <View style={{flexDirection:'row'}}>
                                    <TextInput style={[styles.defaultTextInput,{flex:5.7,marginRight:5,height:50}]} onChangeText={(e)=>{this.setState({walletAddr:e})}} value={this.state.walletAddr} placeholder={"Please enter address"} placeholderTextColor={Color.textGray}></TextInput>
                                    <RectangleButton style={{flex:1}} fontSize={10}  title={"Check"} fontSize={10} fontWeight={'bold'} onPress={()=>{this.addressChk(this.state.walletAddr,42,'addrCheck')}}></RectangleButton>
                                    <RectangleButton style={{flex:1,marginLeft:10}} fontSize={10} fontWeight={'bold'}  title={"  QR Scan"} onPress={()=>{this.onQrScanner()}}></RectangleButton>
                                </View>
                            </View>

                            <View style={{marginTop:32}}>

                                <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#D7D6D6',paddingBottom:10}}>
                                    <View style={{flexDirection:'row',flex:1,borderWidth:1,borderColor:"#D7D6D6",marginRight:5}}>
                                        <TextInput style={{flex:1,height:50,paddingVertical:0,paddingHorizontal:5}} onChangeText={(e)=>{this.setState({searchValue : e})}}></TextInput>
                                        <View style={{justifyContent:'center',paddingHorizontal:10,borderLeftWidth:1,borderLeftColor:'#D7D6D6'}}>
                                            <Image source={Images.searchBox} style={{height:11,width:13}}></Image>
                                        </View>
                                    </View>
                                        <View style={{flexDirection:'row',width:100}}>
                                            <RectangleButton style={{width:48,backgroundColor:this.state.currentTab == 1 ? "#1B2937" :Color.white ,marginRight:5,borderColor:'#1B2937',borderWidth:1}} fontWeight={'bold'} fontSize={10} title={"favorite"} textColor={this.state.currentTab == 2 ? "#1B2937" :Color.white} onPress={()=>{this.setState({currentTab : 1}),this.getWithdrawalHistory(1)}}></RectangleButton>
                                            <RectangleButton style={{width:48,backgroundColor:this.state.currentTab == 2 ? "#1B2937" :Color.white,borderColor:'#1B2937',borderWidth:1,}} fontSize={10} fontWeight={'bold'} textColor={this.state.currentTab == 1 ? "#1B2937" :Color.white} title={"Recent"} onPress={()=>{this.setState({currentTab : 2}),this.getWithdrawalHistory(2)}}></RectangleButton>
                                        </View>
                                </View>

                                <View style={{borderBottomWidth:1,borderColor:'#D7D6D6'}}>
                                    {this.state.currentTab == 1
                                        ?
                                        <ScrollView style={{height:200}}>
                                            {this.state.withdrawHistoryList.length > 0
                                            ?
                                            this.state.withdrawHistoryList.filter((initValue) => initValue.fav_name.includes(this.state.searchValue)).map((value, index) => {
                                                return (
                                                    <View style={{borderColor:"#D7D6D6",borderBottomWidth:1,flexDirection:'row'}}>
                                                        <TouchableOpacity style={{flex:7.6,paddingTop:10,paddingLeft:10}} onPress={()=>{this.setState({walletAddr : value.fav_address})}}>
                                                            <View><Text style={{fontWeight:'300',lineHeight:14,fontSize:12}}>{moment.utc(value.reg_date).format('YYYY-MM-DD HH:mm')}</Text></View>
                                                            <View style={{paddingVertical:10}}><Text style={{fontWeight:'300',lineHeight:14,fontSize:12}}>{value.fav_name}</Text></View>
                                                            <View style={{paddingLeft:1,marginTop:6,marginBottom:10}}><Text style={{fontSize:12,lineHeight:14,fontWeight:'300'}}>{value.fav_address}</Text></View>
                                                        </TouchableOpacity>
                                                        <View style={{flex:1,justifyContent:'center'}}>
                                                            <TouchableOpacity onPress={()=>{this.removeFav(value)}}>
                                                                <Image source={value.bookmark? Images.StarOn :Images.StarOff} style={{width:28,height:28}}></Image>
                                                                {/* <View style={{width:28,height:28,backgroundColor:'#1B2947'}}></View> */}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            :
                                            <>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',height:172,borderColor:"#D7D6D6",borderBottomWidth:1,}}>
                                                    <View style={{width:14,height:14,backgroundColor:'#DCDBDB',borderRadius:50}}></View>
                                                    <View style={{marginTop:7}}><Text style={[styles.fontSize14,{color:'#DCDBDB'}]}>no favorite address.</Text></View>
                                                </View>
                                            </>
                                            }
                                        </ScrollView>
                                        :
                                        <ScrollView style={{height:200}}>
                                            {this.state.recentTxData.length > 0
                                            ?
                                            this.state.recentTxData.map((value, index) => {
                                                return (
                                                    <View style={{borderColor:"#D7D6D6",borderBottomWidth:1,flexDirection:'row'}}>
                                                        <TouchableOpacity style={{flex:7.6,paddingTop:13,paddingLeft:10}} onPress={()=>{this.setState({walletAddr : value.other_address})}}>
                                                            <View style={{paddingBottom:5}}><Text style={{fontWeight:'300',lineHeight:14,fontSize:12}}>{moment.utc(value.reg_date).format('YYYY-MM-DD HH:mm')}</Text></View>
                                                            <View style={{paddingLeft:1,marginTop:6,marginBottom:18}}><Text style={{fontSize:12,lineHeight:14,fontWeight:'400'}}>{value.other_address}</Text></View>
                                                        </TouchableOpacity>
                                                        <View style={{flex:1,justifyContent:'center'}}>
                                                            <TouchableOpacity onPress={()=>{!value.bookmark ?this.handleShowModal(index, value.other_address) :  this.handleChangeBookmark(index)}}>
                                                                <Image source={value.bookmark? Images.StarOn :Images.StarOff} style={{width:28,height:28}}></Image>
                                                                {/* <View style={{width:28,height:28,backgroundColor:'#1B2947'}}></View> */}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            :
                                            <>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',height:172,borderColor:"#D7D6D6",borderBottomWidth:1,}}>
                                                    <View style={{width:14,height:14,backgroundColor:'#DCDBDB',borderRadius:50}}></View>
                                                    <View style={{marginTop:7}}><Text style={[styles.fontSize14,{color:'#DCDBDB'}]}>no favorite address.</Text></View>
                                                </View>
                                            </>
                                            }
                                        </ScrollView>
                                    }
                                    {/* <FlatList
                                        data={this.state.favoritesList}
                                        renderItem={({item,index})=>(this.favoritesItem(item,index))}
                                        ListEmptyComponent={
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',height:172,borderColor:"#D7D6D6",borderBottomWidth:1,}}>
                                                    <View style={{width:14,height:14,backgroundColor:'#DCDBDB',borderRadius:50}}></View>
                                                    <View style={{marginTop:7}}><Text style={[styles.fontSize14,{color:'#DCDBDB'}]}>no favorite address.</Text></View>
                                                </View>
                                        }
                                        keyExtractor={(item, index) => `${index}`}
                                    /> */}
                                </View>
                                
                            </View>
                                
                            <View style={{marginTop:35}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{height:30,justifyContent:'center'}}><Text style={{fontSize:18,fontWeight:'bold'}}>Qty of withdrawal request</Text></View>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={[styles.fontSize16,{marginRight:5}]}>All Qty</Text>
                                        <TouchableOpacity onPress={()=>{
                                            this.setState({
                                                maxCheck : !this.state.maxCheck
                                            })
                                            this.onClickMaxSend(!this.state.maxCheck)
                                        }}>
                                            <CheckBox disabled style={Platform.OS=="ios" ? styles.checkBox:styles.anCheckBox} tintColors={{ true:'#3A7BD5',false: '#858585'}} value={this.state.maxCheck}></CheckBox>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                <View style={[styles.defaultTextInput,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                                <TextInput style={[{flex:5.7,textAlign:'right',padding:0}]} onChangeText={(e)=>{this.onChangeSendCoin(e)}} keyboardType="numeric" placeholder={`Please enter the amount of ${this.state.walletData.coinType} to use for Send`} value={this.state.sendCoin} placeholderTextColor={Color.textGray}></TextInput>
                                    <Text style={{marginLeft:5}}>{this.state.coinData.coinType}</Text>
                                </View>

                                <View style={{marginTop:4}}>
                                    <View style={{flex:5.7,flexDirection:'row',justifyContent:'space-between'}}>
                                        <View style={{flex:1}}><Text style={{fontSize:11,fontWeight:'bold'}}>{`· Available withdrawal qty: ${Util.currency(Util.decimalPointEight(this.state.walletData.balance))}${this.state.coinData.coinType}`}</Text></View>
                                        <View style={{width:80}}><Text  style={{fontSize:11,fontWeight:'bold',textAlign:'right'}}>{`${this.state.unit} ${this.replaceNum(this.deleteComma(this.state.sendCoin)*this.state.walletData.amount1)}`}</Text></View>
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop:28}}>
                                <View style={{height:30}}><Text style={{fontSize:18,fontWeight:'bold'}}>Leave a note</Text></View>  
                                <View><TextInput style={[styles.defaultTextInput]} placeholder={"Leave a note on this transaction"} placeholderTextColor={Color.textGray} onChangeText={(e)=>{if(e.length <21)this.setState({memo : e})}} value={this.state.memo}></TextInput></View>
                            </View>

                            <View style={{marginTop:45}}>
                                <Text style={{fontSize:18,fontWeight:'bold'}}>Transfer quantity</Text>
                                <View style={{marginTop:6,height:60,backgroundColor:'#F9F8FB',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingHorizontal:14}}>
                                    <Text style={[styles.fontSize18,{fontWeight:'700'}]}>{this.state.sendCoin ==="" ? '0' : `${this.replaceNum(Number(this.deleteComma(this.state.sendCoin))+this.state.walletData.fee)}`}</Text>
                                    <Text style={styles.fontSize18}> {this.state.coinData.coinType}</Text>
                                </View>
                            </View>

                            <View style={{marginTop:12,paddingHorizontal:10}}>
                                {/* <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View><Text style={styles.resultText}>Qty of withdrawal requests</Text></View>
                                    <View><Text style={styles.resultText}>0 DFSC</Text></View>
                                </View> */}
                                {/* <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:6}}>
                                    <View><Text style={styles.resultText}>Transfer fees</Text></View>
                                    <View><Text style={styles.resultText}>{`${this.state.subtrahend} ${this.state.coinData.coin_type}`}</Text></View>
                                </View> */}
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View><Text style={styles.resultText}>Qty of withdrawal requests</Text></View>
                                    <View><Text style={{fontSize:14,fontWeight:'bold'}}>{`${this.state.sendCoin} ${this.state.coinData.coinType}`}</Text></View>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:6}}>
                                    <View><Text style={styles.resultText}>Transfer fees</Text></View>
                                    <View><Text style={{fontSize:14,fontWeight:'bold'}}>{`${this.state.walletData.fee} ${this.state.coinData.coinType}`}</Text></View>
                                </View>
                            </View>
                        
                            <View style={{marginTop:43}}>
                                <View style={{height:30}}><Text style={{fontSize:18,fontWeight:'bold'}}>Security Authentication</Text></View>
                                {this.state.useLock !="N" &&
                                <View>
                                    <RectangleButton style={{flex:1,height:50,marginBottom : 10}} disable={this.state.otp || this.state.biometrics} title={"biometric authentication"} onPress={()=>{this.cfOnPress()}}></RectangleButton>
                                </View>
                                }
                                <View style={{flexDirection:'row'}}>
                                    <TextInput keyboardType='numeric' style={[styles.defaultTextInput,{flex:5.7,marginRight:3}]} value={this.state.otpCode} placeholderTextColor={Color.textGray} placeholder={"Please enter the OTP verification code."} onChangeText={(e)=>{this.handleChangeOtpCode(e)}}></TextInput>
                                    <RectangleButton style={{flex:1}} title={"Verify"} disable={this.state.otpCode.length != 6 || this.state.biometrics } fontSize={10} onPress={()=>{this.handleClickVerify()}}></RectangleButton>
                                </View>
                            </View>


                            <View style={{marginTop:54,marginBottom:54}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <RectangleButton style={{flex:1,height:50,marginRight:6,backgroundColor:Color.white,borderColor :"#1B2937",borderWidth:1,borderRadius:10}} textColor={"#1B2937"} title={"Cancel"} onPress={()=>{this.props.navigation.push("WalletDetailMain",{coinData:this.state.coinData})}}></RectangleButton>
                                    {/* <RectangleButton style={{flex:1,height:50}} title={"Send Confirm"}  onPress={()=>{this.props.navigation.push("WalletDetailMain",{coinData:this.state.coinData})}}></RectangleButton> */}
                                    <RectangleButton style={{flex:1,height:50,borderRadius:10}} title={"Send Confirm"} disable={!(this.state.sendCoin !=="" && this.state.sendCoin >0 && this.state.walletAddr && this.state.otp)} onPress={()=>{this.checkConfirmSend()}}></RectangleButton>
                                </View>
                            </View>
                        </View>
                    {/* </ScrollView> */}
                </KeyboardAwareScrollView>
                <BottomTab navigation={this.props.navigation}/>
                <Modal
                    isVisible={this.state.modalShow}
                    backdropOpacity={0.5}
                    backdropColor = {'black'}
                    style={styles.Modal}
                >

                        <View style={styles.ModalContainer}>
                            <View style={{paddingRight:8,alignItems:'flex-end'}}>
                                <TouchableOpacity onPress={()=>{this.setState({modalShow: false,inputFavName : ""})}} disabled={false}>
                                    <Image style={{width:12,height:12}} source={Images.modalClose}></Image>
                                </TouchableOpacity>
                            </View>
                            {/* <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0} contentInset={{bottom :0}}> */}
                                <ScrollView style={Styles.ScrollContainer}>
                                    <View style={{marginTop:10,alignItems:'center'}}>
                                        <Text style={{fontSize:27,fontWeight:'700',textAlign:'center'}}>Add favorite withdrawal address</Text>
                                    </View>
                                    <View style={{marginTop:30}}>
                                        <View><Text style={{fontSize:20,fontWeight:'700'}}>Digital asset</Text></View>
                                        <View style={{marginTop:11}}><TextInput style={{height:51,borderWidth:1,borderColor:'#D7D6D6',paddingHorizontal:7,fontSize:16,fontWeight:'500',lineHeight:20}} placeholder={"DFSC"} placeholderTextColor={Color.textGray}></TextInput></View>
                                    </View>
                                    <View style={{marginTop:30}}>
                                        <View><Text style={{fontSize:20,fontWeight:'700'}}>Name</Text></View>
                                        <View style={{marginTop:11,borderColor:'#D7D6D6',borderWidth:1,flexDirection:'row',paddingRight:15,justifyContent:'center',alignItems:'center'}}>
                                            <TextInput style={{flex:1,height:51,paddingHorizontal:7,fontSize:16,fontWeight:'500',lineHeight:20}} placeholder="Required" placeholderTextColor={Color.textGray} onChangeText={(e)=>{if(e.length <11)this.setState({inputFavName : e})}} value={this.state.inputFavName}></TextInput>
                                            <Text style={{fontSize:16,lineHeight:20,fontWeight:'500',color:Color.textGray}}>{this.state.inputFavName.length}/10</Text>
                                        </View>
                                    </View>
                                    <View style={{marginTop:30}}>
                                        <View><Text style={{fontSize:20,fontWeight:'700'}}>Withdrawal address</Text></View>
                                        <View style={{marginTop:11}}>
                                            <TextInput style={{height:51,borderWidth:1,borderColor:'#D7D6D6',paddingHorizontal:7}} value={this.state.inputFavAddress} disabled></TextInput>
                                        </View>
                                    </View>
                                    <View style={{marginTop:27}}>
                                        <RectangleButton style={{height:51,borderRadius:10}} title={"Add"} disable={this.state.inputFavName == "" ? true : false} onPress={()=>this.handleCloseModal({
                                            coin_type : this.state.walletData.coinType,
                                            fav_name: this.state.inputFavName,
                                            fav_address: this.state.inputFavAddress
                                        })}></RectangleButton>
                                    </View>
                                </ScrollView>
                            {/* </KeyboardAwareScrollView> */}
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
    headerView:{
        // position:'relative',disabled
        flex:1,
        paddingVertical:18,
        justifyContent:'center',
        borderColor:'#bebebe',
        borderBottomWidth:1,
        marginBottom:40
    },
    headerText:{
        fontSize :28,
        fontWeight:'bold'
    },
    investment:{
        paddingTop:45,
        paddingHorizontal:16,
    },
    backText : {
        fontSize:18,
        color:"#292929",
        textAlign:'left',
        marginBottom:10,
        fontWeight:'bold',
    },
    Modal:{
        paddingHorizontal:20,
        margin:0,
    },
    ModalContainer:{
        paddingTop:23,
        paddingHorizontal:15,
        borderRadius:20,
        backgroundColor:Color.white,
        width:'100%',
        height:600,
    },
    resultText:{
        fontSize:14,
        fontWeight:'400',
        lineHeight:17,
    },
    defaultTextInput:{
        borderWidth:1,
        borderColor:"#D7D6D6",
        height:50,
        paddingHorizontal:10,
        paddingVertical:0,
    },
    fontSize12:{
        color:"#1B2937",
        lineHeight:12,
        fontSize:10,
        fontWeight:'400'
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'500'
    },
    fontSize18:{
        fontSize:18,
        lineHeight:21,
        fontWeight:'500'
    },
    checkBox:{
        width:15,
        height:15
    },
    anCheckBox: {
        height: 15,
        flexShrink:0,
        // marginRight: 10
    },
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
      },
});


export default WalletSend;
