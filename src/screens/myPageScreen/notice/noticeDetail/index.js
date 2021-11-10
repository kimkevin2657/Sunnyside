import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    BackHandler
} from 'react-native';
import { Color, Images } from '@common';
import { commonApi } from '@common/ApiConnector';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import { WebView } from 'react-native-webview';

class NoticeDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            noticeIdx: this.props.navigation.getParam('noticeIdx', ''),
            pageNo : this.props.navigation.getParam('page', ''),
            noticeData: {}
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

    getNoticeDetail() {
        let param = {
            bn_idx: this.state.noticeIdx
        };
        const response = commonApi('get', `/board/open/noticeDetailInfo`, param);
        response.then( ({data}) => {
            this.setState({
                noticeData: data.result
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.getNoticeDetail();
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="공지사항"></HeaderBar>
                <View style={styles.bodyContainer}>
                    {/* <View style={styles.contentHeader}>
                        <Text style={styles.headerTitle}>{this.state.noticeData.bn_title}</Text>
                        <Text style={styles.headerDate}>{this.state.noticeData.reg_date}</Text>
                    </View> */}
                    <WebView
                        source={{ uri: `http://221.168.38.145:3000/customerService/NoticeDetail_m/${this.state.noticeIdx}/${this.state.pageNo}` }}
                    />
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
    headerTitle: {
        fontSize: 16,
        color: '#4A4A4A',
    },
    headerDate: {
        fontSize: 12,
        color: '#929292',
        marginTop: 10
    },
    contentHeader: {
        height: 80,
        marginHorizontal: 30,
        justifyContent:'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
    },
    contentBody: {
        marginTop: 30,
    },
    bodyText: {
        color: '#4A4A4A'
    }
});


export default NoticeDetail;
