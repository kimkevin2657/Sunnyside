import React from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, ScrollView, TextInput, BackHandler} from 'react-native';
import { Color, Styles, Images, Util } from '@common';
import { commonApi } from '@common/ApiConnector';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import CheckBox from '@react-native-community/checkbox';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import SimpleToast from 'react-native-simple-toast';
import Modal from "react-native-modal";

const { currency, decimalPointEight } = Util;

class WalletSwap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            coinData : this.props.navigation.getParam('coinData', {}),
            unit : this.props.navigation.getParam("unit","$"),
            onRefresh : this.props.navigation.getParam("onRefresh"),
            maxCheck: false,
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
            modalShow: false
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
            let tempExUSD = tempList[0] == "DFSD" ? String(1) : result[tempList[0].toLowerCase()].price;
            this.setState({
                selectedReceiveCoin: tempList[0],
                selectedExchangeUSD: tempExUSD,
                dropDownList: tempList,
                accountList: result
            })
            this.setMaxReceiveValue(tempExUSD)
        })
        .catch(e => {
            console.log('getAccountList error:: ', e)
        });
    }

    onPressConfirm = () => {
        let params = {
            "from_coin_type": this.state.coinData.coinType,
            "from_coin_amount": String(this.deleteComma(this.state.sendCoin)),
            "to_coin_type": this.state.selectedReceiveCoin,
            "to_coin_amount": String(this.deleteComma(this.state.receiveCoin))
        }
        const response = commonApi('post', '/exchange/swapCoin', params);
        response.then((result) => {
            if (result.success) {
                if (result.data) {
                    this.setState({
                        modalShow: false
                    })
                    this.props.navigation.navigate("WalletSwapComplet",{
                        requestCoinType : this.state.selectedReceiveCoin,
                        requestCoin : result.data.to_coin_amount,
                        sendCoin :this.state.sendCoin,
                        sendCoinType:this.state.coinData.coinType,
                        requestPrice : this.state.selectedExchangeUSD,
                        sendPrice : this.state.coinData.coinType == "DFSD" ? currency(this.decimalEight(this.state.coinData.amount1)) : currency(this.decimalEight(this.state.coinData.amount1*(1-0.003))),
                        unit: this.state.unit,
                        coinData: this.state.coinData,
                        onRefresh: this.state.onRefresh
                    })
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
        if(selectedItem == "DFSD") {
            this.setState({
                selectedReceiveCoin: selectedItem,
                selectedExchangeUSD: String(1),
            })
            this.setMaxReceiveValue(String(1))
        } else {
            this.setState({
                selectedReceiveCoin: selectedItem,
                selectedExchangeUSD: this.state.accountList[selectedItem.toLowerCase()].price
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
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} border title="Swap"></HeaderBar>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0}>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={{marginTop:28}}>
                                <View style={{height:30,flex:1}}><Text style={styles.fontSize16}>My assets</Text></View>
                                <ExchangeBox exchangeBoxStyle={{marginBottom:20,backgroundColor:'#FAFAFA', borderWidth:2,borderColor:"#000000"}} border data={this.state.coinData} unit={this.state.unit} disabled={true} />
                            </View>
                            <View style={{marginTop:44}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{height:30,justifyContent:'center'}}><Text style={styles.fontSize16}>Send</Text></View>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={[styles.fontSize16,{color:'#858585',marginRight:5}]}>Use all</Text>
                                        <CheckBox style={Platform.OS=="ios" ? styles.checkBox:styles.anCheckBox} tintColors={{ true:'#3A7BD5',false: '#858585'}} value={this.state.maxCheck} onValueChange={(e)=>{
                                            this.onClickMaxSend(e)
                                        }}
                                        />
                                    </View>
                                </View>
                                <View style={{marginTop:7,borderWidth:1,borderColor:'#D7D6D6',paddingVertical:8,paddingLeft:14,paddingRight:12,flexDirection:'row',height:50}}>
                                    <View style={{borderRightWidth:1,borderColor:"#D7D6D6",paddingRight:16,justifyContent:'center'}}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Image source={Images[`${this.state.coinData.coinType}`]} style={{width:17,height:17,marginRight:6}}></Image>
                                            <Text style={styles.fontSize16}>{this.state.coinData.coinType}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                        <TextInput style={[styles.fontSize16, {flex:1,textAlign:'right',padding:0}]} onChangeText={(value)=>{this.onChangeSendCoin(value)}} keyboardType="numeric" placeholder={`Please enter the amount of ${this.state.coinData.coinType} to use for Purchase`} value={this.state.sendCoin} placeholderTextColor={"#A1A9B0"}></TextInput>
                                        <Text style={[styles.fontSize16,{marginLeft:5}]}>{this.state.coinData.coinType}</Text>
                                    </View>
                                </View>
                                <View style={{marginTop:2,justifyContent:'space-between',flexDirection:'row'}}>
                                    <Text style={[styles.fontSize14,{color:"black"}]}>{this.state.unit} {this.state.coinData.coinType == "DFSD" ? currency(this.decimalEight(this.state.coinData.amount1)) : currency(this.decimalEight(this.state.coinData.amount1*(1-0.003)))}</Text>
                                    <Text style={[styles.fontSize14,{color:"black"}]}>{this.state.totalUSD} {this.state.unit == "$" ? "USD" : this.state.unit}</Text>
                                </View>
                                <View style={{marginTop:33,alignItems:'center'}}>
                                    <Image source={Images.bottomArrow} style={{width:30,height:30}}></Image>
                                </View>
                                <View style={{marginTop:44}}>
                                    <View style={{}}>
                                        <Text style={styles.fontSize16}>Receive</Text>
                                    </View>
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
                                    <View style={{marginTop:2,justifyContent:'space-between',flexDirection:'row'}}>
                                        <Text style={[styles.fontSize14,{color:"black"}]}>{this.state.unit} {Util.currency(Util.decimalPointEight(this.state.selectedExchangeUSD))}</Text>
                                        <Text style={[styles.fontSize14,{color:"black"}]}>{this.state.totalUSD} {this.state.unit == "$" ? "USD" : this.state.unit}</Text>
                                    </View>
                                </View>
                                <View style={{marginTop:32,backgroundColor:"#F9F8FB",paddingTop:16,paddingBottom:12,paddingHorizontal:14}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <View style={{width: '50%'}}>
                                            <Text numberOfLines={2} style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400',marginRight: 30}]}>Coin exchange rate</Text>
                                        </View>
                                        <View style={{width: '50%'}}>
                                            <Text numberOfLines={3} style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400', textAlign: 'right', marginRight: 10, fontWeight: 'bold'}]}>{1}{this.state.coinData.coinType} {this.state.unit}{this.state.coinData.coinType == "DFSD" ? Util.currency(Util.decimalPointEight(this.state.coinData.amount1)) : Util.currency(Util.decimalPoint(Util.decimalPointEight(this.state.coinData.amount1*(1-0.003)), 2))} ≈ {1}{this.state.selectedReceiveCoin} {this.state.unit}{Util.currency(Util.decimalPointEight(this.state.selectedExchangeUSD))}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{marginTop:36,marginBottom:83}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <RectangleButton
                                            style={{flex:1,height:50,marginRight:6,backgroundColor:Color.white,borderColor :"#1B2937",borderWidth:1,borderRadius:10}}
                                            textColor={"#1B2937"}
                                            title={"Cancel"}
                                            onPress={()=>{this.props.navigation.goBack()}}
                                        ></RectangleButton>
                                        <RectangleButton 
                                            style={{flex:1,height:50,borderRadius:10}}
                                            title={"Confirm"}
                                            disable={this.state.sendCoin != '' ? false : true}
                                            onPress={()=> this.setState({ modalShow: true })}
                                        ></RectangleButton>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                    </ScrollView>
                </KeyboardAwareScrollView>
                <BottomTab navigation={this.props.navigation}/>
                <Modal
                    isVisible={this.state.modalShow}
                    backdropOpacity={0.5}
                    backdropColor = {'black'}
                    style={styles.Modal}
                >
                    <View style={styles.ModalContainer}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Do you want to proceed with the swap?
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                            <Text>Send</Text>
                            <Text style={{fontWeight: 'bold'}}>{this.state.sendCoin}{this.state.coinData.coinType}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, paddingBottom: 15, borderBottomColor: '#757474', borderBottomWidth: 0.5}}>
                            <Text>{this.state.unit} {this.state.coinData.coinType == "DFSD" ? currency(this.decimalEight(this.state.coinData.amount1)) : currency(this.decimalEight(this.state.coinData.amount1*(1-0.003)))}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                            <Text>Receive</Text>
                            <Text style={{fontWeight: 'bold'}}>{this.state.receiveCoin}{this.state.selectedReceiveCoin}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, paddingBottom: 15}}>
                            <Text>{this.state.unit} {Util.currency(Util.decimalPointEight(this.state.selectedExchangeUSD))}</Text>
                        </View>
                        <View style={{marginTop:36}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <RectangleButton 
                                    style={{flex:1,height:50,marginRight:6,backgroundColor:Color.white,borderColor :"#1B2937",borderWidth:1,borderRadius:10}}
                                    textColor={"#1B2937"}
                                    title={"Go Back"}
                                    onPress={()=>{this.setState({modalShow: false})}}
                                ></RectangleButton>
                                <RectangleButton 
                                    style={{flex:1,height:50,borderRadius:10}}
                                    title={"Confirm"}
                                    onPress={()=> this.onPressConfirm()}
                                >
                                </RectangleButton>
                            </View>
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
    headerView:{
        // position:'relative',
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
    fontSize14:{
        fontSize:14,
        fontWeight:'400'
    },
    fontSize16:{
        fontSize:16,
        lineHeight:20,
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
    ModalContainer:{
        // borderColor:'#4A4A4A',
        // borderWidth:1,
        // paddingBottom:37,
        // paddingTop:23,
        paddingVertical:30,
        paddingHorizontal:20,
        borderRadius:5,
        backgroundColor:Color.white,
        width:'100%',
        // height:194,
    },
});


export default WalletSwap;

