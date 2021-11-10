import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    BackHandler,
    FlatList
} from 'react-native';
import { Color } from '@common';
import { commonApi } from '@common/ApiConnector';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton'
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import AwesomeAlert from 'react-native-awesome-alerts';
import SimpleToast from 'react-native-simple-toast';
import { store } from '@redux/store';

class ManagementLogin extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            historyList: []
        }
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

    handleWithdrwal() {

        // this.props.navigation.navigate('MemberShipWithdrawal')



        const response = commonApi('post', 'auth/memberLeaveRequest');
                        response.then(({ data }) => {
                            if (data.success) {
                                // swal("Membership withdrawal has been completed. If you would like to withdraw quickly, please leave an inquiry.")
                                this.props.navigation.navigate('MembershipWithdrawal')
                                // console.log("data login", data.data.result);
                            } else {
                                SimpleToast.show('Server Connection Failed.', SimpleToast.SHORT)
                            }
                        })
                            .catch(e => {
                                console.log(e)
                                if (e.response?.status == 401) {
                                    console.log(e)
                                } else {
                                    SimpleToast.show('Server Connection Failed.', SimpleToast.SHORT)
                                }

                            });

    }

    logOut = () => {
 
        store.dispatch({
            type: 'CLEAR_USER',
        });

        SimpleToast.show('logout finish', SimpleToast.SHORT)
        this.props.navigation.navigate('GmcLoginScreen')
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

    getLoginHistory() {
        let params = {
            start_idx: '0',
            page_size: '20'
        }
        const response = commonApi('post', `/mypage/loginHistory`, params);
        response.then( ({data}) => {
            this.setState({
                historyList: data.result
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.getLoginHistory();
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <View style={{flex:1}}>
                    <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="Manage your sign in"></HeaderBar>
                    <View style={styles.bodyContainer}>
                        <Text style={styles.textContent}>This is the log in to the DFians wallet. If you have a record of not logging in yourself, please change your account password immediately.</Text>
                        {/* <RectangleButton
                                onPress = {() => console.log('change password')}
                                title = {'카카오 계정 비밀번호 변경하기'}
                                fontSize = {13}
                                style = {styles.btnStyle}
                        />
                        <RectangleButton
                            onPress = {() => console.log('logout all')}
                            title = {'모든 디바이스에서 로그아웃 하기'}
                            fontSize = {13}
                            style = {styles.btnStyle}
                        /> */}
                        <View style={styles.tableContainer}>
                            <View style={styles.attributeContainer}>
                                <Text style={[styles.tableText, {flex: 2, fontWeight: 'bold'}]}>Date</Text>
                                <Text style={[styles.tableText, {flex: 5, fontWeight: 'bold'}]}>Device/Browser</Text>
                                <Text style={[styles.tableText, {flex: 3, fontWeight: 'bold'}]}>Login IP</Text>
                            </View>
                            <FlatList
                                style={{flex:1}}
                                data={this.state.historyList}
                                renderItem={({item})=>
                                    <View style={styles.tupleContainer}>
                                        <View style={[styles.tableText, {flex: 2}]}>
                                            <Text style={styles.timeText}>{item.reg_date_format.split(' ')[0]}</Text>
                                            <Text style={styles.timeText}>{item.reg_date_format.split(' ')[1]}</Text>
                                        </View>
                                        <Text style={[styles.tableText, {flex: 5}]}>{item.agent_type}</Text>
                                        <Text style={[styles.tableText, {flex: 3}]}>{item.agent_ip}</Text>
                                    </View>
                                }
                                keyExtractor={(item, index) => `${index}`}
                            />
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <RectangleButton
                            onPress = {() => this.showAlert()}
                            title = {'Delete my Account'}
                            fontSize = {13}
                            textColor='#000000'
                            style = {styles.btnStyle}
                        />

                        {/* <RectangleButton
                            onPress = {() => this.logOut()}
                            title = {'Logout'}
                            fontSize = {13}
                            style = {styles.btnStyle_logout}
                        /> */}
                        </View>
                        

                        <AwesomeAlert
                        show={this.state.showAlert}
                        showProgress={false}
                        title=""
                        message="Please check your assets. really want to Delete account?"
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
                            this.handleWithdrwal()
                        }}
                        />
                    </View>
                </View>
                <View style={{height:50}}/>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        flex:1,
        height: 45,
        marginHorizontal: 5,
        marginBottom: 10,
        marginTop: 20,
        borderRadius:10, 
        backgroundColor:  '#fff',
        borderWidth:2,
        borderColor: '#1B2937'
    },
    btnStyle_logout: {
        flex:1,
        height: 45,
        marginHorizontal: 5,
        marginBottom: 10,
        marginTop: 20,
        borderRadius:10, 
    },
    bodyContainer: {
        flex:1,
        marginTop: 25,
        marginHorizontal: 15,
    },
    textContent: {
        fontSize: 14,
        color: '#4A4A4A',
        marginBottom: 30
    },
    tableContainer: {
        flex:1,
        borderColor: '#D7D6D6',
        borderWidth: 0.5,
        marginTop: 20
    },
    attributeContainer: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
    },
    tupleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tableText: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 12,
        color: '#4A4A4A'
    },
    timeText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#4A4A4A'
    }
});


export default ManagementLogin;
