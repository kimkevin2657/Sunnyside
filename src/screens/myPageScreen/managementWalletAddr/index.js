import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
    Image,
    BackHandler, 
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Color, Images, Styles } from '@common';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import { commonApi } from '@common/ApiConnector';
import Clipboard from '@react-native-community/clipboard';
import SimpleToast from 'react-native-simple-toast';
import Modal from "react-native-modal";
import RectangleButton from '../../../components/_gmcCustom/RectangleButton';

class managementWalletAddr extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            favList: [],
            modalShow : false,
            inputFavAddress : "",
            inputFavName : "",
            coinType:"",
            selectedIdx: "",
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

    // getAccountList() {
    //     const response = commonApi('post', `/asset/accountListMobile`);
    //     response.then( (res) => {
    //         if(res.success) {
    //             this.setState({
    //                 accountList: res.data.result
    //             })
    //         } else {
    //             SimpleToast.show(res.message, SimpleToast.SHORT)
    //         }
    //     }).catch(e => {
    //         console.log('error:: ',e);
    //     })
    // }

    updateFavorites(fav_name,fav_address,coin_type,idx) {
        
        this.setState({
            inputFavAddress: fav_address,
            inputFavName: fav_name,
            coinType: coin_type,
            selectedIdx: idx
        })

        this.setState({
            modalShow:true,
        })
    }

    handleCloseModal = (value) => {

        console.log("closesssseseessese",value)
        //txlist
        const insertFavDataResponse = commonApi('post', '/exchange/updateExchangeFav',{
            coin_type:value.coin_type,
            fav_name: value.fav_name,
            fav_address: value.fav_address,
            idx : value.idx
            }).then((data) => {
                console.log("up finish", data)
            if(data.success == true) {
                if(data.code == "0000") {
                    
                    // alert("favorite user was added!")
                    this.setState({
                        inputFavName : "",
                        inputFavAddress: "",
                        coinType: "",
                        selectedIdx: "",
                        modalShow : false
                    })

                    this.getWithdrawalHistory()
                }
                
            }
            
        })
        .catch(e => {
            console.log("err",e)
        });    
    }

    finishUpdateFavorites() {

        this.setState({
            modalShow:false,
        })
    }

    getWithdrawalHistory() {

        //여기서 즐겨찾기, 최근보낸유저 리스트 나옴
        //최근보낸 유저
        var tempFavData = []
        //txlist
        const favDataResponse = commonApi('post', 'exchange/ExchangeFavListAll');
            favDataResponse.then(({ data }) => {
                console.log("favadata",data.favList)
                var tempListData = data.favList;
                // tempListData.forEach(element => {
                //     tempFavData.push({ coinName: el, data: element })
                // })
                // setWithdrawHistoryList(tempFavData)
                this.setState({
                    favList: tempListData
                })

            })
                .catch(e => {
                    if (e.response?.status == 401) {
                        console.log(e)
                    } else {
                    }
                });//401일때 로그인으로 보냄
    }

    copyToClipboard = (address) => {
        Clipboard.setString(address);
        SimpleToast.show('copy address.', SimpleToast.SHORT)
    }

    componentDidMount() {
        this.getWithdrawalHistory()
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="지갑 주소 관리"></HeaderBar>
                {/* <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image source={Images.loading} style={{width:86,height:86}}></Image>
                    <View style={{marginTop:40,marginBottom:20}}>
                        <Text style={styles.titleText}>
                            <Text>현재</Text>
                            <Text style={{fontWeight:'bold'}}> 서비스 준비중 </Text>
                            <Text>입니다.</Text>
                        </Text>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.contentText}>이용에 불편을 드려 죄송합니다.</Text>
                        <Text style={styles.contentText}>보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다.</Text>
                        <Text style={styles.contentText}>빠른 시일내에 준비하여 찾아뵙겠습니다.</Text>                        
                    </View>
                </View> */}
                {this.state.favList.length == 0 ? 
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color: '#4A4A4A'}}> 현재 등록된 지갑 주소가 없습니다.</Text>
                </View> :
                <FlatList
                    style={{flex:1, marginTop: 30}}
                    data = {this.state.favList}
                    renderItem = { ({item}) => 
                        <View style={styles.walletAddrBox}>
                                <View style={styles.walletAddrContentBox}>
                                    <View style={styles.walletAddrItem}>
                                        <View style={{flexDirection:'row', marginBottom:10}}>
                                            <View style={{backgroundColor:'#FED10A', paddingHorizontal:10, paddingVertical:5, borderRadius:15,marginLeft:-20}}><Text style={{color:'#fff',}}>{item.coin_type}</Text></View>
                                            <View>
                                                <Text style={{paddingVertical:5,marginLeft:10,  fontWeight:'bold'}}>{item.fav_name}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.walletAddrItem}>
                                        <View>
                                            <Text style={{fontSize:14, color:'#292929'}}>{item.fav_address}</Text>
                                        </View>
                                    </View>
                                    </View>
                                    
                                    <View style={styles.secondFlex}>
                                        <View style={styles.secondPosition}>
                                            <TouchableOpacity onPress = {() => this.copyToClipboard(item.fav_address)}>
                                                <Image style={{width:25, height:25, alignItems:'center',marginRight:10}} source={Images.clarity_copy_line}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{paddingHorizontal:10, paddingVertical:5,borderRadius:15, borderWidth:1, borderColor:'#000' }} onPress = {() => this.updateFavorites(item.fav_name,item.fav_address,item.coin_type,item.idx)}>
                                                <Text style={{fontSize:14}}> 수정 </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                        </View>
                    }
                />
                }
                <BottomTab navigation={this.props.navigation}/>
                <Modal
                    isVisible={this.state.modalShow}
                    backdropOpacity={0.5}
                    backdropColor = {'black'}
                    style={styles.Modal}
                >
                    
                        <View style={styles.ModalContainer}>
                            <View style={{paddingRight:8,alignItems:'flex-end'}}>
                                <TouchableOpacity onPress={()=>{this.setState({modalShow: false, inputFavName : ""})}} disabled={false}>
                                    <Image style={{width:12,height:12}} source={Images.modalClose}></Image>
                                </TouchableOpacity>
                            </View>
                            {/* <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0} contentInset={{bottom :0}}> */}
                                <ScrollView style={Styles.ScrollContainer}>
                                    <View style={{marginTop:10,alignItems:'center'}}>
                                        <Text style={{fontSize:16,lineHeight:20,fontWeight:'500',}}>Add favorite withdrawal address</Text>
                                    </View>
                                    <View style={{marginTop:30}}>
                                        <View><Text style={{fontSize:16,lineHeight:19,fontWeight:'700'}}>Digital asset</Text></View>
                                        <View style={{marginTop:11}}><TextInput style={{height:51,borderWidth:1,borderColor:'#D7D6D6',paddingHorizontal:7,fontSize:16,fontWeight:'500',lineHeight:20}} placeholder={this.state.coinType} value={this.state.coinType} editable={false} selectTextOnFocus={false} placeholderTextColor={Color.textGray} disabled></TextInput></View>
                                    </View>
                                    <View style={{marginTop:30}}>
                                        <View><Text style={{fontSize:16,lineHeight:19,fontWeight:'700'}}>Name</Text></View>
                                        <View style={{marginTop:11,borderColor:'#D7D6D6',borderWidth:1,flexDirection:'row',paddingRight:15,justifyContent:'center',alignItems:'center'}}>
                                            <TextInput style={{flex:1,height:51,paddingHorizontal:7,fontSize:16,fontWeight:'500',lineHeight:20}} placeholder="Required" placeholderTextColor={Color.textGray} onChangeText={(e)=>{if(e.length <11)this.setState({inputFavName : e})}} value={this.state.inputFavName}></TextInput>
                                            <Text style={{fontSize:16,lineHeight:20,fontWeight:'500',color:Color.textGray}}>{this.state.inputFavName.length}/10</Text>
                                        </View>
                                    </View>
                                    <View style={{marginTop:30}}>
                                        <View><Text style={{fontSize:16,lineHeight:19,fontWeight:'700'}}>Withdrawal address</Text></View>
                                        <View style={{marginTop:11}}>
                                            <TextInput style={{height:51,borderWidth:1,borderColor:'#D7D6D6',paddingHorizontal:7,fontSize:12,fontWeight:'400',lineHeight:14}} value={this.state.inputFavAddress} disabled></TextInput>
                                        </View>
                                    </View>
                                    <View style={{marginTop:27}}>
                                        <RectangleButton style={{height:51}} title={"Add"} disable={this.state.inputFavName == "" ? true : this.state.inputFavAddress == "" ? true: false} onPress={()=>this.handleCloseModal({
                                            coin_type : this.state.coinType,
                                            fav_name: this.state.inputFavName,
                                            fav_address: this.state.inputFavAddress,
                                            idx: this.state.selectedIdx
                                        })}></RectangleButton>
                                    </View>
                                </ScrollView>
                            {/* </KeyboardAwareScrollView> */}
                        </View>
                    
                </Modal>
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    walletAddrBox:{
        // height:130,
        flex: 1,
        textAlign:'left',
        padding:20,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        marginBottom: 20,
        marginHorizontal: 15,
    },
    walletAddrBoxContent:{
        flex:1,
    },
    walletAddrContentBox:{
        flex:1,
        // justifyContent:'space-between',
        flexDirection:'row',
    },
    walletAddrItem:{
        flex:2,
        // justifyContent:'space-between',
        alignItems:'center',
        padding:0,
    },
    secondFlex:{
        marginLeft:30,
        flex:1,
    },
    secondPosition:{
        flex:1,
        flexDirection:'row',
        textTransform:'uppercase',
        color:'#292929',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    titleText : {
        fontSize:20,
        color:"#4A4A4A"
       },
       contentText : {
        fontSize:15,
        color:"#4A4A4A"
       },
       Modal:{
        paddingHorizontal:20,
        margin:0,
    },
    ModalContainer:{
        paddingTop:23,
        paddingHorizontal:15,
        borderRadius:20,
        backgroundColor:Color.white,
        width:'100%',
        height:520,
    },
});


export default managementWalletAddr;
