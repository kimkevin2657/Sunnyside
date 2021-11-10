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

class WalletPurchaseComplet extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            coinData : {},
            purchaseDate : new Date().toLocaleDateString(),
            moneyType : store.getState().user.moneyType || "USD",
            moneyTypeList : [
                {type : "USD", unit : "$"},
                {type : "KRW", unit : "₩"},
            ],
            unit : "USD",
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
    
    componentDidMount(){
        const data = 
        {
            "coin_krw_balance": 0.02,
            "kr_name": "DFSC",
            "dambo": 0,
            "balance": 130.5,
            "coin_type": "DFSC",
            "avg_buy_coin_price": 0,
            "exchange_can": 0,
            "en_name": "Bitcoin",
            "coin_img": "/assets/images/img_BTC.png",
            "accident": 0
        }
        let unitIdx = this.state.moneyTypeList.map((v,i)=>{return v.type}).indexOf(this.state.moneyType)
        
        this.setState({
            coinData : data,
            unit : unitIdx > 0 ? this.state.moneyTypeList[unitIdx].unit : "$",
        })
    }

    render() {
        const data = {name : 'DFSD',amount:1,cost:'37,831,07',assets:'0.000'}
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Buy"></HeaderBar>
                    <ScrollView>
                        <View style={styles.container}>

                            <View style={{marginTop:48}}>
                                <Text style={styles.headerText}>Your DFSD purchase is completed</Text>
                                <View style={{marginTop:10}}><Text style={[styles.fontSize16,{fontWeight:'400'}]}>Please check your purchase details.</Text></View>
                            </View>

                            <View style={{marginTop:30}}>
                                <Text style={styles.fontSize12}>{this.state.purchaseDate}</Text>
                                <ExchangeBox data={this.state.coinData} unit={'$'}  disabled={true} />
                            </View>

                            <View style={{paddingHorizontal:5}}>
                                <Text style={[styles.fontSize12,{color:"#FF0000",marginTop:6}]}><View style={{width:10,height:10,backgroundColor:'red'}}></View> It may take some time for DFS to recharge your wallet.</Text>
                            </View>

                            <View style={{marginTop:31,paddingHorizontal:20,marginBottom:60}}>
                                <RectangleButton style={{height:47}} title={"Confirm"} onPress={()=>{this.props.navigation.navigate("WalletDetailMain")}}></RectangleButton>
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
        lineHeight:16,
        fontWeight:'400',
        color:"#9A9A9A"
    } ,
    headerText:{
        fontSize:20,
        lineHeight:24,
        fontWeight:'700',
    },
    fontSize10:{
        fontSize:10,
        lineHeight:12,
        fontWeight:'400'
    },
    fontSize16:{
        fontSize:16,
        lineHeight:18,
        fontWeight:'500'
    },
    fontSize12:{
        fontSize:12,
        lineHeight:14,
        fontWeight:'400'
    },
});


export default WalletPurchaseComplet;
