import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { Color } from '@common';
import { createStackNavigator } from 'react-navigation-stack';

import HistoryProcess from '../HistoryProcess';
import HistoryCompleteMain from '../HistoryCompleteMain';

const _navigationOptions = ({ navigation }) => ({
    animationEnabled: false,
    headerShown: false,
});

const HistoryRoute = createStackNavigator(
    {
        HistoryProcess: {
            screen: (props) => <HistoryProcess screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
    },
    {
        initialRouteName: 'HistoryProcess',
        headerMode: 'float',
        mode: 'modal',
    },
)

const HistroyCompleteRoute = createStackNavigator(
    {
        HistoryCompleteMain: {
            screen: (props) => <HistoryCompleteMain screenProps = {props.screenProps} navigation={props.navigation}/>,
            navigationOptions: _navigationOptions
        },
    },
    {
        initialRouteName: 'HistoryCompleteMain',
        headerMode: 'float',
        mode: 'modal',
    },
)

const HistoryTabs = createMaterialTopTabNavigator(
    {
        HistoryRoute: {
            screen: HistoryRoute,
            navigationOptions: {
                tabBarLabel: 'Saving in progress',
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    navigation.getScreenProps().goFirstPage();
                    navigation.replace('HistoryProcess');
                    defaultHandler()
                },
            },
        },
        HistroyCompleteRoute: {
            screen: HistroyCompleteRoute,
            navigationOptions: {
                tabBarLabel: 'Saving completed',
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    navigation.getScreenProps().goFirstPage();
                    navigation.replace('HistoryCompleteMain');
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
                fontSize: 13,
            },
            activeTintColor: Color.black,
            inactiveTintColor: '#9A9A9A',
        },
    },
);

export default createAppContainer(HistoryTabs);