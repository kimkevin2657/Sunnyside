import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import { FlatList } from 'react-native-gesture-handler';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import CoinIdText from '../../../../components/_gmcCustom/CoinIdText'
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import QRCode from 'react-native-qrcode-svg';
import { commonApi } from '@common/ApiConnector';

class WalletReceive extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            coinId : " ",
            coinType : this.props.navigation.getParam('coinType', ""),
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    getAddress = () => {
        const param = {
        "coinType":this.state.coinType
        }
        console.log(param)
        const response = commonApi('post', '/exchange/account',param);
        response.then(({ data }) => {
            console.log(data)
            console.log("get address data",data.account.address)
            this.setState({
                coinId : data.account.address
            })
            // setQrCode(data.account.address);
            // setCoinType(param.coinType)
        })
        .catch(e => console.log(e));
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
        this.getAddress()
    }

    render() {
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Receive" border></HeaderBar>
                    <ScrollView>
                        <View style={{flex:1,paddingHorizontal:16,marginTop:20}}>
                            <Text style={{fontWeight:'bold',fontSize:24}}>{this.state.coinType} deposit address</Text>
                        </View>
                        <View style={styles.container}>
                            <View style={{flex:1,alignItems:'center'}}>
                                <QRCode size={110} value={this.state.coinId} />
                            </View>
                            <View style={styles.coinIdView}>
                                <CoinIdText coinId={this.state.coinId}></CoinIdText>
                            </View>
                            <View style={{marginTop:46,backgroundColor:"#F9F9F9",flex:1,paddingVertical:20,paddingHorizontal:30,borderWidth:1,borderColor:"#E1E1E1"}}>
                                <View style={{flexDirection:"row",alignItems:'center',height:20}}>
                                    <Image source={Images.reminder} style={{width:11,height:11,marginRight:5}}></Image>
                                    <Text style={{fontWeight:'400',fontSize:12,lineHeight:14,color:'#FF0000'}}> Notice</Text>
                                </View>
                                <View style={[{marginTop:5}]}>
                                        <Text style={styles.warnText}>· Be sure to check the wallet address before sending.</Text>
                                        <Text style={styles.warnText}>· DFSC can only transfer to DFSC addresses.</Text>
                                        <Text style={styles.warnText}>· DFians Wallet is not responsible for any loss incurred if you confuse and send the wrong address.</Text>
                                </View>
                            </View>

                            <View style={{paddingVertical:46}}>
                                <RectangleButton title={"Go Back"} style={{height:52,borderRadius:10}} onPress={()=>{this.props.navigation.goBack()}}></RectangleButton>
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
        paddingTop:60,
    },
    coinIdView:{
        marginTop:33,
        marginHorizontal:25,
        paddingHorizontal:13,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:16,
        backgroundColor:"#FAFAFA"
    },
   warnText:{
    fontSize:11,
    lineHeight:16,
    fontWeight:'400',
    color:"#9A9A9A"
   } 
   
});


export default WalletReceive;
