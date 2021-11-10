import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    BackHandler
} from 'react-native';
import { Color, Images } from '@common';
import { commonApi } from '@common/ApiConnector';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';

class InquiryMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            qnaList: []
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
    
    getQnaList() {
        let params = {
            page_size: 20
        }
        const response = commonApi('get', `/board/qnaListInfo`, params);
        response.then( (res) => {
            if(res.success) {
                this.setState({
                    qnaList: res.data.result
                })
            } else {
                SimpleToast.show(res.message, SimpleToast.SHORT)
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.getQnaList();
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={() => { this.props.navigation.goBack() }} title="My Inquiry"></HeaderBar>
                {this.state.qnaList.length == 0 ?
                    <View style={styles.bodyContainer}>
                        <View style={{flex: 1, marginHorizontal: 15, marginTop: 40}}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.inquiryTitle}>My inquiry details</Text>
                            </View>
                            <View style={styles.contentContainer}>
                                <Image source={Images.my_inquiry_list_none} style={styles.walletIcon}></Image>
                                <Text style={styles.noContents}>I don't have any questions.</Text>
                            </View>
                            <RectangleButton
                                onPress = {() => this.props.navigation.navigate('InquireDetail')}
                                title = {'1:1 Inquire'}
                                style = {styles.btnStyle}
                            />
                        </View>
                    </View> :
                    <View style={styles.bodyContainer}>
                        <View style={{flex: 1, marginHorizontal: 15, marginTop: 40}}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.inquiryTitle}>My inquiry details</Text>
                            </View>
                            <FlatList
                                data={this.state.qnaList}
                                renderItem={({item})=>
                                    <TouchableOpacity style={styles.listContainer} onPress={() => this.props.navigation.navigate('InquireDetail', {inquireIdx: item.bq_idx})}
                                    >
                                        <View style={{flex:1, marginRight: 10}}>
                                            <Text style={styles.qnaTitle}>{item.bq_title} {item.bq_confirm == 'Y' ? ' [답변완료]' : ''}</Text>
                                            <Text style={styles.qnaDate}>{item.reg_date.substr(0,10)}</Text>
                                        </View>
                                        <Image source={Images.rightArrow} style={styles.arrowIcon}></Image>
                                </TouchableOpacity>
                                }
                                keyExtractor={(item, index) => `${index}`}
                            />
                            {/* <Text style={{color: '#4A4A4A', marginTop: 10}}>* 이전 문의 내역은 웹페이지에 방문하여 확인 바랍니다.</Text> */}
                            <RectangleButton
                                onPress = {() => this.props.navigation.navigate('InquireDetail')}
                                title={'1:1 Inquire'}
                                style = {styles.btnStyle}
                            />
                        </View>
                    </View>
                }
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        height: 52,
        marginHorizontal: 20,
        marginVertical: 20
    },
    bodyContainer: {
        flex: 1,
    },
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#BEBEBE',
        paddingBottom: 20,
    },
    contentContainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    inquiryTitle: {
        fontSize: 16,
        color: '#4A4A4A',
        fontWeight: 'bold'
    },
    noContents: {
        fontSize: 16,
        color: '#4A4A4A',
    },
    walletIcon: {
        height: 70,
        width: 90,
        marginBottom: 25
    },
    listContainer: {
        // height: 80,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    qnaTitle: {
        color: '#4A4A4A'
    },
    qnaDate: {
        marginTop: 5,
        color: '#929292'
    },
    arrowIcon : {
        width:10,
        height:14,
        marginRight: 10
    },
});


export default InquiryMain;
