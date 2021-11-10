import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CacheImageBackground from '../CacheImageBackground';
import { Color, Styles } from '@common';

export default class CardPopular extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        let { popularItem } = this.props;
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.7}
            >
                <CacheImageBackground
                    source={{ uri: popularItem.img }}
                    style={styles.imageView}>
                    <View style={styles.overlay}>
                        <View style={styles.location}>
                            <Icon name="enviroment" style={styles.subtitleIcon} />
                            <Text style={styles.subtitle}>{popularItem.location}</Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text
                                adjustsFontSizeToFit
                                style={
                                    Platform.OS === 'ios' ? styles.titleIOS : styles.titleAndroid
                                }>
                                {popularItem.title}
                            </Text>
                        </View>
                    </View>
                </CacheImageBackground>
            </TouchableOpacity>
        );
    }
}

CardPopular.propTypes = {
    popularItem: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
        paddingVertical: 10,
        minHeight: Platform.isPad ? Styles.height * 0.45 : Styles.height * 0.45,
        width: Platform.isPad ? Styles.width * 0.4 : Styles.width * 0.6,
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
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'space-between',
    },
    titleContainer: {
        padding: 10,
    },
    titleIOS: {
        fontSize: 42,
        fontWeight: '200',
        color: Color.background,
    },
    titleAndroid: {
        fontSize: 35,
        color: Color.background,
        fontFamily: 'sans-serif-thin',
    },
    location: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    subtitleIcon: {
        fontSize: 16,
        color: Color.background,
        marginRight: 3,
        marginTop: 2,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: Color.background,
    },
});
