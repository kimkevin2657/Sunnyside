import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Linking,
    Image,
    BackHandler
} from 'react-native';
import { commonApi } from '@common/ApiConnector';
import { Images } from '@common';
import CheckBox from '@react-native-community/checkbox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import SimpleToast from 'react-native-simple-toast';

class IcoRegister extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            icoInfo: {},
            balance: '',
            coinAmount: '',
            allUseChecked: false,
            termsChecked: false,
            seq: this.props.navigation.getParam('seq', ''),
            coinType: this.props.navigation.getParam('coinType', ''),
            refresh: false
        };
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.screenProps.goFirstPage()
        this.props.navigation.goBack();
        return true;
    }

    getIcoInfo() {
        let params = {
            seq: this.state.seq,
            coin_type: this.state.coinType
        }
        const response = commonApi('post', `/ieo/getIeoInfo`, params);
        response.then( ({data, memberAccount}) => {
            console.log("info data",data.memberAccount)
            this.setState({
                icoInfo: data.ieoInfo,
                balance: data.memberAccount.exchange_can
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    onPressPurchase() {
        if(this.state.coinAmount == '') {
            SimpleToast.show(`Please enter the amount of ${this.state.icoInfo.prc_type} to use for purchase`, SimpleToast.SHORT)
        } else {
            let params = {
                seq: this.state.icoInfo.seq,
                ieo_amount: this.state.coinAmount,
                ieo_revenue_amount: this.state.coinAmount * this.state.icoInfo.prc_price,
                coin_type: this.state.icoInfo.coin_type,
                lock_period: this.state.icoInfo.lock_period,
                prc_type: this.state.icoInfo.prc_type
            }
            const response = commonApi('post', `/ieo/insertIeo`, params);
            response.then( (res) => {
                if(res.success) {
                    SimpleToast.show('ICO finish.', SimpleToast.SHORT)
                    this.props.navigation.navigate('IcoComplete', {
                        title: this.state.icoInfo.ieo_buy_title,
                        amount: this.state.coinAmount *  this.state.icoInfo.prc_price,
                        period: this.state.icoInfo.lock_period,
                        type: this.state.icoInfo.coin_type
                    })
                } else {
                    SimpleToast.show(res.message, SimpleToast.SHORT)
                }
            }).catch(e => {
                console.log('error:: ',e);
            })
        }
    }

    componentDidMount() {
        this.getIcoInfo()
    }

    onChangeValue = (val) => {
        this.setState({
            coinAmount: Number(val).toLocaleString() 
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.coinAmount != this.state.coinAmount) {
            console.log(this.state.coinAmount)
            console.log(Number(this.state.coinAmount.toString().replace(/,/gi, '').toString().replace(/,/gi, '')))
            console.log(this.state.icoInfo.prc_price)
            console.log(Number(this.state.coinAmount.toString().replace(/,/gi, '').toString().replace(/,/gi, '')) * this.state.icoInfo.prc_price)
            console.log(this.state.icoInfo.max_fund_amount - this.state.icoInfo.total_fund_amount)

            if(Number(this.state.coinAmount.toString().replace(/,/gi, '')) * this.state.icoInfo.prc_price > this.state.icoInfo.max_fund_amount - this.state.icoInfo.total_fund_amount ){
                SimpleToast.show(`The remaining ICO quantity cannot be exceeded.`, SimpleToast.SHORT)
                this.setState({
                    coinAmount: ''
                })
            } else if(Number(this.state.coinAmount.toString().replace(/,/gi, '')) > this.state.balance) {
                SimpleToast.show(`Input quantity exceeds reserve.`, SimpleToast.SHORT)
                this.setState({
                    coinAmount: ''
                })
            } else if(this.state.coinAmount != '' && Number(this.state.coinAmount.toString().replace(/,/gi, '')) == 0) {
                SimpleToast.show(`Please enter the correct quantity.`, SimpleToast.SHORT)
                this.setState({
                    coinAmount: '',
                    allUseChecked: false
                })
            }
        }
    }

    render() {
        let item = this.state.icoInfo;
        console.log(item)
        let progressStatus = (item.max_fund_amount - item.total_fund_amount) / item.max_fund_amount * 100;
        return(
            <ScrollView style={{backgroundColor:'white'}} contentContainerStyle={{flexGrow:1}}>
                <View style={styles.purchaseContainer}>
                    <Text style={styles.purchaseTitle}>Please check the purchase amount.</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputTitleContainer}>
                            <Image style={styles.img} source={Images.dfiansLogo}/>
                            <Text style={styles.inputTitle}>{item.prc_type}</Text>
                        </View>
                        <TextInput
                            maxLength={15}
                            underlineColorAndroid={'transparent'}
                            style={[styles.inputTextContainer, { maxHeight: 44 }]}
                            keyboardType="numeric"
                            placeholder={`Please enter the amount of DFSD to use for purchase`}
                            placeholderTextColor={'#C6C6C6'}
                            selectionColor="grey"
                            value={this.state.coinAmount.toLocaleString()}
                            onChangeText={this.onChangeValue}
                        />
                        <View style={styles.inputFooter}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 12, color: '#858585'}}>Hold | </Text>
                                <Text style={{fontWeight:'400', color: '#292929', fontSize: 12}}>{this.state.balance != '' ? Number(this.state.balance).toLocaleString() : 0} {item.prc_type}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{marginRight: 5,fontSize: 12, color: '#858585'}}>Use all</Text>
                                    <CheckBox
                                    value={this.state.allUseChecked}
                                    style={styles.checkBox}
                                        tintColors={{
                                            true: '#3a7bd5',
                                            false: '#858585'
                                        }}
                                        onValueChange={(bool) => { 
                                            this.setState({
                                                allUseChecked : bool,
                                                coinAmount : bool ? ((item.max_fund_amount - item.total_fund_amount)/item.prc_price).toLocaleString() : ''
                                            })
                                        }}
                                    />
                            </View>
                        </View>
                    </View>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusTitle}>{item.ieo_buy_title}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 15, color: '#858585', marginBottom: 3}}>1 {item.prc_type} = {item.prc_price && item.prc_price.toLocaleString()} {item.coin_type}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 3}}>
                                <Text style={{fontSize: 15, color: '#4A4A4A',}}>1 {item.coin_type} = </Text>
                                <Text style={{fontSize: 15, color: '#4A4A4A', textDecorationLine: 'line-through'}}>{item.cost_price} {item.cost_unit}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 15, color: '#858585', marginBottom: 23}}>Lockup period  {item.lock_period} days</Text>
                            <Text style={{fontSize: 15, color: '#4A4A4A', marginBottom: 23, textAlign: 'right'}}>{item.cost_discount_price} {item.cost_unit}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#858585', marginBottom: 4}}>Residual coin</Text>
                        <View>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressBar,{backgroundColor:'#0A1A2A', width: `${progressStatus}%`}]}/>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 14, color: '#4A4A4A'}}>{item.max_fund_amount && (item.max_fund_amount - item.total_fund_amount).toLocaleString()} {item.coin_type}</Text>
                            <Text style={{fontSize: 14, color: '#4A4A4A'}}>{item.max_fund_amount && item.max_fund_amount.toLocaleString()} {item.coin_type}</Text>
                        </View>
                    </View>
                    <Text style={styles.payTitle}>Total amount</Text>
                    <View style={styles.payContainer}>
                        <View style={styles.payText}>
                         
                            <Text style={{ fontSize: 16, color: '#292929', fontWeight: 'bold' }}> {(Number(this.state.coinAmount.toString().replace(/,/gi, '')) * item.prc_price) != 0 ?  Number(Number(this.state.coinAmount.toString().replace(/,/gi, ''))* item.prc_price).toLocaleString() : 0} </Text>
                            <Text style={{fontSize: 16, color: '#858585', fontWeight: '500'}}> {item.coin_type} </Text>
                        </View>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={{fontSize: 14, color: '#858585'}}>Required {item.prc_type} Coin</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#292929' }}>{this.state.coinAmount != '' &&  Number(this.state.coinAmount.toString().replace(/,/gi, '')) != 0 ? Number(this.state.coinAmount.toString().replace(/,/gi, '')).toLocaleString() : 0} {item.prc_type}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={{fontSize: 14, color: '#858585'}}>Residual {item.prc_type} coin</Text>
                        {/* <Text style={{fontSize: 14, fontWeight: 'bold', color: '#292929'}}>{(this.state.balance - this.state.coinAmount).toFixed(4).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {item.prc_type}</Text> */}
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#292929' }}>{(this.state.balance - Number(this.state.coinAmount.toString().replace(/,/gi, ''))) !=0 ?  Number(this.state.balance - Number(this.state.coinAmount.toString().replace(/,/gi, '').toString().replace(/,/gi, ''))).toLocaleString() : 0} {item.prc_type}</Text>
                    </View>
                    <View style={styles.termsContainer}>
                        <TouchableOpacity   onPress={() => {
                            this.setState({
                                termsChecked: !this.state.termsChecked,
                            })
                        }}>
                            <CheckBox
                                disabled
                                value={this.state.termsChecked}
                                style={styles.checkBox}
                                tintColors={{
                                    true: '#3a7bd5',
                                    false: '#858585'
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                termsChecked: !this.state.termsChecked,
                            })
                        }} style={{flexDirection: 'row', flexGrow:1, flexWrap:'wrap'}}>
                            <Text  style={{color: '#4A4A4A'}}>I have read </Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Terms', {page:'DepositRegister'})}>
                                <Text style={{color: '#4A4A4A', textDecorationLine: 'underline'}}>the deposit terms</Text>
                            </TouchableOpacity>
                            <View> 
                                <Text style={{color: '#4A4A4A'}}>and conditions and agree to the contents.</Text> 
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                    {this.state.termsChecked ?
                    <RectangleButton
                        title='Confirm'
                        fontSize={16}
                        style={{height:54, borderRadius:10}}
                        onPress={() => this.onPressPurchase()}
                    /> :
                    <RectangleButton
                        disable
                        title='Confirm'
                        fontSize={16}
                        style={{height:54, borderRadius:10 ,backgroundColor: 'grey'}}
                    />
                    }
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    purchaseContainer: {
        marginHorizontal: 16,
        paddingBottom: 50
    },
    purchaseTitle: {
        textAlign: 'left',
        marginTop: 30,
        marginBottom: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A4A4A'
    },
    inputContainer: {
        marginBottom: 50
    },
    inputTitleContainer: {
        flexDirection: 'row',
        alignItems:'center'
    },
    img:{
        marginRight :10,
        width:18,
        height: 18,
    },
    inputTitle: {
        fontSize: 20,
        color: '#4A4A4A',
        fontWeight: 'bold'
    },
    inputTextContainer: {
        marginTop: 10,
        paddingHorizontal: 14,
        height: 44,
        maxHeight: 44,
        // lineHeight:44,
        // paddingBottom: 0,
        borderWidth:1,
        borderRadius:5,
        borderColor:"#BEBEBE",
        fontSize: 16,
        color: 'black',
        justifyContent:'center'
    },
    inputText: {
        fontSize: 15,
        color: '#BEBEBE',
        textAlign: 'right'
    },
    inputFooter: {
        marginTop: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    checkBox: {
        height: 16,
        marginTop: -1,
        flexShrink:0,
    },
    statusContainer: {
        padding:20,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        position:'relative',
        marginBottom: 50,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    progressBar: {
        backgroundColor: '#E5E5E5',
        height: 10,
        borderRadius:5,
        width: '100%'
    },
    payTitle: {
        fontSize: 20,
        color: '#393939',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    payContainer: {
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: '#F9F8FB',
        justifyContent: 'center'
    },
    payText: {
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    amountContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between'
    },
    termsContainer: {
        marginVertical: 40,
        alignItems: 'center',
        flexDirection: 'row'
    }
});

export default IcoRegister;