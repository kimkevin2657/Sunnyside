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
import { commonApi } from '@common/ApiConnector';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';

class WalltePurchaseWaiting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalShow : false,
            seconds : 0,
            minutes:0,
            secondData:{},
            toCoin : "",
            coinQRId : " ",
            coin_id : "",
            type : this.props.navigation.getParam('type'),
            purchaseCoinType : this.props.navigation.getParam('purchaseCoinType'),
            purchaseCoin : this.props.navigation.getParam('purchaseCoin'),
            memo : this.props.navigation.getParam('memo'),
            destinationTag : this.props.navigation.getParam('destinationTag'),
            receiveImage: this.props.navigation.getParam('receiveImage')
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    getAddress = (coinType) => {
        const param = {
            "coin_type": this.state.purchaseCoinType
        }
        const response = commonApi('post', '/exchange/getAdminCoinAccount', param);
        response.then(({data}) => {
            this.setState({
                coin_id : data.additional_data != 'null' ? data.additional_data : '',
                coinQRId : data.other_account ? data.other_account : ' '
            })
        })
        .catch((e)=>{
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
            }
        });
    }

    getCoinBuy = (memo) => {
        const param = {
            "memo": memo
        }
        const response = commonApi('post', '/exchange/selectCoinBuy', param);
        response.then(({data,success}) => {
            if (success) {
                console.log("data :: ",data)
                console.log("reg_date",data.reg_date)
                var today = new Date().getTime()
                var today = moment(today);
                var setDate = new Date(data.reg_date).getTime()
                var setDate = moment.utc(setDate).add(10, 'm')
                var timer = setDate - today;
                if (moment.utc(setDate).format() <= moment(today).format()) {
                    this.setState({
                        seconds:0,
                        minutes:0
                    })
                } else {
                    var timer = moment(timer).format('mm : ss');
                    var timer = timer.split(':');
                    console.log("seconds :: ",parseInt(timer[1]))
                    console.log("minutes :: ",parseInt(timer[0]))
                    this.setState({
                        seconds:parseInt(timer[1]),
                        minutes:parseInt(timer[0]),
                    })
                }            
                // setsecondData(data)
                this.setState({
                    secondData :{data: data,type:this.state.type},
                    toCoin : data.to_coin
                })
                // setMinutes(data.REG_DATE.getTime())
                this.getAddress(data.from_coin)
                if (data.from_coin == 'ADA') {
                    this.setState({
                        receiveImage : 'https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/ADA20210713182844.png'
                    })
                    // setData(history.location.state)
                } else if (data.from_coin == 'XRP') {
                    this.setState({
                        receiveImage : 'https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/XRP20210713182833.jpg'
                    })
                    // setData(history.location.state)
                } else if (data.from_coin == 'EOS'){
                    this.setState({
                        receiveImage : 'https://dfians-dev-bucket.s3.ap-northeast-2.amazonaws.com/publicfiles/coinimg/EOS20210713182822.png'
                    })
                    // setData(history.location.state)
                }
                // setIsData(true);

            }
        })
        .catch((e) => {
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                SimpleToast.show('Server Connection Failed ,Please wait a moment and try again.', SimpleToast.SHORT)
            }
        });
        // this.countdown()
    }
    

    countdown = ()=>{
        let countdown = setInterval(() => {
            let seconds = this.state.seconds
            let minutes = this.state.minutes
            if(seconds == 0){
                seconds = 59;
                minutes = minutes-1
            }else {
                seconds = seconds-1
            }
            if(this.state.minutes==0 && this.state.seconds==0){
                clearInterval(countdown)
            }else{
                this.setState({
                    seconds : seconds,
                    minutes : minutes
                })
            }
        }, 1000)
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

    componentDidMount=()=>{
        this.getCoinBuy(this.state.memo)
        let countdown = setInterval(() => {
            let seconds = this.state.seconds
            let minutes = this.state.minutes
            if(seconds == 0){
                seconds = 59;
                minutes = minutes-1
            }else {
                seconds = seconds-1
            }
            if(this.state.minutes==0 && this.state.seconds==0){
                clearInterval(countdown)
            }else{
                this.setState({
                    seconds : seconds,
                    minutes : minutes
                })
            }
        }, 1000)
        // const countdown = setInterval(() => {
        //     if (parseInt(seconds) > 0) {
        //         setSeconds(parseInt(seconds) - 1);
        //     }
        //     if (parseInt(seconds) === 0) {
        //         if (parseInt(minutes) === 0) {
        //             setTimeLimit(!timeLimit)
        //             history.push({
        //                 pathname: '/wallet/WalletTXID',
        //                 state: type == 'TxidInput' ? secondData : data
        //             })
        //             clearInterval(countdown);
                    
        //         } else {
        //             setMinutes(parseInt(minutes) - 1);
        //             setSeconds(59);
        //         }
        //     }
        // }, 1000);
        // return () => clearInterval(countdown);
       
    }

    coinId =()=>{
        if(this.state.coin_id != null){
            return(
                <View style={{marginTop:54,marginHorizontal:25}}>
                    {/* <Text style={styles.fontSize14}>Deposit address (account name)</Text> */}
                    <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                        <CoinIdText coinId={this.state.coinQRId}></CoinIdText>
                    </View>
                    {/* <Text style={[styles.fontSize14,{marginTop:23}]}>Deposit memo (MEMO)</Text> */}
                    <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                        <CoinIdText coinId={this.state.coin_id}></CoinIdText>
                    </View>
                    
                </View>
            )
        }else{
            return(
                <View style={{marginTop:23,marginHorizontal:25,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
                    <CoinIdText coinId={this.state.coinQRId}></CoinIdText>
                </View>
            );
        }
        // if(this.state.purchaseCoinType==="EOS"){
            // return(
            // <View style={{marginTop:54,marginHorizontal:25}}>
            //     {/* <Text style={styles.fontSize14}>Deposit address (account name)</Text> */}
            //     <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
            //         <CoinIdText coinId={this.state.coinQRId}></CoinIdText>
            //     </View>
            //     {/* <Text style={[styles.fontSize14,{marginTop:23}]}>Deposit memo (MEMO)</Text> */}
            //     <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
            //         <CoinIdText coinId={this.state.coin_id}></CoinIdText>
            //     </View>
                
            // </View>
            // )
        // }else if(this.state.purchaseCoinType === "XRP"){
        //     return(
        //     <View style={{marginTop:54,marginHorizontal:25}}>
        //         {/* <Text style={styles.fontSize14}>Deposit address (account name)</Text> */}
        //         <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
        //             <CoinIdText coinId={this.state.coinQRId}></CoinIdText>
        //         </View>
        //         {/* <Text style={[styles.fontSize14,{marginTop:23}]}>Destination tag</Text> */}
        //         <View style={{marginTop:6,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
        //             <CoinIdText coinId={this.state.coin_id}></CoinIdText>
        //         </View>
                
        //     </View>
        //     )
        // }else{
        //     return(
        //         <View style={{marginTop:23,marginHorizontal:25,paddingHorizontal:13,flex:1,flexDirection:'row',alignItems:'center',paddingVertical:16,backgroundColor:"#FAFAFA"}}>
        //             <CoinIdText coinId={this.state.coinQRId}></CoinIdText>
        //         </View>
        //     );
        // }
    }

    render() {
        console.log("purchaseCoin : ",this.state.purchaseCoin)
        const data = {name : 'DFSD',amount:1,cost:'37,831,07',assets:'0.000'}
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.push("WalletMain")}} border title="Buy"></HeaderBar>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{marginTop:54,alignItems:'center'}}>
                            <View style={styles.waitingIcon}>
                                <Text style={styles.fontSize14}>Pending deposit</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:45,lineHeight:54,fontWeight:'500'}}>{`${this.state.minutes >=10 ? this.state.minutes :"0"+this.state.minutes} : ${this.state.seconds >=10 ?this.state.seconds: "0"+this.state.seconds}`}</Text>
                            </View>
                        </View>
                       
                        <View style={{marginTop:35,backgroundColor:'#F9F9F9',paddingTop:17,paddingBottom:14,paddingRight:12,paddingLeft:7,flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{flexDirection:'row'}}>
                                <Image source={{uri : this.state.receiveImage}} style={{width:17,height:17,marginRight:5}}></Image>
                                <Text style={styles.fontSize16}>{this.state.purchaseCoinType}</Text>
                            </View>
                            <Text style={styles.fontSize16}>{this.state.purchaseCoin} {this.state.purchaseCoinType}</Text>
                        </View>
                        <View style={{flex:1,paddingHorizontal:16,marginTop:20}}>
                            <View>
                                <Text style={{fontWeight:'bold',fontSize:20}}>Deposit address</Text>
                            </View>
                            <View style={{marginTop:10}}>
                                <Text style={{fontSize:12}}>Copy the deposit address below or scan the QR code.</Text>
                            </View>
                        </View>

                        <View style={{flex:1,alignItems:'center',marginTop:29}}>
                            <QRCode size={110} value={this.state.coinQRId} />    
                        </View>
                            {this.coinId()}
                            <View style={{marginTop:58,backgroundColor:"#F9F9F9",flex:1,paddingVertical:20,paddingHorizontal:30}}>
                                <View style={{flexDirection:"row",alignItems:'center'}}>
                                    <Image source={Images.reminder} style={{width:11,height:11,marginRight:5}}></Image>
                                    <Text style={{fontWeight:'400',fontSize:12,lineHeight:14,color:'#FF0000'}}>Deposit notice</Text>
                                </View>
                                <View style={[{marginTop:11},]}>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}><Text style={[styles.warnText,]}>Please make a deposit transaction within 10 minutes.</Text></Text>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <View>
                                            <Text style={styles.warnText}>Be sure to check the wallet address before sending.</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}>DFians Wallet is not responsible for any loss incurred if you confuse and send the wrong address.</Text>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}>After depositing, please click the confirm button below.</Text>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}>TXID = Transaction ID. Please enter TXID generated when applying for withdrawal on the next screen.</Text>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}>DFSD payment may be delayed if TXID is not entered.</Text>
                                    </View>

                                </View>
                            </View>

                        <View style={{marginTop:29,marginBottom:57,flexDirection:'row',justifyContent:'space-between'}}>
                            <RectangleButton style={{flex:1,height:50,marginRight:6,backgroundColor:Color.white,borderColor :"#1B2937",borderWidth:1,borderRadius:10}} textColor={"#1B2937"} title={"Cancel"} onPress={()=>{this.props.navigation.push("WalletMain")}}></RectangleButton>
                            <RectangleButton style={{flex:1,height:50,borderRadius:10}} title={"Enter TXID"} onPress={()=>{this.props.navigation.navigate("WalletTXID")}}></RectangleButton>
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
    waitingIcon : {
        width:140,
        borderWidth:1,
        borderColor:'#1B2937',
        borderRadius:20,
        alignItems:'center',
        height:34,
        justifyContent:'center',
        marginTop:5,
        marginBottom : 20
    },
    idView:{
        marginTop:23,
        marginHorizontal:25,
        paddingHorizontal:13,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:16,
        backgroundColor:"#FAFAFA"
    }
});


export default WalltePurchaseWaiting;
