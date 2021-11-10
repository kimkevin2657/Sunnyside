import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, ImageBackground } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Color, Util } from '@common';
import Images from '../../../common/Images';

class ExchangeBox extends React.PureComponent {
    render() {
        const { currency, decimalPointEight } = Util;
        const {exchangeBoxStyle,data,unit,onPress,disabled,border} = this.props;

        return (
            <TouchableOpacity style={[styles.exchangeBox, exchangeBoxStyle, { borderWidth: border ? exchangeBoxStyle.borderWidth? exchangeBoxStyle.borderWidth : 1 : 0 }]} onPress={onPress} disabled={disabled}>
                <View >
                    <View style={styles.exchangeBoxContent}>
                        <View style={styles.exchangeBoxContentBox}>
                            <View style={styles.exchangeItem}>
                                <View style={[styles.ItemContainer]}>
                                    {!data.coinType 
                                    ?
                                    <View style={styles.img}></View>
                                        :
                                    <Image source={Images[`${data.coinType}`]} style={styles.img}></Image>
                                    }
                                    <View><Text style={styles.name}>{data.coinType}</Text></View>
                                </View>
                                <View style={styles.balanceContainer}>
                                    <View style={styles.balanceView}>
                                        <Text numberOfLines={3} style={styles.balance}>{currency(decimalPointEight(data.balance))}</Text>
                                    </View>
                                    <View style={styles.coinTypeView}>
                                        <Text  style={styles.coinType}>{data.coinType}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.secondFlex}>
                                <View style={styles.secondPosition}>
                                    <View style={styles.unitView}>
                                        <View>
                                            <Text style={styles.priceText}>{unit} </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.priceText}>{currency(decimalPointEight(data.amount1))}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.priceView}>
                                        <View style={styles.unitView2}>
                                            <Text style={[styles.priceText]}>{unit} </Text>
                                        </View>
                                        <View style={styles.krwBalanceView}>
                                            <Text style={[styles.priceText]}>{currency(decimalPointEight(data.amount2))}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    exchangeBox:{
    // flex:1,
        flexGrow: 1,
        textAlign: 'left',
        padding:30,
        borderRadius:10,
        borderColor: "#BEBEBE",
    },
    exchangeBoxContent: {
        flexGrow: 1,
        flexShrink: 0,
    },
    exchangeBoxContentBox: {
        flexGrow: 1,
        justifyContent:'space-between',
    },
    exchangeItem: {
        flexGrow:1,
        flexDirection: 'row',
        justifyContent:'space-between',
        // alignItems:'center',
        // padding:0,
    },
    ItemContainer: {
        flexDirection: 'row',
    },
    img: {
        width: 30,
        height: 30,
        resizeMode:'contain',
        marginRight: 10,
        
    },
    name:{
        marginTop:8,
        fontSize: 15,
        lineHeight: 15,
        fontWeight:'bold',
        color:"#292929",
    },
    balanceContainer: {
        // flexWrap:'wrap',
        marginTop:8,
        flexGrow: 1,
        flexBasis: 1,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        textAlign: 'right',
        paddingBottom:10
    },
    balanceView: {
        alignItems:'flex-end',
        flexGrow: 1,
        flexBasis:1,
    },
    coinTypeView: {
        alignItems: 'flex-end',
    },
    balance: {
        fontWeight:'bold',
        fontSize: 15,
        lineHeight: 15,
        textAlign:'right'
    },
    coinType: {
        fontWeight:'bold',
        fontSize:15,
        lineHeight: 15,
        paddingLeft: 5,
    },
    secondFlex: {
        flexGrow:1,
    },
    secondPosition: {
        flexGrow: 1,
        flexDirection: 'row',
        marginLeft: 40,
        justifyContent:'space-between',
    },
    unitView: {
        flexBasis:1,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent:'flex-start'
    },
    priceView: {
        flexBasis: 1,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent:'flex-end'
    },
    unitView1: {
        flexGrow: 1,
        flexBasis:1
    },
    unitView2: {
    },
    krwBalanceView: {
        alignItems:'flex-end'
    },
    priceText: {
        // textAlign:"right",
        color:"#757474",
        fontWeight:'600',
        fontSize: 15,
    }
});
export default ExchangeBox;
