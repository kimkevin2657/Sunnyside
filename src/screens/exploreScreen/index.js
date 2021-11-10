import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import { Color } from '@common';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import SampleOne from './topTab1/sampleOne';
import SampleTwo from './topTab2/sampleTwo';

const ExploreScreen = createMaterialTopTabNavigator(
    {
        toptabOne: {
            screen: SampleOne,
            navigationOptions: {
                tabBarLabel: 'sampleTab1',
            },
        },
        toptabTwo: {
            screen: SampleTwo,
            navigationOptions: {
                tabBarLabel: 'sampleTab2',
            },
        },
    },
    {
        animationEnabled: true,
        swipeEnabled: true,
        tabBarOptions: {
            pressColor: Color.point,
            style: {
                backgroundColor: Color.gradientSecundary,
                elevation: 0,
                borderBottomWidth: 1,
                shadowOpacity: 0,
                borderBottomColor: Color.gradientSecundary
            },
            indicatorStyle: {
                backgroundColor: Color.gradientPrimary,
                height: '100%',
                zIndex: 999999999,
                borderBottomWidth: 5,
                borderBottomColor: Color.tabbarTint,
            },
            labelStyle: {
                fontSize: 15,
                lineHeight: 20,
                fontWeight: 'bold',

            },
            activeTintColor: Color.background,
            inactiveTintColor: Color.gray,
            showLabel: true,
            showIcon: false,
        },
    },
);


export default ExploreScreen;
