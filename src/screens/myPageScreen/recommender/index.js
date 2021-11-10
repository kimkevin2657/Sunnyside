import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image,
    RefreshControl,
    BackHandler
} from 'react-native';
import { Color, Images, Util } from '@common';
import { commonApi } from '@common/ApiConnector';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import Clipboard from '@react-native-community/clipboard';
import SimpleToast from 'react-native-simple-toast';

class Recommender extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            recommendCode: '',
            recommendMemberList: [],
            isFetching : false,
            isRefresh : false,
        };
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

    getRecommender() {
        const response = commonApi('post', `/mypage/myInfo`);
        response.then( ({data}) => {
            //console.log(data);
            this.setState({
                recommendCode: data.member.cf_code,
                recommendMemberList: data.cf_member_list
            })
            // 임시 데이터

            // this.setState({
            //     recommendMemberList: [
            //         {
            //             name: '오소라',
            //             coin: '100 DFSD',
            //             date: '2020.07.22. 14:08'
            //         },
            //         {
            //             name: '홍욱정',
            //             coin: '150 DFSD',
            //             date: '2021.01.22. 14:08'
            //         },
            //         {
            //             name: '서연정',
            //             coin: '200 DFSD',
            //             date: '2020.07.22. 14:08'
            //         }
            //     ]
            // })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.getRecommender();
    }

    copyToClipboard = () => {
        Clipboard.setString(this.state.recommendCode);
        SimpleToast.show('추천코드가 복사되었습니다.', SimpleToast.SHORT)
    }

    render() {
        const {currency, decimalPointEight} = Util;

        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="추천인"></HeaderBar>
                <ScrollView 
                        refreshing={this.state.isRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefresh}
                                onRefresh={() => {                                                                                                           
                                    this.setState({
                                        recommendMemberList : [],                                         
                                    })             
                                    this.getRecommender();
                                }}
                            />
                        }
                    >
                    <View style={styles.bodyContainer}>
                        <Text style={styles.boxTitle}>내 추천코드</Text>
                        <Text style={styles.subTitle}>내 추천코드를 복사하여 지인에게 보내어{'\n'}예치상품 구매 후 3% 수익을 일시불로 받아보세요!</Text>
                        <View style={styles.boxContainer}>
                            <Text style={styles.innerText}>{this.state.recommendCode}</Text>
                            <TouchableOpacity onPress = {() => this.copyToClipboard()}>
                                <Image style={styles.img} source={Images.clarity_copy_line}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.boxTitle, {marginTop: 40, marginBottom: 10}]}>내가 추천한 회원</Text>
                        <View style={styles.boxContainer}>
                            <Text style={styles.innerText}></Text>
                        </View>
                        <Text style={[styles.boxTitle, {marginTop: 40, marginBottom: 20}]}>나를 추천한 회원</Text>
                        <FlatList
                            scrollEnabled={false}
                            data={this.state.recommendMemberList}                        
                            renderItem={({item})=>
                                <View style={styles.memberBox}>
                                    <View style={styles.recommenderMember}>
                                        <Text style={styles.memberText}>{item.mb_full_name}</Text>
                                        <Text style={styles.memberText}>{currency(decimalPointEight(item.referral_amount))} DFSD</Text>
                                    </View>
                                    <Text style={styles.recommenderDate}>{item.reg_date?.substr(0,10)}</Text>
                                </View>
                            }
                            keyExtractor={(item, index) => `${index}`}
                            ListEmptyComponent = {
                                !this.state.isFetching && (
                                    <View style={{flex:1, alignItems:'center', marginTop: 50}}>
                                        <Text style={{color: 'grey'}}>나를 추천한 회원이 없습니다.</Text>
                                    </View>
                                )
                            }                            
                        />
                    </View>
                    <View style={{height:50}}/>
                </ScrollView>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    bodyContainer: {
        marginHorizontal: 15,
        marginTop: 40
    },
    boxTitle: {
        fontSize: 16,
        color: '#4A4A4A',
        fontWeight: 'bold',
        marginBottom: 5
    },
    subTitle: {
        fontSize: 14,
        color: '#858585',
        marginBottom: 30
    },
    boxContainer: {
        height: 50,
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 20
    },
    innerText: {
        fontSize: 16,
        color: '#858585'
    },
    memberBox: {
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#BEBEBE',
        paddingLeft: 20,
        justifyContent:'center'
    },
    recommenderMember: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    recommenderDate: {
        flexDirection: 'row',
        textAlign: 'right',
        fontSize: 14,
        color: '#858585'
    },
    memberText: {
        fontSize: 16,
        color: '#292929',
        marginBottom: 1
    },
    img: {
        height: 20,
        width: 15
    }
});


export default Recommender;
