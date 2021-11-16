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

CardCategory.propTypes = {
    title: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        minHeight: Platform.isPad ? Styles.width * 0.25 : Styles.width * 0.45,
        width: 130,
        marginLeft: Styles.width * 0.05,
        marginBottom: 10,
        borderLeftColor: Color.leadColor,
        borderWidth: 3,
    },
    imageView: {
        borderRadius: 6,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    overlay: {
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: FontSize.xMidLarge,
        fontWeight: '500',
        color: Color.background,
        marginLeft: 30,
    },
    subtitle: {
        fontSize: FontSize.large,
        fontWeight: '300',
        color: Color.background,
    },
});
