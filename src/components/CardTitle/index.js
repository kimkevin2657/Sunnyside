import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Color, Styles, FontSize } from '@common';

export default class CardTitle extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        const { title } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
            </View>
        );
    }
}

CardTitle.propTypes = {
    title: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 10,
        // minHeight: Platform.isPad ? Styles.width * 0.25 : Styles.width * 0.45,
        width: 130,
        // marginLeft: Styles.width * 0.05,
        marginBottom: 10,
        borderLeftColor: Color.leadColor,
        borderLeftWidth: 3,
    },
    title: {
        fontSize: FontSize.medium,
        fontWeight: '500',
        color: Color.black,
        marginLeft: 10,
    },
});
