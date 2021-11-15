import React from 'react';
import { Alert } from 'react-native';
import { RealtimeDatabase } from '@common';
import messaging from '@react-native-firebase/messaging';
import { store, persistor } from '@redux/store';
import LoadingScreen from '../loadingScreen';
import { connect } from 'react-redux';

//SplashScreen (스플래쉬)

class SplashScreen extends React.PureComponent {
    async componentDidMount() {
        // if (this.props.token !== '') {
        //     RealtimeDatabase.startListening(); FireBase 실시간 데이터베이스 연동
        // }
        // if (this.props.introSlider !== 'seen') {   //처음 앱을 켰을 경우 보여지는 intro , state 는 redux에 저장 되어 있습니다.
        if(store.getState().user.useLock == "Y"){
            this.props.navigation.navigate("LockScreen",{mode:1,type:'confirm',success : this.goMain,start : true})
        }else {
            this.props.navigation.navigate('LoginScreen');
        }
        // }
        // } else {
        // 파이어 베이스 연동 후 자격증명

        
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            const fcmToken = await messaging().getToken();
            console.log('Your Firebase Token is:', fcmToken);


            // Handling new messages with the app active
            // messaging().onMessage(async (remoteMessage) => {
            //     const data =
            //         Object.keys(remoteMessage.data).length !== 0
            //             ? remoteMessage.data
            //             : remoteMessage;
            //     Alert.alert(data.notification.title, data.notification.body);
            // });
        }
        // this.props.navigation.navigate(
        //     this.props.token !== '' ? 'Main' : 'LoginScreen',
        // );
    }
    goMain=()=>{
        this.props.navigation.navigate('LoginScreen');
    }
    render() {
        return <LoadingScreen />;
    }
}
const mapStateToProps = (state) => {
    return {
        introSlider: state.config.introSlider,
        token: state.user.token,
    };
};

export default connect(mapStateToProps)(SplashScreen);
