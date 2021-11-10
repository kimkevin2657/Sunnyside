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
    TouchableOpacity
} from 'react-native';
import { Color, Images } from '@common';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import SimpleToast from 'react-native-simple-toast';
import { commonApi } from '@common/ApiConnector';

class OtpStep1 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            certType: ''
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

    checkCertType() {
        const response = commonApi('post', `/auth/open/certificationType`);
        response.then( (res) => {
            if(res.success) {
                this.setState({
                    certType: res.data.certType
                })
            } else {
                SimpleToast.show(res.message, SimpleToast.SHORT)
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    deleteOtp() {
        const response = commonApi('post', `/mypage/getGoogleRecoveryCode`);
        response.then( (res) => {
            if(res.success) {
                let recoveryCode = res.data.gotpRecoveryCode;
                const _response = commonApi('post', `/mypage/recoveryOtp?gotp_recovery_code=${recoveryCode}`);
                _response.then( (_res) => {
                    if(_res.success) {
                        SimpleToast.show('OTP was disabled.', SimpleToast.SHORT)
                        this.setState({
                            certType: ''
                        })
                    } else {
                        console.log('error:: ', _res.message)
                        SimpleToast.show('fail disable OTP. try again ', SimpleToast.SHORT)
                    }
                }).catch(e => {
                    console.log('error:: ',e);
                })
            } else {
                SimpleToast.show(res.message, SimpleToast.SHORT)
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.checkCertType()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.certType != this.state.certType) {
            this.checkCertType()
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="Google OTP"></HeaderBar>
                <View style={{flex:1}}>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold'}}>Two-factor authentication</Text>
                    </View>
                    <View style={styles.otpCard}>
                        <Text style={{fontSize: 16, color: '#4A4A4A'}}>Google OTP</Text>
                        <Image style={styles.otpImg} source={Images.googleOtpLogo}/>
                        <Text style={{color: '#4A4A4A'}}>Google OTP is used for security</Text>
                        <Text style={{color: '#4A4A4A'}}>when using DFians Wallet and deposit products.</Text>
                        {this.state.certType == 'OTP' ?
                        <TouchableOpacity onPress={() => this.deleteOtp()}>
                            <Image style={styles.btnImg} source={Images.buttonOn}/>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('OtpStep2')}>
                            <Image style={styles.btnImg} source={Images.buttonOff}/>
                        </TouchableOpacity>
                        }
                    </View>
                </View>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    title: {
        height: 40,
        backgroundColor: '#F4F4F4',
        justifyContent: 'center',
        paddingLeft: 30
    },
    otpCard: {
        height: 250,
        borderWidth: 1,
        borderColor: '#E7E7E7',
        marginHorizontal: 20,
        marginTop: 15,
        alignItems: 'center',
        padding: 20
    },
    otpImg: {
        height: 80,
        width: 80,
        marginVertical: 10
    },
    btnImg: {
        height: 30,
        width: 50,
        marginTop: 10
    }
});


export default OtpStep1;
