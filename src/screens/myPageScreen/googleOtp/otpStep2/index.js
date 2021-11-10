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
    Linking
} from 'react-native';
import { Color, Images } from '@common';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import { commonApi } from '@common/ApiConnector';
import Clipboard from '@react-native-community/clipboard';
import SimpleToast from 'react-native-simple-toast';
import QRCode from 'react-native-qrcode-svg';

class OtpStep2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            otpData: {}
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

    getRecoveryCode() {
        const response = commonApi('post', `/mypage/createGoogleOtpKey`);
        response.then( (res) => {
            if(res.success) {
                this.setState({
                    otpData: res.data
                })
            } else {
                SimpleToast.show(res.message, SimpleToast.SHORT)
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.getRecoveryCode()
    }
    
    copyToClipboard = () => {
        Clipboard.setString(this.state.otpData.mb_google_otp_key);
        SimpleToast.show('copy restore code', SimpleToast.SHORT)
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="Google OTP"></HeaderBar>
                <ScrollView style={{flex:1, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 40}}>① Google OTP Application download</Text>
                    <Text style={{marginVertical: 40}}>Please download Google OTP(Google Authenticator) App through Google Play Store(Android) or App Store(iPhone).</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.azure.authenticator')} style={[styles.btn, {marginRight:10}]}>
                            <Image style={styles.appImg} source={Images.googlePlay}/>
                            <Text style={{color:"#fff",fontSize: 11}}>Google Play</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://apps.apple.com/kr/app/google-authenticator/id388497605')} style={styles.btn}>
                        <Image style={styles.appImg} source={Images.apple}/>
                            <Text style={{color:"#fff",fontSize: 11}}>Apple Store</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 16, fontWeight: 'bold', marginVertical: 40}}>② Registration / Restore QR code</Text>
                    <Text style={{marginBottom: 40}}>Please scan the QR code with the downloaded Google OTP app or enter the code below manually in the app.</Text>
                    <View style={{alignItems:'center'}}>
                        <QRCode
                            size={150}
                            value={this.state.otpData.url}
                        />
                    </View>
                    <Text style={{marginTop: 20}}>Restore code</Text>
                    <View style={styles.copyContainer}>
                        <View style={styles.codeContainer}>
                            <Text>{this.state.otpData.mb_google_otp_key}</Text>
                        </View>
                        <TouchableOpacity style={styles.CopyTextContainer} onPress={() => this.copyToClipboard()}>
                            <Text>Copy</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color: '#FF0000'}}>Please copy and save the code on your phone.</Text>
                    <Text style={{color: '#FF0000'}}>You need the code to restore it when Google Authenticator is deleted.</Text>
                    <RectangleButton
                        title={'Next'}
                        style={{height:47, marginTop: 10}}
                        onPress={() => this.props.navigation.navigate('OtpStep3', {
                            mb_google_otp_key: this.state.otpData.mb_google_otp_key,
                            mb_recovery_code: this.state.otpData.mb_recovery_code
                        })}
                    />
                    <View style={{height:50}}/>
                </ScrollView>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    btn:{
        flex:1,
        height: 47,
        backgroundColor:"#1B2937",
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row'
    },
    appImg: {
        height: 18,
        width: 18,
        marginRight: 10
    },
    qrImg: {
        height: 90,
        width: 90
    },
    copyContainer: {
        marginVertical: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#D7D6D6',
        flexDirection: 'row'
    },
    codeContainer : {
        flex: 8,
        borderRightWidth: 1,
        borderRightColor: '#D7D6D6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CopyTextContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default OtpStep2;
