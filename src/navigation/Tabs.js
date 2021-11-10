import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { TabBar, TabBarIcon } from '@components';
import { Color } from '@common';
import Explore_ from '@screens/exploreScreen';
import Bookmarks_ from '@screens/bookmarksScreen';
import MyTrips_ from '@screens/myTripsScreen';
import Profile_ from '@screens/profileScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

//yw
import Wallet_ from '../screens/walletScreen/walletMain';
// import Product_ from '@screens/productScreen
import WalletMain from '../screens/walletScreen/walletMain';
import WalletDetailMain from '../screens/walletScreen/walletDetail/walletDetailMain'
import WalletSend from '../screens/walletScreen/walletDetail/walletSend'
import AddCoin from '../screens/walletScreen/addCoin'
import WalletReceive from '../screens/walletScreen/walletDetail/walletReceive'
import emailCertification from '../screens/walletScreen/walletDetail/emailCertification'
import WalletSwap from '../screens/walletScreen/walletDetail/walletSwap'
import WalletSwapComplet from '../screens/walletScreen/walletDetail/walletSwapComplet'
import WalltePurchase from '../screens/walletScreen/walletDetail/walletPurchase'
import WalltePurchaseWaiting from '../screens/walletScreen/walletDetail/walletPurchaseWaiting'
import WalletTXID from '../screens/walletScreen/walletDetail/walletTXID'
import WalletPurchaseComplet from '../screens/walletScreen/walletDetail/walltePurchaseComplet'

//jw
import _Product from '../screens/productScreen/productMain'
import _History from '../screens/historyScreen/HistoryMain';
import MyPage from '../screens/myPageScreen/myPageMain';

const Wallet = createStackNavigator(
    {   
        WalletMain,
        WalletDetailMain,
        WalletSend,
        AddCoin,
        WalletReceive,
        emailCertification,
        WalletSwap,
        WalletSwapComplet,
        WalltePurchase,
        WalltePurchaseWaiting,
        WalletTXID,
        WalletPurchaseComplet
    },
    // { _Wallet },
    {
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon text="Wallet" icon="search1" tintColor={tintColor} />
            ),
        },
        defaultNavigationOptions: {
            headerShown: false,
        },
    },
);

const Product = createStackNavigator(
    // { Product_ },
    { 
        _Product,
        MyPage
    },
    {
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon text="Product" icon="ios-easel" tintColor={tintColor} />
            ),
        },
        defaultNavigationOptions: {
            headerShown: false,
        },
    },
);

const History = createStackNavigator(
    // { History_ },
    { 
        _History,
        MyPage
    },
    {
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon text="List" icon="person" tintColor={tintColor} />
            ),
        },
        defaultNavigationOptions: {
            headerShown: false,
        },
    },
);

const Tabs = createBottomTabNavigator(
    {
        Wallet,
        Product,
        History,
    },
    {
        tabBarComponent: TabBar,
        tabBarPosition: 'bottom',
        initialRouteName: 'Wallet',
        animationEnabled: true,
        lazy: true,
        navigationOptions: {
            headerShown: false,
        },
        tabBarOptions: {
            showIcon: true,
            showLabel: false,
            activeTintColor: Color.tabbarTint,
            inactiveTintColor: Color.tabbarColor,
        },
    },
);

Tabs.navigationOptions = () => {
    return {}
}

export default Tabs;
