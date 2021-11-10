import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from '@screens/splashScreen';
import IntroSliderScreen from '@screens/introSliderScreen';
import LoginScreen from '@screens/loginScreen';
import SignUpScreen from '@screens/signUpScreen';
import ResetPasswordScreen from '@screens/resetPasswordScreen';
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
        SignUpScreen: {
            screen: SignUpScreen,
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