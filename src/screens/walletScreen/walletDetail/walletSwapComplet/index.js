import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import { FlatList } from 'react-native-gesture-handler';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import { store } from '@redux/store';
import { commonApi } from '@common/ApiConnector';

class WalletSwapComplet extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            requestCoinType : this.props.navigation.getParam('requestCoinType'),
            requestCoin : this.props.navigation.getParam('requestCoin'),
            sendCoin : this.props.navigation.getParam('sendCoin'),
            requestPrice : this.props.navigation.getParam('requestPrice'),
            sendPrice : this.props.navigation.getParam('sendPrice'),
            sendCoinType : this.props.navigation.getParam('sendCoinType'),
            unit : this.props.navigation.getParam("unit","$"),
            coinData : this.props.navigation.getParam('coinData'),
            onRefresh : this.props.navigation.getParam('onRefresh'),
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.goBack()
        return true;
    }

    goBack = () => {
        const tempAmount1 = (data, coinType) => {
            let amount;
            if (coinType == 'DFSD') {
                amount = 1
            } else if (coinType == 'DFSC') {
                amount = 0.02
            } else {
                amount = data[`${coinType.toLowerCase()}`]?.price;
            }
            return amount * 1;
        }

        const userCardResponse = commonApi('post', '/asset/accountList');
        userCardResponse.then((res) => {
            if (res.success) {
                var result = res.data.result
                var resultData = res.data.result.coins;
                let coinList = [];
                // 여기서 상수로 이미지 부분에 url도메인추가
                resultData.forEach(element => {
                    coinList.push({
                        coinType: element.coin_type,
                        coinImage: element.file_url,
                        balance: element.exchange_can == undefined ? 0 : element.exchange_can,
                        amount1: tempAmount1(result, element.coin_type), // $37,831,07
                        amount2: tempAmount1(result, element.coin_type) * element.exchange_can, // $0.000
                        detailURL: 'wallet'
                     
                    })
                });
                let tmp = coinList[2];
                coinList[2] = coinList[0];
                coinList[0] = tmp
                
                coinList.map((value) => {
                    if(this.state.coinData.coinType == value.coinType) {
                        console.log(value)
                        this.props.navigation.push("WalletDetailMain", {coinData: value})
                    }
                })
            } else {
                SimpleToast.show(res.message,SimpleToast.SHORT)
            }
        })
        .catch(e => {
            console.log('getAccountList error:: ', e)
        });
    }

    
    render() {
        let tempDate = new Date().toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'}).split('/');
        let swapDate = tempDate[2]+'.'+tempDate[0]+'.'+tempDate[1];
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{
                        this.goBack()
                    }} border title="Swap"></HeaderBar>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={{alignSelf:'center', marginTop: 10}}>
                                <Image source={Images.complete} style={styles.complete}></Image>
                            </View>
                            <View style={{marginTop:30}}>
                                <Text style={styles.headerText}>Coin swap is completed</Text>
                                <View style={{marginTop:10}}><Text style={[styles.fontSize16,{fontWeight:'400', color:"#292929"}]}>Check the details below.</Text></View>
                            </View>

                            <View style={{marginTop:30}}>
                                <Text style={[styles.fontSize16, {color:"#292929"}]}>{swapDate}</Text>
                                <View style={{marginTop:40,paddingHorizontal:21}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#BEBEBE',paddingBottom:17}}>
                                        <Text style={[styles.fontSize16,{fontWeight:'700'}]}>Send</Text>
                                        <View style={{alignItems:'flex-end'}}>
                                            <Text style={[styles.fontSize16,{fontWeight: 'bold', marginBottom: 5}]}>{this.state.sendCoin} {this.state.sendCoinType}</Text>
                                            <Text style={[styles.fontSize16,{color:"#A1A9B0"}]}>{this.state.unit} {this.state.sendPrice}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:20}}>
                                        <Text style={[styles.fontSize16,{fontWeight:'700'}]}>Receive</Text>
                                        <View style={{alignItems:'flex-end'}}>
                                            <Text style={[styles.fontSize16,{fontWeight: 'bold', marginBottom: 5}]}>{this.state.requestCoin} {this.state.requestCoinType}</Text>
                                            <Text style={[styles.fontSize16,{color:"#A1A9B0"}]}>{this.state.unit} {this.state.requestPrice}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop:27,backgroundColor:"#F9F8FB",paddingTop:16,paddingBottom:12,paddingHorizontal:14}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{width: '50%'}}>
                                        <Text numberOfLines={2} style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400',marginRight: 30}]}>Coin exchange rate</Text>
                                    </View>
                                    <View style={{width: '50%'}}>
                                        <Text numberOfLines={3} style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400', textAlign: 'right', marginRight: 10, fontWeight: 'bold'}]}>{this.state.sendCoinType} {this.state.unit}{this.state.sendCoinType == "DFSD" ? Util.currency(Util.decimalPointEight(this.state.sendPrice)) : Util.currency(Util.decimalPoint(Util.decimalPointEight(this.state.sendPrice*(1-0.003)), 2))} ≈ {this.state.requestCoinType} {this.state.unit}{Util.currency(Util.decimalPointEight(this.state.requestPrice))}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop:36,paddingHorizontal:20,marginBottom:60}}>
                                <RectangleButton style={{height:52}} title={"Confirm"} onPress={()=>{
                                    this.goBack()
                                }}></RectangleButton>
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
        flex:1,
        paddingHorizontal:16,  
    },
    warnText:{
        fontSize:11,
        // lineHeight:16,
        fontWeight:'400',
        color:"#9A9A9A"
    } ,
    headerText:{
        fontSize:20,
        // lineHeight:24,
        fontWeight:'700',
    },
    fontSize10:{
        fontSize:10,
        // lineHeight:12,
        fontWeight:'400'
    },
    fontSize16:{
        fontSize:16,
        // lineHeight:18,
        fontWeight:'500'
    },
    fontSize12:{
        fontSize:12,
        // lineHeight:14,
        fontWeight:'400'
    },
    complete: {
        height: 100,
        width: 100
    }
});


export default WalletSwapComplet;
