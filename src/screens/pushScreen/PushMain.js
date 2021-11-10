import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    BackHandler
} from 'react-native';
import { Color, Images } from '@common';
import { commonApi } from '@common/ApiConnector';
import BottomTab from '../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../components/_gmcCustom/HeaderBar';

class PushMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 8,
            pushList: [],
            pageNo: 1,
            isFetching :false,
            isListEnd :false,
            isRefresh : false,
            soltTypeValue : "",
            soltTypeLabel : "",
            soltPicker : false,
            soltTypeList : [
                {label : "Total",value : "total"},
                {label : "Login",value : "login"},
                {label : "Wallet",value : "trade"},
                {label : "Dfians",value : "etc"},
            ]
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

    getPushList() {
        if (this.state.isFetching || this.state.isListEnd) {
            return;
        }
        this.setState({
            isFetching : true,
        });
        
        //파람으로 소팅을 하게 수정해야 될듯
        let params = {            
            page_no: this.state.pageNo, 
        }

        const response = commonApi('post', `/mypage/getPushList`, params);
        response.then( ({data}) => {
            console.log("result :",data)
            if(this.state.pageNo < data.paging.endPageNo) {   
                //푸시리스트 다 까서 가공이 좀 필요함, 
                //date ->날짜/시간             
                //noti type -> 리다이렉트 할 페이지

                const tempAlarmList = []
                data.result.map((value, index) => {

                    var tempAlarmObject = {} //date, time, category, redirectView
                    const pureDate = value.reg_date.split('.')
                    const tempDate = pureDate[0].split('T')
                    value.date = tempDate[0].replace(/-/g, ".")
                    value.time = tempDate[1]
                    // value.time = pureDate[0].split('T').substr(0, pureDate.split('T')[1].length-2 )


                    if(value.notify_type == "notice") {
                        value.redirectView = "noticeMain"
                    } else if(value.notify_type == "qna"){
                        value.redirectView = "inquireMain"
                    } else if(value.notify_type == "login"){
                        value.redirectView = "ManagementLogin"
                    } else if(value.notify_type.split('_')[0] == "stake"){
                        value.redirectView = "HistoryMain"
                    } else if(value.notify_type.split('_')[0] == "ico"){
                        value.redirectView = "WalletMain"
                    } else if(value.notify_type.split('_')[0] == "wallet"){
                        value.redirectView = "WalletMain"
                    }


                    console.log("asdasdasdasdadadads",value)
                    tempAlarmList.push(value)
                })

                this.setState({
                    pushList : [...this.state.pushList, ...data.result],
                    isFetching : false,
                })
            } else {
                this.setState({
                    isFetching : false,
                    isListEnd : true,
                });
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
        
    }

    isCloseToBottom (){
        this.setState({pageNo : this.state.pageNo + 1})
    }

    componentDidMount() {
        this.getPushList()
    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.pageNo !== this.state.pageNo){
            this.getPushList();
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={() => { this.props.navigation.goBack() }} title="Notification"></HeaderBar>
                <View style={styles.bodyContainer}>
                {/* dropDown 추가 */}
                {this.state.soltPicker && index == 0&&
                        <View style={{height:100,width:100,backgroundColor:'#EEEEEE',position:'absolute',top:-10,right:0,justifyContent:'space-evenly'}}>
                            {
                                this.state.soltTypeList.map((v,i)=>{
                                    return(
                                        <TouchableOpacity onPress={()=>{this.setState({soltTypeValue : v.value,soltTypeLabel : v.label,soltPicker : false})}}>
                                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                                <Text style={[styles.fontSize14,{color:"#4A4A4A"}]}>{v.label}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    }
                {this.state.pushList.length != 0 ?
                    <FlatList
                        data={this.state.pushList}
                        renderItem={({item})=>
                            <View style={styles.listContainer}>
                                <View style={{flex:1, width:'100%'}}>
                                    <View style={{flex:1, width:'100%'}}>
                                        <Text style={{fontWeight: 'bold', fontSize:16}}>{item.date}</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{flex:3}}>
                                            <View style={{flexDirection:'row'}}>
                                                <Image style={{width:8, height:8, borderRadius:4 ,backgroundColor:'#ffdd00', marginTop:4 , marginRight:5}}></Image>
                                                <Text style={styles.pushTitle,{alignItems:'center', justifyContent:'center'}}>{item.category}</Text>
                                            </View>
                                            
                                            <Text style={styles.pushDate,{marginLeft:11}}>{item.time}</Text>
                                        </View>
                                        <View style={{flex:7}}>
                                            <Text style={styles.pushTitle}>{item.notify_type}</Text>
                                            <Text style={styles.pushTitle}>{item.notify_content}</Text>
                                            <TouchableOpacity style={{alignItems:'flex-start'}} onPress={()=>{this.props.navigation.navigate(item.redirectView)}}>
                                                <Text style={styles.pushDate}>more detail > </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }
                        onEndReachedThreshold = {0.5}
                        onEndReached = {() => {!this.state.isFetching && !this.state.isListEnd && this.isCloseToBottom()}}
                        keyExtractor={(item, index) => `${index}`}
                        refreshing={this.state.isRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefresh}
                                onRefresh={() => {   
                                    if(this.state.pageNo === 0){
                                        this.setState({
                                            pushList : [],    
                                            isListEnd : false                                     
                                        })             
                                        this.getPushList();
                                    }else{
                                        this.setState({
                                            pushList : [],    
                                            isListEnd : false,
                                            pageNo : 0                            
                                        })    
                                    }                                                                                                                                         
                                }}
                            />
                        }


                        // ListEmptyComponent = {
                        //     <View style={{flex:1, alignItems:'center', marginTop: 30}}>
                        //         <Text style={{color: 'grey'}}>공지사항이 없습니다.</Text>
                        //     </View>
                        // }
                    /> :
                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color: 'grey'}}>알림사항이 없습니다.</Text>
                    </View>
                }
                </View>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
    },
    listContainer: {
        minHeight: 80,
        paddingVertical: 10, 
        paddingHorizontal: 30,
        // borderBottomWidth: 1,
        // borderBottomColor: '#EAEAEA',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pushTitle: {
        color: '#4A4A4A',
        fontSize:14,
        lineHeight:25
    },
    pushDate: {
        fontSize:12,
        lineHeight:25,
        color: '#929292'
    },
});


export default PushMain;
