import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import { FlatList } from 'react-native-gesture-handler';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import BottomTab from '../../../../components/_gmcCustom/BottomTab';

class WalletTXID extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            txid : "",
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
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Buy"></HeaderBar>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={{marginTop:58}}>
                                <Text style={styles.headerText}>TXID</Text>
                                <TextInput style={{height:50,borderColor:"#D7D6D6",borderWidth:1,marginTop:10,paddingHorizontal:5}} value={this.state.txid.toString()} onChangeText={(e)=>{this.setState({txid : e})}} placeholder="Enter the transaction ID (TXID / TxHash)." placeholderTextColor={Color.textGray}></TextInput>
                                <View style={{flexDirection:'row',alignItems:'center',marginTop:6}}>
                                    <Image source={Images.reminder} style={{width:11,height:11,marginRight:5}}></Image>
                                    <Text style={[styles.fontSize12,{color:"#FF0000"}]}>After payment, you must enter your TXID to complete the purchase.</Text>
                                </View>
                            </View>

                            <View style={{marginTop:50,paddingHorizontal:20}}>
                                <RectangleButton style={{height:50}} title={"Submit"} disable={this.state.txid == "" ?true : false} onPress={()=>this.props.navigation.navigate("WalletPurchaseComplet")}></RectangleButton>
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
        fontSize:14,
        lineHeight:17,
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


export default WalletTXID;
