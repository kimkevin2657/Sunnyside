import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    BackHandler
} from 'react-native';
import { Color, Images } from '@common';
import { commonApi } from '@common/ApiConnector';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';

class NoticeMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 8,
            noticeList: [],
            pageNo: 0,
            isFetching :false,
            isListEnd :false,
            isRefresh : false,
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


    getNoticeList() {
        if (this.state.isFetching || this.state.isListEnd) {
            return;
        }
        this.setState({
            isFetching : true,
        });

        let params = {
            bnc_idx: 1,
            page_size: this.state.pageSize,
            page_no: this.state.pageNo,
            country : 'ko'
        }

        const response = commonApi('get', `/board/open/noticeListInfo`, params);
        response.then( ({data}) => {
            if(this.state.pageNo < data.paging.endPageNo) {                
                this.setState({
                    noticeList: [...this.state.noticeList, ...data.result],
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
        this.getNoticeList()
    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.pageNo !== this.state.pageNo){
            this.getNoticeList();
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="공지사항"></HeaderBar>
                <View style={styles.bodyContainer}>
                {this.state.noticeList.length != 0 ?
                    <FlatList
                        data={this.state.noticeList}
                        renderItem={({item})=>
                            <TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('NoticeDetail', {noticeIdx: item.bn_idx, page : this.state.pageNo})}>
                                <View>
                                    <Text style={styles.noticeTitle}>{item.bn_title}</Text>
                                    <Text style={styles.noticeDate}>{item.reg_date}</Text>
                                </View>
                                <Image source={Images.rightArrow} style={styles.arrowIcon}></Image>
                            </TouchableOpacity>
                        }
                        onEndReachedThreshold = {0.5}
                        onEndReached = {() => {!this.state.isFetching && !this.state.isListEnd && this.isCloseToBottom()}}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent = {
                            <View style={{flex:1, alignItems:'center', marginTop: 30}}>
                                <Text style={{color: 'grey'}}>공지사항이 없습니다.</Text>
                            </View>
                        }
                        refreshing={this.state.isRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefresh}
                                onRefresh={() => {   
                                    if(this.state.pageNo === 0){
                                        this.setState({
                                            noticeList : [],    
                                            isListEnd : false                                     
                                        })             
                                        this.getNoticeList();
                                    }else{
                                        this.setState({
                                            noticeList : [],    
                                            isListEnd : false,
                                            pageNo : 0                            
                                        })    
                                    }                                                                                                                                         
                                }}
                            />
                        }
                    /> :
                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color: 'grey'}}>공지사항이 없습니다.</Text>
                    </View>
                }
                </View>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        height: 52,
        marginHorizontal: 20,
    },
    bodyContainer: {
        flex: 1,
    },
    listContainer: {
        height: 80,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    noticeTitle: {
        color: '#4A4A4A'
    },
    noticeDate: {
        marginTop: 5,
        color: '#929292'
    },
    arrowIcon : {
        width:10,
        height:14,
        marginRight: 10
    },
});


export default NoticeMain;
