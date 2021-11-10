import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert,FlatList, Linking,TouchableOpacity, BackHandler,Text, ScrollView, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
// import { FlatList,TouchableOpacity } from 'react-native-gesture-handler';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import Modal from "react-native-modal";
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import CoinIdText from '../../../../components/_gmcCustom/CoinIdText'
import QRCode from 'react-native-qrcode-svg';
import { store } from '@redux/store';
import PickerCustom from '../../../../components/_gmcCustom/PickerCustom'
import SelectDropdown from 'react-native-select-dropdown';
import { commonApi } from '@common/ApiConnector';
import SimpleToast from 'react-native-simple-toast';

const { currency } = Util;
const otherCoinList = ['ADA','EOS','XRP'];

class WalltePurchase extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalShow : false,
            coinData : this.props.navigation.getParam('coinData', {}),
            purchaseCoin : 0,
            maxSendValue : 0,
            maxPurchaseCoin : 0,
            maxCheck : false,
            // depositAddress : "812cb6aa93dvber07e8ee121665dcd4c82e3077",
            memo : '',
            destinationTag : "18921489421890",
            purchaseCoinTypeList : [
                {type : "DFSC",balance : 20 , exchangeRate : 10000},
                {type : "EOS",balance : 20 , exchangeRate : 20000},
                {type : "XRP",balance : 20 , exchangeRate : 30000},
            ],
            purchaseCoinType : "DFSC",
            purchaseCoinBalance : 20,
            purchaseCoinExchange : 10000,
            purchaseCoinPicker : false,
            moneyType : store.getState().user.moneyType || "USD",
            sendCoin : 0,
            unit : this.props.navigation.getParam("unit","$"),
            exchangeRate :this.props.navigation.getParam("exchangeRate",1),
    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                    from walletSwap                                     //
    ////////////////////////////////////////////////////////////////////////////////////////////
            sendCoin: '',
            receiveCoin: '',
            maxSendValue: 0,
            maxReceiveValue: 0,
            maxUSD: '',
            totalUSD: '',
            dropDownList: [],
            accountList: {},
            selectedReceiveCoin: '',
            selectedExchangeUSD: '',
            focus: 'send',
            receiveImage: '',
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

    decimalEight(number) {
        let value;
        if(number.toString().split('.').length == 2) {
            value = number.toString().split('.')[0]+'.'+number.toString().split('.')[1].substring(0,8);
        } else {
            value = number;
        }
        //return type is str
        return value;
    }

    coinId =()=>{
        if(this.state.purchaseCoinType ==="EOS"){
            return(
            <View style={{marginTop:54,marginHorizontal:25}}>
                <Text style={styles.fontSize14}>Deposit address (account name)</Text>
                <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                    <CoinIdText coinId={this.state.depositAddress}></CoinIdText>
                </View>
                <Text style={[styles.fontSize14,{marginTop:23}]}>Deposit memo (MEMO)</Text>
                <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                    <CoinIdText coinId={this.state.memo}></CoinIdText>
                </View>
                
            </View>
            )
        }else if(this.state.purchaseCoinType === "XRP"){
            return(
            <View style={{marginTop:54,marginHorizontal:25}}>
                <Text style={styles.fontSize14}>Deposit address (account name)</Text>
                <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                    <CoinIdText coinId={this.state.depositAddress}></CoinIdText>
                </View>
                <Text style={[styles.fontSize14,{marginTop:23}]}>Destination tag</Text>
                <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                    <CoinIdText coinId={this.state.destinationTag}></CoinIdText>
                </View>
                
            </View>
            )
        }else{
            return(
                <View style={{marginTop:23,marginHorizontal:25,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                    <CoinIdText coinId={this.state.depositAddress}></CoinIdText>
                </View>
            );
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    //                                    from walletSwap                                     //
    ////////////////////////////////////////////////////////////////////////////////////////////

    decimalEight(number) {
        let value;
        if(number.toString().split('.').length == 2) {
            value = number.toString().split('.')[0]+'.'+number.toString().split('.')[1].substring(0,8);
        } else {
            value = number;
        }
        //return type is str
        return value;
    }

    onClickMaxSend=(e)=>{
        this.setState({maxCheck: e})
        if(e) {
            this.onChangeSendCoin(this.state.maxSendValue)
            this.onChangeReceiveCoin(this.state.maxReceiveValue)
        } else {
            this.onChangeSendCoin('')
            this.onChangeReceiveCoin('')
        }
    }

    onChangeSendCoin=(value)=>{
        let input = currency(this.decimalEight(value.toString().replace(/[^0-9,.]/g, '')));
        if(Number(this.deleteComma(input)) > this.state.maxSendValue) input = currency(this.decimalEight(this.state.maxSendValue.toString().replace(/[^0-9,.]/g, '')))
        let tempAmount = this.state.coinData.coinType == "DFSD" ? this.state.coinData.amount1 : this.state.coinData.amount1*(1-0.003)
        if(input.split('.').length <= 2) {
            this.setState({
                focus: 'send',
                sendCoin: input,
                receiveCoin: currency(this.decimalEight((this.deleteComma(input) * tempAmount)/Number(this.state.selectedExchangeUSD))) == '0' ? '' : currency(this.decimalEight((this.deleteComma(input) * tempAmount)/Number(this.state.selectedExchangeUSD)))
            })
        }
    }

    onChangeReceiveCoin=(value)=>{
        let input = currency(this.decimalEight(value.toString().replace(/[^0-9,.]/g, '')));
        if(Number(this.deleteComma(input)) > this.state.maxReceiveValue) input = currency(this.decimalEight(this.state.maxReceiveValue.toString().replace(/[^0-9,.]/g, '')))
        let tempAmount = this.state.coinData.coinType == "DFSD" ? this.deleteComma(currency(this.decimalEight(this.state.coinData.amount1))) : this.deleteComma(currency(this.decimalEight(this.state.coinData.amount1*(1-0.003))))
        if(input.split('.').length <= 2) {
            this.setState({
                focus: 'receive',
                sendCoin: currency(this.decimalEight(this.deleteComma(input)*this.state.selectedExchangeUSD/tempAmount)) == '0' ? '' : currency(this.decimalEight(this.deleteComma(input)*this.state.selectedExchangeUSD/tempAmount)),
                receiveCoin: input
            })
        }
    }

    getAccountList = () => {
        const userCardResponse = commonApi('post', '/asset/accountList');
        userCardResponse.then(({data}) => {
            var resultCoins = data.result.coins
            var result = data.result;
            let tempList = [];
            for (var i = 0; i < resultCoins.length; i++) {
                if (resultCoins[i].coin_type != this.state.coinData.coinType && resultCoins[i].coin_type != "DFSC") {
                    tempList.push(resultCoins[i].coin_type)
                }
            }
            for ( let i = 0; i < otherCoinList.length; i++) {
                tempList.push(otherCoinList[i])
            }
            let tempExUSD = tempList[0] == "DFSD" ? String(1) : result[tempList[0].toLowerCase()].price;
            let tempReceiveImage = '';
            resultCoins.map((value) => {
                if(value.coin_type == tempList[0]) tempReceiveImage = value.file_url
            })
            if(tempReceiveImage == '') {
                if (tempList[0] == 'ADA') {
                    tempReceiveImage = 'https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/ADA20210713182844.png'
                } else if (tempList[0] == 'XRP') {
                    tempReceiveImage = 'https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/XRP20210713182833.jpg'
                } else if (tempList[0] == 'EOS') {
                    tempReceiveImage ='https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/EOS20210713182822.png'
                }
            }
            this.setState({
                selectedReceiveCoin: tempList[0],
                selectedExchangeUSD: tempExUSD,
                dropDownList: tempList,
                accountList: result,
                receiveImage: tempReceiveImage
            })
            this.setMaxReceiveValue(tempExUSD)
        })
        .catch(e => {
            console.log('getAccountList error:: ', e)
        });
    }

    onPressConfirm = () => {
        // 백엔드 디자인상 반대로 값 넣어야 함
        let params = {
            "from_coin_type": this.state.selectedReceiveCoin,
            "from_coin_amount": String(this.deleteComma(this.state.receiveCoin)),
            "to_coin_type": this.state.coinData.coinType,
            "to_coin_amount": String(this.deleteComma(this.state.sendCoin))
        }
        const response = commonApi('post', '/exchange/coinBuy', params);
        response.then((result) => {
            if (result.success) {
                if (result.data) {
                    this.props.navigation.navigate("WalltePurchaseWaiting",{
                        purchaseCoinType : this.state.selectedReceiveCoin,
                        purchaseCoin: result.data.from_coin_amount,
                        memo : result.data.memo,
                        destinationTag : this.state.destinationTag,
                        receiveImage: this.state.receiveImage
                        }
                    )
                } else {
                    console.log(result)
                    SimpleToast.show('Warning', 'Server Connection Failed', SimpleToast.SHORT)
                }
            } else {
                console.log(result)
                SimpleToast.show('Warning', 'Server Connection Failed', SimpleToast.SHORT)
            }
        })
        .catch(e => {
            console.log('Coin Swap Error ::', e)
        })
    }

    updateSelectedItem(selectedItem) {

        let tempReceiveImage = '';
        this.state.accountList.coins.map((value) => {
            if(selectedItem == value.coin_type) {
                tempReceiveImage = value.file_url;
            }
        })
        if (selectedItem == 'ADA') {
            tempReceiveImage = 'https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/ADA20210713182844.png'
        } else if (selectedItem == 'XRP') {
            tempReceiveImage = 'https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/XRP20210713182833.jpg'
        } else if (selectedItem == 'EOS') {
            tempReceiveImage ='https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/EOS20210713182822.png'
        }

        if(selectedItem == "DFSD") {
            this.setState({
                selectedReceiveCoin: selectedItem,
                selectedExchangeUSD: String(1),
                receiveImage: tempReceiveImage
            })
            this.setMaxReceiveValue(String(1))
        } else {
            this.setState({
                selectedReceiveCoin: selectedItem,
                selectedExchangeUSD: this.state.accountList[selectedItem.toLowerCase()].price,
                receiveImage: tempReceiveImage
            })
            this.setMaxReceiveValue(this.state.accountList[selectedItem.toLowerCase()].price)
        }
    }

    setMaxReceiveValue(exUSD) {
        let tempRate;
        let tempValue;

        if(this.state.coinData.coinType == "DFSD") {
            tempRate = Util.decimalPointEight(this.state.coinData.amount1)
        } else {
            tempRate = Util.decimalPoint(Util.decimalPointEight(this.state.coinData.amount1*(1-0.003)), 2)
        }
        tempValue = tempRate * this.state.coinData.balance / exUSD;
        this.setState({
            maxReceiveValue: Util.decimalPointEight(tempValue)
        })
    }

    componentDidMount() {
        if(this.state.unit == "USD") {
            this.setState({
                unit: '$'
            })
        }
        this.setState({
            maxSendValue: this.state.coinData.balance
        })
        this.getAccountList()
        this.setMaxUSD()
    }

    setMaxUSD() {
        if(this.state.coinData.coinType == "DFSD") {
            this.setState({
                maxUSD: currency(this.decimalEight(this.deleteComma(this.state.coinData.balance) * this.state.coinData.amount1))
            }) 
        } else {
            this.setState({
                maxUSD: currency(this.decimalEight(this.deleteComma(this.state.coinData.balance)*this.state.coinData.amount1*(1-0.003)))
            })
        }
    }

    setTotalUSD() {
        if(this.state.coinData.coinType == "DFSD") {
            this.setState({
                totalUSD: currency(this.decimalEight(this.deleteComma(this.state.sendCoin) * this.state.coinData.amount1))
            }) 
        } else {
            this.setState({
                totalUSD: currency(this.decimalEight(this.deleteComma(this.state.sendCoin)*this.state.coinData.amount1*(1-0.003)))
            })
        }
    }

    convertCoin() {
        if(this.state.focus == "send") {
            this.onChangeSendCoin(this.state.sendCoin)
        } else { 
            this.onChangeReceiveCoin(this.state.receiveCoin)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.sendCoin != this.state.sendCoin) {
            this.setTotalUSD()
        }
        if(prevState.selectedReceiveCoin != this.state.selectedReceiveCoin) {
            this.convertCoin()
        }
    }

    deleteComma(number) {
        let value;
        if(number.toString().split('.').length == 2) {
            value = number.toString().split('.')[0].replace(/,/g, '')+'.'+number.toString().split('.')[1]
        } else {
            value= number.replace(/,/g, '')
        }
        return Number(value)
    }

    render() {
        const data = {name : 'DFSD',amount:1,cost:'37,831,07',assets:'0.000'}
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Buy"></HeaderBar>
                <ScrollView>
                    <View style={styles.container}>

                        <View style={{marginTop:28}}>
                                <View style={{height:30,flex:1}}><Text style={styles.fontSize16}>My assets</Text></View>
                                <ExchangeBox exchangeBoxStyle={{marginBottom:20,backgroundColor:'#FAFAFA'}} data={this.state.coinData} unit={this.state.unit} disabled={true} />
                            </View>

                        <View style={{marginTop:51,borderWidth:1,borderColor:'#D7D6D6',paddingVertical:8,paddingLeft:14,paddingRight:12,flexDirection:'row',height:50}}>
                            <View style={{borderRightWidth:1,borderColor:"#D7D6D6",paddingRight:16,justifyContent:'center'}}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Image source={Images[`${this.state.coinData.coinType}`]} style={{width:17,height:17,marginRight:6}}></Image>
                                    <Text style={styles.fontSize16}>{this.state.coinData.coinType}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                <TextInput style={[styles.fontSize16, {flex:1,textAlign:'right',padding:0}]} onChangeText={(value)=>{this.onChangeSendCoin(value)}} keyboardType="numeric" placeholder={`0`} value={this.state.sendCoin} placeholderTextColor={Color.textGray}></TextInput>
                                <Text style={[styles.fontSize16,{marginLeft:5}]}>{this.state.coinData.coinType}</Text>
                            </View>
                        </View>
                        <View style={{marginTop:2,paddingHorizontal:14,justifyContent:'space-between',flexDirection:'row'}}>
                            <Text style={[styles.fontSize10,{color:"#A1A9B0"}]}>{this.state.unit} {this.state.coinData.coinType == "DFSD" ? currency(this.decimalEight(this.state.coinData.amount1)) : currency(this.decimalEight(this.state.coinData.amount1*(1-0.003)))}</Text>
                            <Text style={[styles.fontSize10,{color:"#A1A9B0"}]}>{this.state.unit == "$" ? "USD" : this.state.unit} {this.state.totalUSD}</Text>
                        </View>

                        {/* <View style={{marginTop:17,alignItems:'center'}}>
                            <Image source={Images.bottomArrow} style={{width:30,height:30}}></Image>
                        </View> */}

                        <View style={{marginTop:20}}>
                            <View style={{marginTop:7,borderWidth:1,borderColor:'#D7D6D6',paddingVertical:8,paddingLeft:14,paddingRight:12,flexDirection:'row',height:50}}>
                                <View style={{borderRightWidth:1,borderColor:"#D7D6D6",justifyContent:'center'}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Image source={Images[`${this.state.selectedReceiveCoin}`]} style={{width: this.state.selectedReceiveCoin == "ETH" ? 12 : 17,height:17,marginRight:6}}></Image>
                                        <SelectDropdown
                                            buttonStyle={{
                                                paddingLeft:0,
                                                paddingRight:0,
                                                width:55,
                                                backgroundColor:'white',
                                                borderTopWidth: 1,
                                                borderBottomWidth: 1,
                                                borderColor: '#D7D6D6'
                                            }}
                                            buttonTextStyle={{
                                                marginRight:0,
                                                marginLeft:0,
                                                fontSize:16,
                                                textAlign:'left'
                                            }}
                                            rowTextStyle={{
                                                fontSize:15
                                            }}
                                            data={this.state.dropDownList}
                                            defaultButtonText={this.state.selectedReceiveCoin}
                                            onSelect={(selectedItem, index) => this.updateSelectedItem(selectedItem)}
                                        />
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                    <TextInput style={[styles.fontSize16, {flex:1,textAlign:'right',padding:0}]} keyboardType="numeric" placeholder={"0"} onChangeText={(e)=>{this.onChangeReceiveCoin(e)}} value={this.state.receiveCoin} placeholderTextColor={Color.textGray} disable></TextInput>
                                    <Text style={[styles.fontSize16,{marginLeft:5}]}>{this.state.selectedReceiveCoin}</Text>
                                </View>
                            </View>
                            <View style={{marginTop:2,paddingHorizontal:14,justifyContent:'space-between',flexDirection:'row'}}>
                                <Text style={[styles.fontSize10,{color:"#A1A9B0"}]}>{this.state.unit} {Util.currency(Util.decimalPointEight(this.state.selectedExchangeUSD))}</Text>
                                <Text style={[styles.fontSize10,{color:"#A1A9B0"}]}>{this.state.unit == "$" ? "USD" : this.state.unit} {this.state.totalUSD}</Text>
                            </View>
                        </View>

                        {/* <View style={{marginTop:84}}>
                            <Text style={styles.headerText}>Deposit address</Text>
                            <Text style={[styles.fontSize14,{marginTop:5,color:'#1B2937'}]}>Copy the deposit address below or scan the QR code.</Text>
                        </View> */}
                        
                        <View style={{flex:1,alignItems:'center',marginTop:33}}>
                            {/* <QRCode size={110} value={this.state.depositAddress}/> */}
                            </View>
                            {/* {this.coinId()} */}
                            <View style={{marginTop:58,backgroundColor:"#F9F9F9",flex:1,paddingVertical:20,paddingHorizontal:30}}>
                                <View style={{flexDirection:"row",alignItems:'center'}}>
                                    <Image source={Images.reminder} style={{width:11,height:11,marginRight:5}}></Image>
                                    <Text style={{fontWeight:'400',fontSize:12,lineHeight:14,color:'#FF0000'}}>Deposit notice</Text>
                                </View>
                                <View style={[{marginTop:11},]}>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}>The quantity may change in real-time depending on market price changes, so if it is difficult to proceed with the purchase, you need to refresh the page.</Text>
                                    </View>
                                <View style={{flexDirection:'row',flex:1,}}>
                                    <Text style={[styles.warnText,{}]}>· </Text>
                                    <View>
                                        <Text style={styles.warnText}>Next step, make the deposit in 10 minutes.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{marginTop:36,paddingHorizontal:18,marginBottom:83, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <RectangleButton 
                                style={{height:52, width: '47%'}}
                                title={"Cancel"}
                                onPress={()=> this.props.navigation.goBack()}
                            />
                            <RectangleButton 
                                style={{height:52, width: '47%'}}
                                title={"Deposit"}
                                disable={this.state.sendCoin != '' ? false: true}
                                onPress={()=>this.onPressConfirm()}
                            />
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
        paddingHorizontal:20
    },
    headerView:{
        // position:'relative',
        flex:1,
        paddingVertical:18,
        justifyContent:'center',
        borderColor:'#bebebe',
        borderBottomWidth:1,
        marginBottom:40
    },
    
    resultText:{
        fontSize:14,
        fontWeight:'400',
        lineHeight:17,
    },
    defaultTextInput:{
        borderWidth:1,
        borderColor:"#D7D6D6",
        height:30,
        paddingHorizontal:10,
        paddingVertical:0,
    },
    fontSize10:{
        lineHeight:12,
        fontSize:10,
        fontWeight:'400'
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'400'
    },  
    fontSize16:{
        fontSize:16,
        lineHeight:20,
        fontWeight:'500'
    },
    headerText:{
        fontSize:16,
        lineHeight:20,
        fontWeight:'700',
    },
    warnText:{
        fontSize:11,
        lineHeight:16,
        fontWeight:'400',
        color:"#4A4A4A"
    },
    pickerTextStyle : {
        fontSize:14,
        lineHeight:17,
        fontWeight:'400',
        color:'#606060'
    },
});


export default WalltePurchase;
