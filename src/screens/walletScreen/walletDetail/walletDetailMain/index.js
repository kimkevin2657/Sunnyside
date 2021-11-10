import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import RoundButton from '../../../../components/_gmcCustom/RoundButton';
import { FlatList } from 'react-native-gesture-handler';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import PickerCustom from '../../../../components/_gmcCustom/PickerCustom'
import SimpleToast from 'react-native-simple-toast';
import { store } from '@redux/store';
import moment from 'moment';
import { commonApi } from '@common/ApiConnector';
import axios from 'axios';

class WalletDetailMain extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            boardPage : [],
            userCardData: {},
            boardPageData : {},
            pageVisible : false,
            transactionList : [],
            pageNo: 1,
            pageSize: 8,
            isFetching :false,
            isListEnd :false,
            coinData : this.props.navigation.getParam('coinData', {}),
            onRefresh : this.props.navigation.getParam('onRefresh'),
            soltTypeValue : "",
            soltTypeLabel : "",
            soltTypeList : [
                {label : "Recent",value : ""},
                {label : "Oldset",value : "ASC"},
                {label : "Deposit",value : "D"},
                {label : "Withdrawal",value : "W"},
                {label : "others",value : "CAN"}
            ],
            soltPicker : false,
            unit : "$",
            exchangeRate :1
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.navigation.push("WalletMain")
        return true;
    }
    

    isCloseToBottom (){
        this.setState({pageNo : this.state.pageNo + 1})
    }

    // onPressTxId=(item)=>{
    //     let goTxid = false;
    //     var today = new Date().getTime()
    //     var today = moment(today);
    //     var setDate = new Date(item.reg_date).getTime()
    //     var setDate = moment.utc(setDate).add(10, 'm')
    //     var timer = setDate - today;
    //     console.log("index",index)
    //     console.log("날짜",moment.utc(item.reg_date).format('YYYY-MM-DD HH:mm:ss'))
    //     if (moment.utc(setDate).format() <= moment(today).format()) {
    //         this.props.navigation.navigate("WalletTXID")
    //     } else {

    //     } 
    // }


    transactionItem = (item,index)=>{
        const styleTradeType = {
            fontSize:16,
            fontWeight:'bold',
            color:"#4A4A4A"
        }
        let valueRequestAmount = "";
        if (item.trade_type === 'Deposit') {
            styleTradeType.color = 'red';
            valueRequestAmount = Util.currency(item.request_amount)
        }
        if (item.trade_type === 'Withdraw') {
            valueRequestAmount = '-'+Util.currency(item.request_amount)
        }
        // console.log("item :: ",item)
       
        return (
                
                <View style={{borderTopColor:"#BEBEBE",borderTopWidth:1,marginHorizontal:16}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={styles.textBottomPadding}><Text style={{fontSize:16,fontWeight:'bold',color:"#4A4A4A"}}>{item.trade_type}</Text></View>
                        <View style={styles.textBottomPadding}><Text style={styleTradeType}>{valueRequestAmount} {this.state.coinData.coinType}</Text></View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomColor:'#F6F4F4',borderBottomWidth:1}}>
                        <View style={styles.textTopPadding}><Text style={{fontSize:14,color:"#757474"}}>{moment.utc(item.reg_date).format('YYYY-MM-DD HH:mm:ss')}</Text></View>
                        <View style={styles.textTopPadding}><Text style={{fontSize:14,color:"#757474"}}>$ {item.request_amount ? Util.currency(Util.decimalPointEight(+(this.state.userCardData.amount1 * item.request_amount))) : ''}</Text></View>
                    </View>
                    {item.txid != '-' &&
                    <View style={{flexDirection:'row',justifyContent:'space-between',flex:1,marginTop:10}}>
                        <View style={[{flex:1.1,justifyContent:'center',paddingHorizontal:10}]}><Text style={{fontSize:14,fontWeight:'bold',color:"#4A4A4A"}}>Transaction ID</Text></View>
                        {item.txid && item.txid.substr(0, 3) != '202' 
                        ?
                        <TouchableOpacity onPress={()=>{Linking.openURL(item.txidExplorer)}} style={[styles.textBottomPadding,{flex:3}]}>
                            <View><Text style={{fontSize:14,textDecorationLine:"underline",fontWeight:'bold',color:"#4A4A4A"}}>{item.txid}</Text></View>
                        </TouchableOpacity>
                        :
                        <View style={[styles.textBottomPadding,{flex:3}]}>
                            <Text style={{fontSize:14,textDecorationLine:"underline",color:"#4A4A4A"}}>{item.txid && item.txid}</Text>
                        </View>
                        }
                    </View>
                    }
                    <View style={{flexDirection:'row',justifyContent:'space-between',flex:1,marginTop:10}}>
                        <View style={[styles.textTopPadding,{flex:1.1}]}><Text style={{fontSize:14,fontWeight:'bold',color:"#4A4A4A"}}>Status</Text></View>
                        {item.exc_state == "completed"
                            ?
                                <View style={[styles.textTopPadding,{flex:3}]}>
                                    <Text style={{fontSize:14,fontWeight:'bold',color: "#4A4A4A"}}>{item.trade_state}</Text>
                                </View>
                            : 
                                <View style={[{flexDirection:'row',flex:3},styles.textTopPadding]}>
                                    <View style={{paddingTop:4,marginRight:10}}><Text style={{fontSize:14,fontWeight:'bold',color:"#4A4A4A"}}>{item.trade_state}</Text></View>
                                    {item.exc_type == 'CoinBuy' && item.exc_state == 'pending' && !item.txid &&
                                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("WalletTXID")}}>
                                            <View style={styles.txidIcon}>
                                                <Text style={{fontSize:13,fontWeight:'bold',color:"#4A4A4A"}}>TXID INPUT</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                        }
                    </View>
                    {item.user_memo != '' && item.user_memo != null 
                        ?
                        <View style={{flexDirection:'row',justifyContent:'space-between',flex:1}}>
                            <View style={[{flex:1.1,paddingHorizontal:10,paddingBottom:10}]}><Text style={{fontSize:14,fontWeight:'bold',color:"#4A4A4A"}}>memo</Text></View>
                            <View style={[{flex:3,paddingHorizontal:10}]}>
                                <Text style={{fontSize:14,fontWeight:'300',color: "#4A4A4A"}}>{item.user_memo}</Text>
                            </View>
                        </View>
                        :
                        <View style={{flexDirection:'row',justifyContent:'space-between',flex:1}}>
                            <View style={[{flex:1.1,paddingHorizontal:10,paddingBottom:10}]}><Text style={{fontSize:14,fontWeight:'bold',color:"#4A4A4A"}}>Description</Text></View>
                            <View style={[{flex:3,paddingHorizontal:10}]}>
                                <Text style={{fontSize:14,fontWeight:'300',color: "#4A4A4A"}}>{item.description}</Text>
                            </View>
                        </View>
                    }
                    {this.state.soltPicker && index == 0&&
                        <View style={{height:100,width:100,backgroundColor:'#EEEEEE',position:'absolute',top:-10,right:0,justifyContent:'space-evenly'}}>
                            {
                                this.state.soltTypeList.map((v,i)=>{
                                    return(
                                        <TouchableOpacity onPress={()=>{this.setState({soltTypeValue : v.value,soltTypeLabel : v.label,soltPicker : false})}}>
                                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                                <Text style={[styles.fontSize14,{color:"#4A4A4A"}]}>{v.label}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    }
                </View>
            
        )
    }

    

    onClickSend=()=>{
        this.props.navigation.push("WalletSend",{coinData : this.state.coinData,exchangeRate:this.state.exchangeRate,unit:this.state.unit})
    }

    onClickReceive=()=>{
        this.props.navigation.push("WalletReceive",{coinType : this.state.coinData.coinType})
    }

    onClickSwap=()=>{
        this.props.navigation.push("WalletSwap",{coinData : this.state.coinData,exchangeRate:this.state.exchangeRate,unit:this.state.unit, onRefresh: this.state.onRefresh})
    }

    onClickPurchase=()=>{
        this.props.navigation.push("WalltePurchase",{coinData : this.state.coinData,exchangeRate:this.state.exchangeRate,unit:this.state.unit})
    }


    makeAddress = (coinType) => {
        const response = commonApi('put', '/exchange/createAccount', coinType);
        response.then(( data ) => {
        })
        .catch(e => console.log(e));
        }
    getWalletChk = ()  => {
        const paramCoinType = this.state.coinData.coinType ? this.state.coinData.coinType : {};
        const response = commonApi('post', '/exchange/account', paramCoinType);
        response.then((result) => {
            // console.log(result)
            if (result.data.success) {
                if (result.data.data.account.address == "") {
                    makeAddress(paramCoinType)
                }
            }
        }).catch((e) => {
            console.log('ee', e)
        })
    }


    getWalletData = () => {
        let paramCoinType = this.state.coinData.coinType ? this.state.coinData.coinType : {};

        if(paramCoinType.coinType === undefined){
            paramCoinType = {coinType: paramCoinType }
        }
        // console.log('pct',paramCoinType)
        //get user info
        const userCardResponse = commonApi('post', '/asset/accountList');
        userCardResponse.then(({ data }) => {
                var result = data.result
                var resultData = data.result.coins
                let amount;
                if (paramCoinType.coinType == 'DFSD') {
                    amount = 1
                } else if (paramCoinType.coinType == 'DFSC') {
                    amount = 0.02
                } else {
                    amount = result[`${paramCoinType.coinType.toLowerCase()}`]?.price;
                }
                resultData.forEach(element => {
                    if (element.coin_type == paramCoinType.coinType) {
                        var setParam = {
                            coinType: element.coin_type,
                            coinImage: element.file_url,
                            balance: element.exchange_can == undefined ? 0 : element.exchange_can,
                            amount1: amount, // $37,831,07
                            amount2: amount * element.exchange_can, // $0.000
                            // detailURL: `/wallet/WalletDetail/${page}`
                        }
                        // console.log(setParam)
                        this.setState({
                            userCardData : setParam
                        })
                    }
                });
        })
        .catch(e => {
            console.log('cacth',e)
            // localStorage.clear();
            // window.location.replace('/auth/login')
        }); // 401일때 로그인으로 보냄
        this.getWalletDetailData(paramCoinType.coinType,this.state.soltTypeValue)
        
    }
    getWalletDetailData = (coinType, excType) => {
        // console.log("isFetching :: ",this.state.isFetching)
        // console.log("isListEnd :: ",this.state.isListEnd)
        // console.log("excType",excType)
        // console.log("this." , this.state.transactionList)
        if (this.state.isFetching || this.state.isListEnd) {
            return;
        }
        this.setState({
            isFetching : true,
        });
        const param = {
            "coinType": coinType === undefined ? this.state.coinData.coinType: coinType ,
            "exc_type" : excType ? excType : "",
            "page_size": this.state.pageSize,
            "page_no": this.state.pageNo
        }

        //txlist
        // console.log(param)
        const txDataResponse = commonApi('post', '/exchange/inOutWDList', param);
        txDataResponse.then(({ data }) => {
            // console.log("WD",data)
            var pagingData = data.exchangeStakingListPaging
            var tempListData = data.list
            console.log(data.list)
            var tempSetWalletData = []
            this.setState({
                pageVisible : pagingData.totalCount > 0 ? true : false
            })
            tempListData.forEach(element => {

                if (element.txid == '') {
                    element.txid = "-"
                }
                if (element.exc_type == 'W') {
                    element.trade_type = "Withdraw"
                    element.trade_state = "CoinSend Request"
                    element.exc_type = "withdraw"
                    element.text_color = "#141EFF"
                } else if (element.exc_type == 'D') {
                    element.trade_type = "Deposit"
                    element.trade_state = "Deposit"
                    element.exc_type = "deposit"
                    element.text_color = "#FF1212"
                } else if (element.exc_type == 'DC') {
                    element.trade_type = "Deposit"
                    element.trade_state = "Admin Deposit"
                    element.exc_type = "Admin deposit"
                    element.text_color = "#FF1212"
                } else if (element.exc_type == 'LS') {
                    element.trade_type = "Withdraw"
                    element.trade_state = "Staking Withdraw"
                    element.exc_type = "staking withdraw"
                    element.text_color = "#141EFF"
                } else if (element.exc_type == 'WIC') {
                    element.trade_type = "Withdraw"
                    element.trade_state = "ICO LOCKUP"
                    element.exc_type = 'ico lockup'
                    element.text_color = "#141EFF"
                } else if (element.exc_type == 'DIC') {
                    element.trade_type = "Deposit"
                    element.trade_state = "ICO Deposit"
                    element.exc_type = 'deposit ICO'
                    element.text_color = "#FF1212"
                } else if (element.exc_type == 'WSW') {
                    element.trade_type = "Withdraw"
                    element.trade_state = "CoinSwap"
                    element.exc_type = 'withdrawCoinSwap'
                    element.text_color = "#141EFF"
                } else if (element.exc_type == 'DSW') {
                    element.trade_type = "Deposit"
                    element.trade_state = "CoinSwap"
                    element.exc_type = 'depositCoinSwap'
                    element.text_color = "#FF1212"
                } else if (element.exc_type == 'DSL') {
                    element.trade_type = "Deposit"
                    element.trade_state = "Staking Revenue"
                    element.exc_type = 'Deposit Staking Revenue'
                    element.text_color = "#FF1212"
                } else if (element.exc_type == 'DBY') {
                    element.trade_type = "Deposit"
                    element.trade_state = "CoinBuy Request"
                    element.exc_type = 'CoinBuy' 
                    element.text_color = "#FF1212"
                } else if (element.exc_type == 'DR') {
                    element.trade_type = "Deposit"
                    element.trade_state = "Referral Revenue"
                    element.exc_type = 'Deposit Referral Revenue'
                    element.text_color = "#FF1212"
                } else {
                    element.exc_type = "transaction"
                }

                if (element.exc_state == 'OK') {
                    element.exc_state = "completed"
                } else if (element.exc_state == 'CAN') {
                    element.exc_state = "cancel"
                } else if (element.exc_state == 'REJ') {
                    element.exc_state = "rejected - amount returned"
                } else {
                    element.exc_state = "pending"
                }

                if (param.coinType == 'BTC') {
                    element.txidExplorer = 'https://www.blockchain.com/btc/tx/' + element.txid
                } else {
                    element.txidExplorer = 'https://etherscan.io/tx/' + element.txid
                }
               
                tempSetWalletData.push(element)
            })
            
            if(this.state.pageNo <= data.exchangeStakingListPaging.endPageNo) {
                let newtempSetWalletData = tempSetWalletData.slice(this.state.transactionList.length,this.state.pageNo * this.state.pageSize)
                this.setState({
                    transactionList: [...this.state.transactionList, ...newtempSetWalletData],
                    isFetching : false,
                })
            } else {
                this.setState({
                    isFetching : false,
                    isListEnd : true,
                });
            }
            // this.setState({
            //     transactionList : tempSetWalletData
            // })
            // console.log('페이지',this.state.page)
            // const obj = {
            //     items: tempSetWalletData,
            //     align: 'center',
            //     viewPage: 10,
            //     event: this.onChangeBoardPage(),
            //     totalItems: pagingData.totalCount,
            //     currentItem:Number(this.state.page),
            //     // getItems: movePage,
            // }
            // this.setState({
            //     boardPageData : obj
            // })
        })
            .catch(e => {
                console.log(e)
                // localStorage.clear();
                // window.location.replace('/auth/login')
            });//401일때 로그인으로 보냄 

    }
    onChangeBoardPage = (e) => {
        this.setState({
            boardPage : e
        })
    };

    componentDidMount=()=>{
    //  this.getWalletChk() 
        this.getWalletData()
    }

    componentDidUpdate=(prevProps,prevState)=>{
        if(prevState.pageNo != this.state.pageNo){
            this.getWalletDetailData(this.state.coinData.coinType,this.state.soltTypeValue)
        }
        if(prevState.soltTypeValue != this.state.soltTypeValue){
            this.setState({
                pageNo : 1,
                transactionList : []
            })
            this.getWalletDetailData(this.state.coinData.coinType,this.state.soltTypeValue)
        }
    }

    render() {
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    {/* 지갑 메인 */}
                    <HeaderBar iconOnPress={()=>{this.props.navigation.push("WalletMain")}} title={"Wallet"} border></HeaderBar>
                        <FlatList
                            data={this.state.transactionList}
                            ListHeaderComponent = {
                                <>
                                <ExchangeBox exchangeBoxStyle={{marginBottom:20,marginTop:40,borderWidth :2,borderColor:"#000000"}} data={this.state.coinData} exchangeRate={this.state.exchangeRate} unit={this.state.unit} border  disabled={true}/>
                
                                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:40}}>
                                    <RoundButton title={"RECEIVE"} style={{marginRight:10}} fontWeight="bold" icon={Images.receive} onPress={()=>{this.onClickReceive()}}></RoundButton>
                                    <RoundButton title={"SEND"} style={{marginRight:10}} fontWeight="bold" icon={Images.send}  onPress={()=>{this.onClickSend()}}></RoundButton>
                                    <RoundButton title={"SWAP"} style={{marginRight:10}} fontWeight="bold" icon={Images.swap} onPress={()=>{this.onClickSwap()}}></RoundButton>
                                    <RoundButton title={"BUY"} style={{}} icon={Images.purchase} fontWeight="bold" onPress={()=>{this.onClickPurchase()}}></RoundButton>
                                </View>

                                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                                    <View style={{height:30}}><Text style={{fontSize:16,fontWeight:'bold'}}>{this.state.coinData.coinType} transaction details</Text></View>
                                    <View>
                                        <PickerCustom  pickerStyle={{backgroundColor:"#EEEEEE",padding:10}} pickerTextStyle={styles.pickerTextStyle} selected={this.state.soltTypeLabel == "" ? "Recent" : this.state.soltTypeLabel } onPress={()=>{this.setState({soltPicker : !this.state.soltPicker})}}></PickerCustom>
                                    </View>
                                </View>
                                </>
                            }
                            ListHeaderComponentStyle={{paddingHorizontal:16}}
                            renderItem={({item,index})=>this.transactionItem(item,index)}
                            ListEmptyComponent={
                                <>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',height:223,borderColor:"#BEBEBE",borderBottomWidth:1,}}>
                                    <View style={{marginTop:7}}><Text style={[styles.fontSize14,{color:'#DCDBDB'}]}>no transactions.</Text></View>
                                </View>
                                
                                    {this.state.soltPicker && 
                                    <View style={{height:100,width:100,backgroundColor:'#EEEEEE',position:'absolute',top:278,right:16,justifyContent:'space-evenly'}}>
                                        {
                                            this.state.soltTypeList.map((v,i)=>{
                                                return(
                                                    <TouchableOpacity onPress={()=>{this.setState({soltTypeValue : v.value,soltTypeLabel : v.label,soltPicker : false})}}>
                                                        <View style={{justifyContent:'center',alignItems:'center'}}>
                                                            <Text style={[styles.fontSize14,{color:"#4A4A4A"}]}>{v.label}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                }
                                </>
                            }
                            onEndReachedThreshold = {0.5}
                            onEndReached = {() => {!this.state.isFetching && !this.state.isListEnd && this.isCloseToBottom()}}
                            keyExtractor={(item, index) => `${index}`}
                        />
                    <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    investment:{
        // paddingTop:45,
        // paddingBottom:80,
        paddingHorizontal:16,
    },
    backText : {
        fontSize:18,
        color:"#292929",
        textAlign:'left',
        marginBottom:10,
        fontWeight:'bold',
    },
    textTopPadding:{
        paddingHorizontal:10,
        paddingTop:4,
        paddingBottom:10
    },
    textBottomPadding:{
        justifyContent:'center',
        paddingHorizontal:10,
        paddingTop:10,
        paddingBottom:4
    },
    txidIcon:{
        width:100,
        height:30,
        // paddingHorizontal:5,
        backgroundColor:"#FFD700",
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    fontSize12:{
        color:"#1B2937",
        lineHeight:12,
        fontSize:10,
        fontWeight:'400'
    },
    pickerTextStyle : {
        fontSize:14,
        lineHeight:17,
        fontWeight:'400',
        color:'#606060'
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'bold'
    },
});


export default WalletDetailMain;
