import React from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import {createDrawerNavigator} from '../common/react-navigation-drawer';
import { createAppContainer,DrawerNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { TabBar, TabBarIcon } from '@components';
import HomeRoutes from './HomeRoutes';
import { Color } from '@common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomDrawerMenu from './CustomSidebarMenu'
import Wallet from '../screens/walletScreen/walletMain';
// import Product_ from '@screens/productScreen';
import MainNavigator from '@app/navigation/MainNavigator';

import Tabs from './Tabs'
const Drawer = createDrawerNavigator(
    {
      MainNavigator : {
          screen: MainNavigator,
          navigationOptions: {
            drawerLabel: 'MainNavigator',
          },
        },
        Wallet : {
          screen: Wallet,
          navigationOptions: {
            drawerLabel: 'Wallet',
          },
        },
      },
      {
        contentOptions: {
          activeTintColor: '#e91e63',
          itemsContainerStyle: {
            marginVertical: 0,
          },
          iconContainerStyle: {
            opacity: 1
          }
        },
        navigationOptions:{
          headerShown: false
        },
        drawerType:'front',
        drawerPosition : 'right',
        // hideStatusBar : true,
        contentComponent: ({navigation})=>(<CustomDrawerMenu navigation={navigation}></CustomDrawerMenu>),
        // drawerWidth: Dimensions.get('window').width - 150,
        // drawerType:'slide'
      },
);

export default Drawer;



