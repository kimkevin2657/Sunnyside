
import React from 'react';
import { AppState, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@redux/store';
import MainNavigator from '@app/navigation/MainNavigator';
import NavigationService from '@app/navigation/NavigationService';
import LoadingScreen from '@screens/loadingScreen';
import SplashScreen from 'react-native-splash-screen';
import Drawer from '@app/navigation/Drawer'
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';


import {
    StyleSheet,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const AppContainer = createAppContainer(Drawer);

class App extends React.Component {
    async componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        // Disabling warning messages box
        console.disableYellowBox = true;
        YellowBox.ignoreWarnings(['Warning:']);
        // Hiding the React Native SplashScreen
        SplashScreen.hide();
        console.log('after addEventListener')
    // }
    
        console.log('before did mount')
        console.log(Platform.OS)
        if (Platform.OS === 'android') {
            console.log('did and mount')
            dynamicLinks().getInitialLink().then(response => {
                if(response.url != null) {
                    // var linkData = (response.url).replace('https://eeumpay.page.link/?', '').split('&')
                    // var linkIdx;
                    // linkData.map((value, index) => {
                    //     var splitKeyValue = value.split('=')
                    //     if (index == 0) {
                    //         linkIdx = splitKeyValue[1]
                    //     }
                    // })
                    console.log("data get")
                    NavigationService.push('WalletMain');
                } else {
                    console.log("else data get")
                    NavigationService.push('WalletMain');
                }
                
            })
        } else {
            console.log('did ios mount')
            // Linking.getInitialURL().then(res => {
            //         dynamicLinks().resolveLink(res).then(response => {
            //             console.log('response from didmount'+response);
            //             // var linkData = (response.url).replace('https://eeumpay.page.link/?', '').split('&')
            //             // var linkIdx;
            //             // linkData.map((value, index) => {
            //             //     var splitKeyValue = value.split('=')
            //             //     if (index == 0) {
            //             //         linkIdx = splitKeyValue[1]
            //             //     }
            //             // })
            //             console.log("click push data")
            //             NavigationService.navigate('WalletMain');
            //         })
            //     })
        }
        console.log('after did mount')
        //푸시 설정
        //앱 켜져있을때
        messaging().onMessage(async (remoteMessage) => {
            console.log('onMessage from data:',remoteMessage);
            // if(remoteMessage.data != {}) {
            //     var linkIdx = remoteMessage.data.idx;
            //     NavigationService.navigate('PurchaseProductPaymentScreen', { idx: linkIdx });
            // }
        });
        //앱 비활성일때
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('setBackgroundMessageHandler from data:',remoteMessage);
            // if(remoteMessage.data != {}) {
            //     var linkIdx = remoteMessage.data.idx;
            //     NavigationService.navigate('PurchaseProductPaymentScreen', { idx: linkIdx });
            // }
        });
        //앱 켜져있을때
        messaging().onNotificationOpenedApp(async (remoteMessage) => {
            console.log('onNotificationOpenedApp from data:',remoteMessage);
            // if(remoteMessage.data != {}) {
            //     var linkIdx = remoteMessage.data.idx;
            //     NavigationService.navigate('PurchaseProductPaymentScreen', { idx: linkIdx });
            // }
        });
        //앱이 꺼져있을때
        messaging().getInitialNotification()(async (remoteMessage) => {
            console.log('getInitialNotification from data:',remoteMessage);
            if(remoteMessage.data != {}) {
                // var linkIdx = remoteMessage.data.idx;
                NavigationService.push('WalletMain');

            }
        });
        //푸시 설정 끝
    }

    componentWillUnmount() {
        console.log('unmiount')
        // Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = async event => {
        console.log('event::::::',event.url)
        console.log('current state ::',AppState.currentState )
        if (AppState.currentState == 'background' ||AppState.currentState == 'unknown') {
            dynamicLinks().resolveLink(event.url).then(response => {
                // var linkData = (response.url).replace('https://eeumpay.page.link/?', '').split('&')
                // var linkIdx;
                // linkData.map((value, index) => {
                //     var splitKeyValue = value.split('=')
                //     if (index == 0) {
                //         linkIdx = splitKeyValue[1]
                //     }
                // })
                console.log("push on")
                // NavigationService.navigate('PurchaseProductPaymentScreen', { idx: linkIdx });
            })
        } 
    }


    handleAppStateChange = nextAppState => {
        if (AppState.currentState == 'background' || AppState.currentState == 'unknown') {
          if(store.getState().user.useLock == "Y"){
              console.log("locked!!!!")
            NavigationService.navigate("LockScreen",{mode:1,type:'confirm',background : true})
          }
        }
      };
    

    render() {
        return (
            <Provider store={store}>
                <SafeAreaView style={{ flexGrow: 1, backgroundColor:"#1B2937"}}>
                    <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                        <AppContainer
                            ref={(navigatorRef) => {
                                NavigationService.setTopLevelNavigator(navigatorRef);
                            }}
                        />
                    </PersistGate>
                </SafeAreaView>
            </Provider>
        );
    }
}

export default App;


