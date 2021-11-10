import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import { useIsDrawerOpen } from '@common/react-navigation-drawer';
import ExchangeBox from '../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../components/_gmcCustom/RectangleButton';
import { withNavigationFocus } from 'react-navigation';
import { FlatList } from 'react-native-gesture-handler';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import { commonApi } from '@common/ApiConnector';
import SimpleToast from 'react-native-simple-toast';
import { store } from '@redux/store';
import Modal from "react-native-modal";
import axios from 'axios';

class walletMain extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            coinList: [],
            totalBalance : 0,
            exapp: 0,
            modalShow : false,
            refresh: false
        }

        this.scrollView = React.createRef();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    }

    onRefresh = () => {
        this.setState({
            refresh: !this.state.refresh
        })
    }

    
    scrollOnTop = () =>{
        this.scrollView.scrollTo(0);
    }

    handleBackPress = () => {
        let parentNavigation = this.props.navigation.dangerouslyGetParent();
        let prevRoute = parentNavigation.state.routes[parentNavigation.state.index];

        if (prevRoute.routeName === 'WalletMain') {
            console.log(store.getState().drawer.isDrawer,"끼아아악")
            if (store.getState().drawer.isDrawer) {
                store.dispatch({
                    type: 'CLOSE',
                })
                this.props.navigation.closeDrawer()
            } else {
                if (this.state.exapp == 0) {
                    this.setState({ exapp: 1 })
                }
                if (this.state.exapp == 2) {
                    clearTimeout(this.timeout);
                    BackHandler.exitApp();
                }
                if (this.state.exapp == 1) {
                    SimpleToast.show("'뒤로가기'버튼을 한번 더 누르시면 앱이 종료됩니다.", SimpleToast.SHORT);
                    this.setState({ exapp: 2 })
                    this.timeout = setTimeout(
                        () => {
                            this.setState({ exapp: 1 })
                        },
                        2000
                    );
                }
            }
        } else {
            return false
        }
        return true
    }

    getAccountList() {
        const coinData = {
            ownTotalAssets: 0,
            coinList: []
        }
        const tempAmount1 = (data, coinType) => {
            let amount;
            if (coinType == 'DFSD') {
                amount = 1
            } else if (coinType == 'DFSC') {
                amount = 0.02
            } else {
                amount = data[`${coinType.toLowerCase()}`]?.price;
            }
            return amount * 1;
        }

        const response = commonApi('post', '/asset/accountList');
        response.then((res) => {
            if (res.success) {
                var result = res.data.result
                var resultData = res.data.result.coins;
                // 여기서 상수로 이미지 부분에 url도메인추가
                resultData.forEach(element => {
                    coinData.coinList.push({
                        coinType: element.coin_type,
                        coinImage: element.file_url,
                        balance: element.exchange_can == undefined ? 0 : element.exchange_can,
                        amount1: tempAmount1(result, element.coin_type), // $37,831,07
                        amount2: tempAmount1(result, element.coin_type) * element.exchange_can, // $0.000
                        detailURL: 'wallet'
                     
                    })
                    coinData.ownTotalAssets += tempAmount1(result, element.coin_type) * element.exchange_can
                });

                let tmp = coinData.coinList[2];
                coinData.coinList[2] = coinData.coinList[0];
                coinData.coinList[0] = tmp
                this.setState({
                    coinList: coinData.coinList,
                    totalBalance: coinData.ownTotalAssets,
                })
            } else {
                SimpleToast.show(res.message,SimpleToast.SHORT)
            }
        })
            .catch(e => {
                    console.log(e)
                    SimpleToast.show(e,SimpleToast.SHORT)
                }
            );
    }
   
    componentDidUpdate(prevProps) {
        // if (prevProps.isFocused !== this.props.isFocused) {
        //     console.log('11')
        //     // Use the `this.props.isFocused` boolean
        //     // Call any action
        // }
    }

    componentDidMount() {
        store.dispatch({
            type: 'CLOSE',
        })
        this.getAccountList()
        // getAccountList()
    }

    componentWillUnmount() {
        // this.focusListener.remove();
        if (this.backHandler){
            this.backHandler.remove();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { navigation } = this.props;
        if(prevState.refresh != this.state.refresh) {
            this.getAccountList()
        }
    }
    render() {
        const { currency, decimalPointEight } = Util;
        return (
            <>
                <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
                {/* bgColor #1B2937 */}
                    <View style={{height:100,backgroundColor:'#1B2937',paddingVertical:20,paddingHorizontal:16,}}>
                            <View style={{marginBottom:20}}><Text style={{fontSize:18 , color:Color.white,fontWeight:'700'}}>Total assets</Text></View>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                    <TouchableOpacity onPress={()=>{this.getAccountList()}}>
                                        <Image source={Images.reload} style={{width:30,height:30}}></Image>
                                    </TouchableOpacity>
                                    <View style={{flexGrow:1,marginLeft: 20,flexDirection:'row',alignItems:'flex-start' ,justifyContent:'flex-end'}}>
                                        <View>
                                            <Text style={{ color: Color.white, fontSize: 20, fontWeight: '500' }}>$ </Text>
                                        </View>
                                        <View>
                                    <Text numberOfLines={3} style={{ color: Color.white, fontSize: 20, fontWeight: '500' }}>{currency(decimalPointEight(this.state.totalBalance))}</Text>
                                        </View>
                                    </View>
                            </View>
                    </View>
                    
                    {/* 지갑 메인 */}
                    <ScrollView style={{marginTop:10}} ref={(ref) => {this.scrollView = ref}}>
                        <View style={{paddingHorizontal:16,margin:0, backgroundColor:'#fff'}}>
                            <FlatList
                                data={this.state.coinList}
                                renderItem={({item})=>
                                    <ExchangeBox exchangeBoxStyle={{ marginVertical: 10,marginHorizontal:10, backgroundColor: 'white',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 5 }} data={item} unit={'$'} onPress={()=>{this.props.navigation.push('WalletDetailMain',{coinData : item, onRefresh: this.onRefresh})}}/>
                                }
                                ListEmptyComponent={
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',height:300}}>
                                        <View><Text style={[styles.fontSize14, { color: '#DCDBDB' }]}>There are no coins saved.</Text></View>
                                    </View>
                                }
                                keyExtractor={(item, index) => `${index}`}
                            />
                            <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:16}}>
                                <TouchableOpacity onPress={()=>{this.setState({modalShow : true})}}>
                                        <Image source={Images.coinPlus} style={{width:42,height:42}}></Image>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={{marginTop:34,flex:1,height:96,marginBottom:20,borderRadius:50}} onPress={()=>{Linking.openURL('https://bulligo.com/')}}>
                                <ImageBackground source={Images.bulligoBanner} style={{flex:1,resizeMode:'contain'}}></ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <BottomTab navigation={this.props.navigation} />
                    <Modal
                        isVisible={this.state.modalShow}
                        backdropOpacity={0.5}
                        backdropColor = {'black'}
                        style={styles.modal}
                    >
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:'100%',height:180,backgroundColor:Color.white,padding:30,justifyContent:'center',alignItems:'center',borderRadius:4}}>
                                <View>
                                    <Text style={{fontSize:15,fontWeight:'bold'}}>Support will be provided later.</Text>
                                </View>
                                <View style={{marginTop:30}}>
                                    <RectangleButton title={"confirm"} style={{width:240,height:55,backgroundColor:"#000000",borderRadius:10}} onPress={()=>{this.setState({modalShow:false})}}></RectangleButton>
                                </View>
                            </View>
                        </View>
                    
                    </Modal>
                </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    // 지갑 메인 
    exchangeBox:{
        
        flex:1,
        textAlign:'left',
        padding:30,
        // marginBottom: 12, 부모에서 margin 줘야함
        borderWidth:1,
        // border: 1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        position:'relative',
        fontSize:15,
        // margin:"0 auto",
        // marginBottom
    },
    exchangeBoxContent:{
        display:'flex',
        justifyContent:"space-between",
        alignItems:'center',
        flexDirection:'column'
    },
    exchangeBoxContentBox:{
        width:'100%',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    },
    exchangeItem:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        display:'flex',
        padding:0,
        alignItems:'center'
    },
    name:{
        flexDirection:'row',
        // flexWrap:'wrap',
        position:'relative',
        bottom:1,
        fontSize:15,
        color:"#292929",
        lineHeight:20
    },
    secondFlex:{
        width:'100%',
        // flex:1,
    },
    secondPosition:{
        flex:1,
        // width:'100%',
        flexDirection:'row',
        textTransform:'uppercase',
        
        color:'#292929',
        display:'flex',
        justifyContent:'space-between',

    },
    coinPlus:{
        flex:1,
        // width:"100%",
        height:50,
        backgroundColor:"#1B2937",
        color: "#fff",
        justifyContent:'center',
        alignItems:'center'
        // marginTop:"40px"
    },
    modal:{
        // paddingHorizontal:20,
        // margin:0,
    },
});


export default withNavigationFocus(walletMain);
