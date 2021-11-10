import React from 'react';``
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Linking,
    Image,
    BackHandler
} from 'react-native';
import { commonApi } from '@common/ApiConnector';
import CheckBox from '@react-native-community/checkbox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton'
import SimpleToast from 'react-native-simple-toast';
import { Util } from '@common'
import AwesomeAlert from 'react-native-awesome-alerts';

class DepositRegister extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            termsChecked: false,
            depositInfo: {},
            stakeIdx: this.props.navigation.getParam('stakeIdx', ''),
            coinType: this.props.navigation.getParam('coinType', ''),
            walletData: {},
            showAlert: false,
        };
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

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

     getWalletData() {
        //get user info

        const userCardResponse = commonApi('post', '/asset/accountList');
        userCardResponse.then(({ data }) => {
            var paramCoinType = this.state.coinType
            var result = data.result
            var resultData = data.result.coins;
            let amount;
            if (paramCoinType == 'DFSD') {
                amount = 1
            } else if (paramCoinType == 'DFSC') {
                amount = 0.02
            } else {
                amount = result[`${paramCoinType.toLowerCase()}`]?.price;
            }

            console.log("resulttttadadaaaa",resultData)
            resultData.forEach(element => {

                var tempFee = 0
                if(element.coin_type == 'BTC') {
                    tempFee = result.btc_fee.out_fee
                } else if (element.coin_type == 'ETH') {
                    tempFee = result.eth_fee.out_fee
                } else if (element.coin_type == 'DFSD') {
                    tempFee = result.dfsd_fee.out_fee
                } else if (element.coin_type == 'DFSC') {
                    tempFee = result.dfsc_fee.out_fee
                }

                if(element.coin_type == this.state.coinType) {
                    var setParam = {
                    coinType: element.coin_type,
                    coinImage: element.file_url,
                    balance: element.exchange_can,
                    amount1: amount, // $37,831,07
                        amount2: amount*element.exchange_can, // $0.000
                    fee: tempFee,
                    detailURL: `/wallet/WalletDetail/1`
                    }
                    this.setState({
                        walletData: setParam
                    })
                }
            });
            
        })
        .catch(e => {
            console.log(e, 'error')
            if (e.response?.status == 401) {
                console.log(e)
            } else {
                console.log(e)}
            }); // 401일때 로그인으로 보냄
    }

    getDepositInfo() {
        let params = {
            stake_idx: this.state.stakeIdx,
            coin_type: this.state.coinType
        }
        const response = commonApi('post', `/staking/getStakingInfo`, params);
        response.then( ({data}) => {
            this.setState({
                depositInfo: data.stakingInfo
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    insertReferral(refParams ,nowDate, dueDate) {
        console.log("refParams", refParams);
        const refResponse = commonApi('put', '/referral/insertReferral', refParams);
                refResponse.then(({data}) => {
                    console.log("refResult",data)

                    SimpleToast.show('staking finish.', SimpleToast.SHORT)
                        this.props.navigation.navigate('DepositComplete', {
                            data: this.state.depositInfo,
                            nowDate: nowDate,
                            dueDate: dueDate
                        })
                })
                .catch(e => {
                    if (e.response?.status == 401) {
                        console.log(e)
                    } else {
                        console.log(e)
                        SimpleToast.show('Server Connection Failed.', SimpleToast.SHORT)
                    }
                }); 
    }

    onPressRegister(nowDate, dueDate) {
        if(this.state.depositInfo.stake_amount > this.state.walletData.balance) {
            swal("Insufficient balance. Check your balance.") 
        } else {
            let params = {
                stake_idx: this.state.depositInfo.stake_idx,
                stake_profit: this.state.depositInfo.stake_profit,
                stake_amount: this.state.depositInfo.stake_amount,
                stake_from_date: nowDate,
                pre_pay_date: dueDate,
                profit_amount: this.state.depositInfo.profit_amount,
                total_amount: this.state.depositInfo.stake_amount + this.state.depositInfo.profit_amount,
                coin_type: this.state.depositInfo.coin_type,
                stake_period: this.state.depositInfo.stake_period,
                pay_period: 0,
                stake_title: this.state.depositInfo.stake_title
            }

            let refParams = {
            stake_idx: this.state.depositInfo.stake_idx,
            stake_amount: this.state.depositInfo.stake_amount,
            referral_coin: this.state.depositInfo.coin_type,
            }

            const response = commonApi('post', `/staking/insertStaking`, params);
            response.then( (res) => {
            if(res.success) {
                dueDate.setDate(dueDate.getDate()+1)
                this.insertReferral(refParams,nowDate, dueDate)
                
            } else {
                SimpleToast.show(res.message, SimpleToast.SHORT)
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
        }
    }

    

    componentDidMount() {
        this.getWalletData()
        this.getDepositInfo()
    }

    render() {
        let item = this.state.depositInfo;
        let walletItem = this.state.walletData;

        console.log(item)
        console.log(walletItem)
        const { currency } = Util
        let nowDate = new Date();
        let tempNowDate = new Date();
        let dueDate = new Date(tempNowDate.setMonth(tempNowDate.getMonth() + item.stake_period));
        dueDate.setDate(dueDate.getDate()-1)
        return(
            <ScrollView style={{backgroundColor:'white'}} contentContainerStyle={{flexGrow:1}}>
                <View style={styles.registerContainer}>
                    <Text style={styles.registerTitle}>Account Overview</Text>
                    <View style={styles.registerCard}>
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center' ,marginBottom:40}}>
                            <Image style={styles.img} source={{uri: item.file_url}}/>
                            <Text style={styles.cardTitle}>{item.stake_title}</Text>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Deposit amount(①)</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{ fontWeight: 'bold' ,textAlign:'right'}}>{currency(item.stake_amount)}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>{item.coin_type}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Annual interest rate</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{textAlign:'right',fontWeight: "bold"}}>{item.stake_profit}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>%</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Stake Period</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{textAlign:'right',fontWeight: "bold"}}>{item.stake_period}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>Month</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Subscription date</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <Text style={{textAlign:'right',fontWeight: "bold"}}>{nowDate.toISOString().split('T')[0]}</Text>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Expiration due</Text>
                            </View>
                            <View style={styles.contentContaner}>
                            {/* 값 수정 필요  */}
                                <Text style={{textAlign:'right',fontWeight: "bold"}}>{item.stake_period != undefined && dueDate.toISOString().split('T')[0]}</Text>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Interest Payment Date</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{textAlign:'right',fontWeight: "bold"}}>1st and 16th</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Expected return(②)</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>{Number(item.profit_amount).toLocaleString()}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>{item.coin_type}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Total return(①+②)</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{fontWeight:'bold', textAlign: 'right' }}>{Number(item.stake_amount + item.profit_amount).toLocaleString()}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>{item.coin_type}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer_user}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>My Retention Quantity</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{fontWeight:'bold', textAlign: 'right' }}>{Number(walletItem.balance).toLocaleString()}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>{item.coin_type}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer_user}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Quantity to Deposit</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{fontWeight:'bold', textAlign: 'right' }}>{Number(item.stake_amount).toLocaleString()}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>{item.coin_type}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer_user}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Quantity Held After Deposit</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{fontWeight:'bold', textAlign: 'right' }}>{Number(walletItem.balance - item.stake_amount).toLocaleString()}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>{item.coin_type}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.notice}>※  Payment will be made within 1 to 2 business days (excluding weekends and holidays) after the deposit period ends.</Text>
                        <View style={styles.termsContainer}>
                            <TouchableOpacity onPress={() => {
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
                                })}} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text  style={{color: '#4A4A4A'}}>I have read </Text>
                                {/* 모모달달을  띄띄우우던지  해해야야겠겠음음. */}
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Terms', {page:'DepositRegister'})}>
                                        <Text style={{color: '#4A4A4A', textDecorationLine: 'underline'}}>the deposit terms</Text>
                                    </TouchableOpacity>
                                <Text  style={{color: '#4A4A4A'}}>and conditions and agree to the contents.</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <RectangleButton
                            title='Go to List'
                            style={{flex:1, height:52, marginTop: 40, borderRadius:10, backgroundColor: '#fff', borderColor: '#1B2937', borderWidth: 2, marginHorizontal:5, marginBottom:20}}
                            textColor='#1B2937'
                            onPress={() => this.props.navigation.goBack()}
                        /> 
                        {this.state.termsChecked ?
                        <>
                        <RectangleButton
                            title='Confirm'
                            style={{flex:1, height:52, marginTop: 40, borderRadius:10, marginHorizontal:5, marginBottom:20}}
                            onPress={() => {this.showAlert()}}
                        /> 
                        
                        <AwesomeAlert
                        show={this.state.showAlert}
                        showProgress={false}
                        title=""
                        message="Did you check the deposit product overview? Would you like to apply now?"
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText="cancel"
                        confirmText="confirm"
                        confirmButtonColor="#67C0EE"
                        onCancelPressed={() => {
                            this.hideAlert();
                        }}
                        onConfirmPressed={() => {
                            this.hideAlert();
                            this.onPressRegister(nowDate, dueDate)
                        }}
                        />
                        </>
                        :
                        <RectangleButton
                            disable
                            title='Confirm'
                            style={{flex:1, height:52, marginTop: 40, borderRadius:10, backgroundColor: 'grey', marginHorizontal:5, marginBottom:20}}
                        />
                        }
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    registerContainer: {
        marginHorizontal: 16,
        paddingBottom: 50
    },
    registerTitle: {
        fontSize: 18,
        marginTop: 40,
        marginBottom: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#4A4A4A'
    },
    registerCard: {
        textAlign:'left',
        padding:0,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        position:'relative',
    },
    img:{
        marginRight :10,
        width:20,
        height:20,
        marginTop:30
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A4A4A',
        marginTop:30
    },
  
    descContainer: {
        flexGrow:1,
        height: 50,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    descContainer_user: {
        flexGrow:1,
        height: 50,
        backgroundColor:'#e7ebf0',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    descTitle: {
        color: '#A4A1A1',
    },
    descInnerView: {
        flexGrow: 1,
        flexBasis:1,
        marginLeft:30,
    },
    contentContaner: {
        flexGrow: 1,
        flexBasis: 1,
        justifyContent:'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap:'wrap',
        
        marginRight:30,
    },
    contentFirstView: {
        marginRight: 5,
        flexGrow: 2,
        flexBasis: 2,
        alignItems:'flex-end'
    },
    contentTwoView: {
        alignItems:'flex-end',
        flexGrow: 1,
        flexBasis: 1,
    },
    notice: {
        marginVertical: 20,
        color: '#9A9A9A',   
        marginHorizontal:30
    },
    termsContainer: {
        flexDirection: 'row',
        marginHorizontal:30
    },
    checkBox: {
        height: 20,
        marginLeft:-10,
        flexShrink:0,
    }
})

export default DepositRegister;