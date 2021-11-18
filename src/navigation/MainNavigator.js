import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from '@screens/splashScreen';
import IntroSliderScreen from '@screens/introSliderScreen';
import LoginScreen from '@screens/loginScreen';
import TermsScreen from '@screens/termsScreen';
import SignUpScreen from '@screens/signUpScreen';
import SignUpDoneScreen from '@screens/signUpDoneScreen';
import ResetPasswordScreen from '@screens/resetPasswordScreen';
import CounselScreen from '@screens/counselScreen';
import ModalRoutes from './ModalRoutes';

const MainNavigator = createStackNavigator(
    {
        SplashScreen: {
            screen: SplashScreen,
            navigationOptions: {
                headerShown: false,
                gestureEnabled: false,
            },
        },
        IntroSliderScreen: {
            screen: IntroSliderScreen,
            navigationOptions: {
                headerShown: false,
                gestureEnabled: false,
            },
        },
        LoginScreen: {
            screen: LoginScreen,
            navigationOptions: {
                headerShown: false,
                gestureEnabled: false,
            },
        },
        TermsScreen: {
            screen: TermsScreen,
            navigationOptions: {
                headerShown: false,
                gestureEnabled: false,
            },
        },
        SignUpScreen: {
            screen: SignUpScreen,
            navigationOptions: {
                headerShown: false,
            },
        },
        SignUpDoneScreen: {
            screen: SignUpDoneScreen,
            navigationOptions: {
                headerShown: false,
            },
        },
        CounselScreen: {
            screen: CounselScreen,
            navigationOptions: {
                headerShown: false,
            },
        },
        ResetPasswordScreen: {
            screen: ResetPasswordScreen,
            navigationOptions: {
                headerShown: false,
            },
        },
        Main: {
            screen: ModalRoutes,
            navigationOptions: {
                headerShown: false,
                gestureEnabled: false,
            },
        },
    },
    {
        initialRouteName: 'SplashScreen',
    },
);

export default MainNavigator;
