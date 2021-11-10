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
import moment from 'moment';
class WalletSendComplet extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            datas : this.props.navigation.getParam('datas', {}),
            coinData : this.props.navigation.getParam('coinData', {}),
            unit : this.props.navigation.getParam("unit","$"),
            today : new Date().toUTCString()
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

    
    render() {
        console.log(this.state.datas)
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{this.props.navigation.push("WalletMain")}} title="Send" border></HeaderBar>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={{marginTop :20,justifyContent:'center',alignItems:'center'}}>
                                <Image source={Images.complete} style={{width:100,height:100}}></Image>
                            </View>
                            
                            <View style={{marginTop:48}}>
                                <Text style={styles.headerText}>Withdrawal request completed</Text>
                                <View style={{marginTop:20}}><Text style={[styles.fontSize12]}>Your withdrawal request has been completed. The requested amount will be paid after the administrator's approval.</Text></View>
                            </View>

                            <View style={{marginTop:27,paddingTop:16,paddingBottom:12,paddingHorizontal:14}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400'}]}>{moment(this.state.today).format('YYYY-MM-DD')}</Text>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                    
                                        <Text style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'600'}]}>{`${this.state.datas.amount} ${this.state.datas.coinType}`}</Text>
                                    </View>
                                </View>
                                <View style={{alignItems:'flex-end',marginTop:9}}>
                                    <Text style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'300'}]}>$ {this.state.datas.totalAmount}</Text>
                                </View>

                                <View style={{borderTopColor : "#F6F4F4",borderTopWidth:1,marginTop:10,paddingTop:15}}>
                                    <View>
                                        <View><Text style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400'}]}>Wallet Address Sent</Text></View>
                                        <View style={{marginTop:5}}><Text style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400'}]}>{this.state.datas.address}</Text></View>
                                    </View>

                                    <View style={{marginTop:20}}>
                                        <View><Text style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400'}]}>Memo</Text></View>
                                        <View style={{marginTop:5}}><Text style={[styles.fontSize16,{color:'4A4A4A',fontWeight:'400'}]}>{this.state.datas.user_memo}</Text></View>
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop:20,backgroundColor:"#F9F9F9",flex:1,paddingVertical:20,paddingHorizontal:30}}>
                                <View style={{flexDirection:"row",alignItems:'center',height:20}}>
                                    <Image source={Images.reminder} style={{width:11,height:11,marginRight:5}}></Image>
                                    <Text style={{fontWeight:'400',fontSize:12,lineHeight:14,color:'#FF0000'}}> Notice</Text>
                                </View>
                                <View style={[{marginTop:5},]}>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>• </Text>
                                        <Text style={styles.warnText}>Depending on the status of the service, your withdrawal request may be rejected.</Text>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>• </Text>
                                        <Text style={styles.warnText}>Withdrawal processing is approved after confirmation by the administrator, and it may take some time to deposit after approval.</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop:36,paddingHorizontal:20,marginBottom:60}}>
                                <RectangleButton style={{height:52}} title={"Confirm"} onPress={()=>{this.props.navigation.push("WalletDetailMain",{coinData:this.state.coinData})}}></RectangleButton>
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


export default WalletSendComplet;
