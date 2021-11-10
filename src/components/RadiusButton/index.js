import React from 'react';
import { TouchableOpacity, Platform, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '@common';

export default class RadiusButton extends React.PureComponent {
    render() {
        const {
            text,
            onPress,
        } = this.props;
        
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.containerRegular}
                onPress={onPress}
            >
                <Text style={styles.regularText}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    containerRegular: {
        backgroundColor: '#1B2937',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: 52,
    },
    regularText: {
        fontSize: 16,
        textAlign: 'center',
        color: Color.white
    },
});
