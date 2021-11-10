import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    BackHandler,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';
import { Color, Images , Util} from '@common';
import { commonApi } from '@common/ApiConnector';
import Accordion from 'react-native-collapsible/Accordion'
import AccordionBox from '../../../components/_gmcCustom/AccordionBox';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import SimpleToast from 'react-native-simple-toast';

class HistoryCompleteMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            stakingList: [],
            proceedingActiveSections:[],
            completeActiveSections: [],
            tab:1,
        };
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

 

    getStakingList() {
        this.setState({
            loading:true
        })
        const response = commonApi('post', `/staking/getUserStakingList`);
        response.then((res) => {
            
            if (res.success) {
                let nowDate = new Date();
                let proceedingList = [];
                let completeList = [];
                if (res.data.userStakingList.length != 0) {
                    for (let i = 0; i < res.data.userStakingList.length; i++) {
                        if (nowDate < new Date(res.data.userStakingList[i].view_pre_pay_date.replace(" ", "T"))) {
                            // proceedingList.push(res.data.userStakingList[i])
                        } else {
                            completeList.push(res.data.userStakingList[i])
                        }
                    }
                }
                this.setState({
                    // proceedingList: res.data.userStakingList,
                    completeList: completeList
                })
                this.setState({
                    loading: false
                })
            } else {
                SimpleToast.show(res, SimpleToast.SHORT)
                // this.props.navigation.navigate('GmcLoginScreen')
                this.setState({
                    loading: false
                })
            }
        }).catch(e => {
            console.log('error:: ', e);
            SimpleToast.show('Server Connection Failed', SimpleToast.SHORT)
            this.setState({
                loading: false
            })

        })
    }

    componentDidMount() {
        this.getStakingList();
    }

    _renderProceedingHeader = (section, index) => {
        let idx = index < 9 ? '0' + (index + 1) : (index + 1);
    return (
        <View style={[this.state.proceedingActiveSections[0] == index ? styles.AccordionHeaderClose : styles.AccordionHeader, idx == 1 && {borderTopWidth: 1}]}>
                <Text>
                    <View>
                        <Text style={[styles.AccordionTitleText, {marginRight: 20}]}>{idx}</Text>
                    </View>
                    <View style={{flexGrow:1,flexBasis:1}}>
                        <Text style={styles.AccordionTitleText}>{section.stake_title + ` (${section.stake_profit}%)`}</Text>
                    </View>
                </Text>
                <View style={{flexDirection:'row', alignItems:'center',flexBasis:100,flexShrink:0, justifyContent:'flex-end'}}>
                    <Text style={styles.AccordionTitleText}>details</Text>
                    <View>
                        {this.state.proceedingActiveSections && this.state.proceedingActiveSections[0] == index ?
                        <Image source={Images.ArrowDown} style={{height: 10, width: 14}}/> :
                        <Image source={Images.ArrowUp} style={{height: 10, width: 14}}/>
                        }
                    </View>
                </View>
            </View>
        );
    };

    _renderCompleteHeader = (section, index) => {
        console.log(this.state.proceedingActiveSections)
        let idx = index < 9 ? '0' + (index + 1) : (index + 1);
    return (
        <View style={[this.state.completeActiveSections[0] == index ? styles.AccordionHeaderClose : styles.AccordionHeader, idx == 1 && { borderTopWidth: 1 } ]}>
            <View style={{flexDirection:'row',flexGrow:1,flexShrink:0,flexBasis:1,flexWrap:'wrap'}}>
                <View style={{flexBasis:50,alignItems:'flex-start'}}>
                    <Text style={[styles.AccordionTitleText, {marginRight: 20}]}>{idx}</Text>
                </View>
                <View style={{flexBasis:1,flexGrow:1,flexShrink:1}}>
                    <Text style={styles.AccordionTitleText}>{section.stake_title + ` (${section.stake_profit}%)`}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexBasis: 1,flexGrow:0.4, flexShrink: 0, justifyContent: 'flex-end'}}>
                    <Text style={styles.AccordionTitleText}>details</Text>
                    <View>
                        {this.state.completeActiveSections && this.state.completeActiveSections[0] == index ?
                        <Image source={Images.ArrowDown} style={{height: 10, width: 14}}/> :
                        <Image source={Images.ArrowUp} style={{height: 10, width: 14}}/>
                        }
                    </View>
                </View>
            </View>
        );
    };

    _renderContent = section => {
        let { currency }= Util;
        let today = new Date()
        let useDayGap = today - new Date(section.view_stake_from_date.replace(" ","T"));
        let useDay = Math.ceil( useDayGap / ( 1000 * 60 * 60 * 24)) + 1;
        let tempDate = new Date(section.view_pre_pay_date.replace(" ","T"));
        let amountGap = new Date(tempDate.setDate(tempDate.getDate() + 1)) - new Date(section.view_stake_from_date.replace(" ","T"))
        let expectedAmountDay = Math.ceil( amountGap / ( 1000 * 60 * 60 * 24)) + 1;

        if(today < new Date(section.view_pre_pay_date.replace(" ","T"))) {
            // return (
            //     <>
            //         <AccordionBox keyText={'Deposit amount'} valueText={currency(section.stake_amount) + 'DFSD'} />
            //         <AccordionBox keyText={'Annual interest rate'} valueText={section.stake_profit + '%'} />
            //         <AccordionBox keyText={'Deposit period'} valueText={currency(section.stake_period) + 'month'} />
            //         <AccordionBox keyText={'Interest payment date'} valueText={"1st and 16th of every month"} />
            //         <AccordionBox keyText={'Subscription date'} valueText={section.stake_from_date.split('T')[0]} />
            //         <AccordionBox keyText={'Days of use'} valueText={useDay + ' days'} />
            //         <AccordionBox keyText={'Paid cumulative revenue'} valueText={currency(section.unlock_amount != null && section.unlock_amount != undefined && section.unlock_amount != '' ? section.unlock_amount : 0) + ' DFSD'} />
            //         <AccordionBox keyText={'Expected Payment qty'} valueText={(currency(section.profit_amount) + ' DFSD')} />
            //         <AccordionBox borderRadius keyText={'Expiration Due'} valueText={(section.view_pre_pay_date.split('T')[0].substring(0, 10))} />
            //         {/* <AccordionBox keyText={'The principal due'} valueText = {section.pre_pay_date.split('T')[0]}/>
            //         <AccordionBox keyText={'Cumulative Revenue\n(Paid cumulative revenue)'} valueText = {useDay + ' day'}/> */}
            //     </>
            // );
        } else {
            return (
                <>
                    <AccordionBox keyText={'Deposit amount'} valueText = {currency(section.stake_amount)} divValueText={'DFSD'}/>
                    <AccordionBox keyText={'Annual interest rate'} valueText={section.stake_profit} divValueText={'%'}/>
                    <AccordionBox keyText={'Total amount paid'} valueText={currency(section.stake_amount + section.profit_amount)} divValueText={'DFSD'}/>
                    <AccordionBox keyText={'Deposit period'} valueText={section.stake_from_date.split('T')[0] + ' ~ ' + section.pre_pay_date.split('T')[0]} divValueText={'('+section.stake_period +' Months)'}/>
                    <AccordionBox borderRadius keyText={'Maturity payment date'} valueText={section.pre_pay_date.split('T')[0]} />
                </>
            );
        }
    };

    _updateProceedingSections = (activeSections) => {
        this.setState({ proceedingActiveSections: activeSections });
    };

    _updateCompleteSections = (activeSections) => {
        this.setState({ completeActiveSections: activeSections });
    };

    render() {
        const { proceedingList, completeList, loading } = this.state;
        const { currency } = Util
        return (
            !loading ? 
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                    <ScrollView removeClippedSubviews={true}>
                    {/* <HeaderBar noLeftBtn title="My deposit breakdown" ></HeaderBar> */}
                    {/* <View style={styles.tabContainer}>
                            <TouchableOpacity onPress={() => this.setState({ tab: 1 })} style={[styles.tab, this.state.tab == 1 && styles.tabCurrent]}><Text style={[styles.tabText, this.state.tab == 1 &&  styles.tabCurrentText]}>Deposits in progress</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ tab: 2 })} style={[styles.tab, this.state.tab == 2 && styles.tabCurrent]}><Text style={[styles.tabText, this.state.tab == 2 && styles.tabCurrentText]}>Deposits paymnet completed</Text></TouchableOpacity>
                    </View> */}
                        <View style={styles.bodyContainer}>
                            {/* {proceedingList && proceedingList.length != 0 ?
                            <>
                            <Text style={styles.proceedingTitle}>Deposits in progress</Text>
                            <View>
                            <Accordion
                                sections={proceedingList}
                                activeSections={this.state.proceedingActiveSections}
                                renderHeader={this._renderProceedingHeader}
                                renderContent={this._renderContent}
                                onChange={this._updateProceedingSections}
                                touchableComponent={TouchableOpacity}
                            />
                            </View>
                            </>:
                        <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
                            <Text style={{color: 'grey'}}>No Data</Text>
                        </View>
                            } */}
                            {completeList && completeList.length != 0 ?
                        <>
                            <Text style={styles.completeTitle}>Saving completed</Text>
                        <View>
                            <Accordion
                                sections={completeList}
                                activeSections={this.state.completeActiveSections}
                                renderHeader={this._renderCompleteHeader}
                                renderContent={this._renderContent}
                                onChange={this._updateCompleteSections}
                                touchableComponent={TouchableOpacity}
                            />
                        </View>
                        </>:
                        <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
                            <Text style={{color: 'grey'}}>No Data</Text>
                        </View>
                        }
                    </View>
                    <View style={{height:50}}/>
                </ScrollView>
                </SafeAreaView>
                :
                <View style={{flex:1 , alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator size="large" color={Color.grayIcon} />
                </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#bebebe'
    },
    tabContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#bebebe',
        borderBottomWidth: 1,
        borderBottomColor:'#bebebe'
    },
    tab: {
        flexGrow: 1,
        flexBasis: 1,
        alignItems: 'center',
        justifyContent:'center',
        textAlign: 'center',
        paddingVertical:15,
    },
    tabText: {
        color: '#9a9a9a',
        fontSize: 16,
    },
    tabCurrentText: {
        color: '#222',
    },
    tabCurrent: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
    },
    textContainer: {
        flex:1
    },
    bannerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop:15,
        paddingBottom: 15,
    },
    imgContainer:{
        zIndex:1,
        paddingTop:15,
        paddingBottom: 15,
        paddingLeft: 15,
        position: 'absolute'
    },
    img:{
        backgroundColor:'grey',
        width:25,
        height:25,
        borderRadius:50,
    },
    bodyContainer: {
        paddingHorizontal:16
    },
    proceedingTitle: {
        marginTop: 35,
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4A4A'
    },
    AccordionHeader: {
        marginTop:1,
        flexWrap:'wrap',
        minHeight: 50,
        // borderRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius:20,
        backgroundColor: '#eceff3',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    AccordionHeaderClose: {
        marginTop: 1,
        flexWrap: 'wrap',
        minHeight: 50,
        // borderRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    
        backgroundColor: '#eceff3',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    AccordionTitleText:{
        fontSize: 15,
        textAlign:'right',
        fontWeight:'bold',
        marginRight: 10
    },
    completeTitle: {
        marginTop: 35,
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4A4A'
    }
});


export default HistoryCompleteMain;
