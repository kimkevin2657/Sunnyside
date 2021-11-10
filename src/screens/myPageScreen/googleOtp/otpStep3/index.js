import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
    Image,
    TextInput,
    BackHandler
} from 'react-native';
import { Color, Images } from '@common';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import SimpleToast from 'react-native-simple-toast';
import { commonApi } from '@common/ApiConnector';

class OtpStep3 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            identifyCode: '',
            mb_google_otp_key: this.props.navigation.getParam('mb_google_otp_key', ''),
            mb_recovery_code: this.props.navigation.getParam('mb_recovery_code', '')
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

    clickOtpOn() {
        let params = {
            otp: this.state.identifyCode,
            mb_google_otp_key: this.state.mb_google_otp_key,
            mb_recovery_code: this.state.mb_recovery_code
        }
        console.log(params)
        const response = commonApi('put', `/mypage/updateGoogleOtpKey?otp=${this.state.identifyCode}&mb_google_otp_key=${this.state.mb_google_otp_key}&mb_recovery_code=${this.state.mb_recovery_code}`);
        response.then( (res) => {
            console.log(res)
            if(res.success) {
                SimpleToast.show('OTP was enable.', SimpleToast.SHORT)
                this.props.navigation.navigate('MyPageMain')
            } else {
                SimpleToast.show(res.message, SimpleToast.SHORT)
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    onChangeValue = (val) => {
        this.setState({
            identifyCode: val 
        })
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="Google OTP"></HeaderBar>
                <View style={{flex:1, paddingHorizontal: 20, marginTop: 40}}>
                    <Text style={{fontSize: 16}}>Please complete by entering the 6-digit authentication numbers displayed on the Google OTP app.</Text>
                    <TextInput
                        maxLength={6}
                        style={[styles.inputTextContainer]}
                        placeholder={'Google Authentication code ( 6 digits )'}
                        placeholderTextColor={'#4A4A4A'}
                        selectionColor="grey"
                        keyboardType="numeric"
                        value={this.state.identifyCode}
                        onChangeText={this.onChangeValue}
                    />
                    <RectangleButton
                        title={'Activate OTP'}
                        style={{height: 47, marginTop: 45}}
                        onPress={() => this.clickOtpOn()}
                    />
                </View>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    inputTextContainer: {
        height: 50,
        borderWidth: 1.5,
        borderColor: '#D7D6D6',
        marginTop: 80,
        color:'black',
        paddingLeft: 10
    }
});


export default OtpStep3;
