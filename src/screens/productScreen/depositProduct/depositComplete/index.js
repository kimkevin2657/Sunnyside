import React from 'react';``
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    BackHandler,
    Image
} from 'react-native';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton'
import { Util } from '@common'
import NavigationService from '@app/navigation/NavigationService';

class DepositRegister extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            depositData: this.props.navigation.getParam('data', ''),
            nowDate: this.props.navigation.getParam('nowDate', ''),
            dueDate: this.props.navigation.getParam('dueDate', ''),
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.screenProps.goFirstPage()
        this.props.navigation.navigate('DepositMain');
        return true;
    }

    render() {
        const { currency } = Util
        let item = this.state.depositData;
        return(
            <ScrollView style={{backgroundColor:'white'}} contentContainerStyle={{flexGrow:1}}>
                <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>The deposit product application has been completed.</Text>
                    <Text style={styles.completeSubTitle}>The deposit product application has been completed.</Text>
                    <View style={styles.completeCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image style={styles.img} source={{uri: item.file_url}}/>
                            <Text style={styles.cardTitle}>{item.stake_title}</Text>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Deposit amount</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <View style={styles.contentFirstView}>
                                    <Text style={{ fontWeight: 'bold', textAlign: "right" }}>{currency(item.stake_amount)}</Text>
                                </View>
                                <View style={styles.contentTwoView}>
                                    <Text>{item.coin_type}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>Total return</Text>
                            </View>
                                <View style={styles.contentContaner}>
                                    <View style={styles.contentFirstView}>
                                        <Text style={{ fontWeight:'bold',textAlign: 'right' }}>{item.stake_amount + item.profit_amount}</Text>
                                    </View>
                                    <View style={styles.contentTwoView}>
                                        <Text>{item.coin_type}</Text>
                                    </View>
                                </View>
                            </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>The principal due</Text>
                            </View>
                            <View style={styles.contentContaner}>
                                <Text style={{fontWeight: 'bold',textAlign:'right'}}>{this.state.dueDate.toISOString().split('T')[0]}</Text>
                            </View>
                        </View>
                        <View style={styles.descContainer}>
                            <View style={styles.descInnerView}>
                                <Text style={styles.descTitle}>We will notify you by email when the deposit is in progress.</Text>
                            </View>
                        </View>

                        {/* deposit main 말고 각 위치로 이동 시켜야 함. */}
                        <View>
                            <RectangleButton
                                title='Go To My Saving'
                                style={{flex:1, height:52, marginTop: 40, borderRadius:10,marginHorizontal:5, marginBottom:20}}
                                onPress={() => {
                                    this.props.screenProps.goOtherPage()
                                    NavigationService.navigate('HistoryMain')
                                }}
                            />
                            <RectangleButton
                                title='Go To Wallet'
                                textColor='#1B2937'
                                style={{flex:1, height:52, marginTop: 20, borderRadius:10, backgroundColor: '#fff', borderColor: '#1B2937', borderWidth: 2, marginHorizontal:5, marginBottom:20}}
                                onPress={() => {
                                    console.log("loggg",this.props.navigation)
                                    this.props.screenProps.goOtherPage()
                                    NavigationService.navigate('WalletMain')
                                }}
                            />
                        </View>
                        
                    </View>
                    
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    completeCard: {
        textAlign:'left',
        padding:30,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        position:'relative',
    },
    img: {
        marginRight :10,
        width:25,
        height:25,
        borderRadius:50,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#4A4A4A'
    },
    descInnerView: {
        flexGrow: 1,
        flexBasis: 1
    },
    contentContaner: {
        flexGrow: 1,
        flexBasis: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    contentFirstView: {
        marginRight: 5,
        flexGrow: 2,
        flexBasis: 2,
        alignItems: 'flex-end'
    },
    contentTwoView: {
        alignItems: 'flex-end',
        flexGrow: 1,
        flexBasis: 1,
    },
    descContainer: {
        height: 50,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    descTitle: {
        color: '#A4A1A1',
    },
    completeTitle: {
        fontSize: 20,
        marginTop: 50,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#4A4A4A'
    },
    completeContainer: {
        marginHorizontal: 16,
        paddingBottom: 50
    },
    completeSubTitle: {
        fontSize: 15,
        marginBottom: 20
    }
})

export default DepositRegister;