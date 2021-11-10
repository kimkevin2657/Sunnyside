import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { Color } from '@common';
import { ButtonSecundary } from '@components';

class SampleOne extends React.PureComponent {

    render() {
        return (
            <View style={styles.mainContainer}>
                <Text> React-native Sample</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: Color.background,
    },

});



export default SampleOne;
