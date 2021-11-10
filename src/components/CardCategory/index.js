import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import CacheImageBackground from '../CacheImageBackground';
import { Color, Styles, FontSize } from '@common';

export default class CardCategory extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        const { categoryItem } = this.props;
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.7}
            >
                <CacheImageBackground
                    source={{ uri: categoryItem.img }}
                    style={styles.imageView}>
                    <View style={styles.overlay}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
                            {categoryItem.category}
                        </Text>
                        <Text style={styles.subtitle}>{categoryItem.amount} Places</Text>
                    </View>
                </CacheImageBackground>
            </TouchableOpacity>
        );
    }
}

CardCategory.propTypes = {
    categoryItem: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
        paddingVertical: 10,
        minHeight: Platform.isPad ? Styles.width * 0.25 : Styles.width * 0.45,
        width: 130,
        marginLeft: Styles.width * 0.05,
        marginBottom: 10,
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
    },
    subtitle: {
        fontSize: FontSize.large,
        fontWeight: '300',
        color: Color.background,
    },
});
