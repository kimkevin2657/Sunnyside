import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { Color } from '@common';
import { createStackNavigator } from 'react-navigation-stack';

import DepositMain from '../depositProduct/depositMain';
import DepositRegister from '../depositProduct/depositRegister';
import DepositComplete from '../depositProduct/depositComplete';

import IcoMain from '../ico/icoMain';
import IconRegister from '../ico/icoRegister';
import IcoComplete from '../ico/icoComplete';
import Terms from '../../agreeScreen/terms'

const _navigationOptions = ({ navigation }) => ({
    animationEnabled: false,
    headerShown: false,
});

const DepositRoute = createStackNavigator(
    {
        DepositMain: {
            screen: (props) => <DepositMain screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
        DepositRegister: {
            screen: (props) => <DepositRegister screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
        DepositComplete: {
            screen: (props) => <DepositComplete screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
        Terms: {
            screen: Terms,
            navigationOptions: _navigationOptions
        }
    },
    {
        initialRouteName: 'DepositMain',
        headerMode: 'float',
        mode: 'modal',
    },
)

const IcoRoute = createStackNavigator(
    {
        IcoMain: {
            screen: (props) => <IcoMain screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
        IconRegister: {
            screen: (props) => <IconRegister screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
        IcoComplete: {
            screen: (props) => <IcoComplete screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
        Terms: {
            screen: Terms,
            navigationOptions: _navigationOptions
        }
    },
    {
        initialRouteName: 'IcoMain',
        headerMode: 'float',
        mode: 'modal',
    },
)

const ProductTabs = createMaterialTopTabNavigator(
    {
        DepositRoute: {
            screen: DepositRoute,
            navigationOptions: {
                tabBarLabel: 'Deposit Account',
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    navigation.getScreenProps().goFirstPage();
                    navigation.replace('DepositMain');
                    defaultHandler()
                },
            },
        },
        IcoRoute: {
            screen: IcoRoute,
            navigationOptions: {
                tabBarLabel: 'ICO',
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    navigation.getScreenProps().goFirstPage();
                    navigation.replace('IcoMain');
                    defaultHandler()
                },
            },
        },
    },
    {
        animationEnabled: true,
        swipeEnabled: false,
        tabBarOptions: {
            style: {
                backgroundColor: Color.white,
                elevation: 0,
                borderBottomWidth: 1,
                borderColor: '#dddddd',
            },
            tabStyle: {
                height: 43,
                marginBottom: 5,
            },
            indicatorStyle: {
                backgroundColor: Color.black,
                height: 1.5,
            },
            labelStyle: {
                fontSize: 16,
            },
            activeTintColor: Color.black,
            inactiveTintColor: '#9A9A9A',
        },
    },
);

export default createAppContainer(ProductTabs);