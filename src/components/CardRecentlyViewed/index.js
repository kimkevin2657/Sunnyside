import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CacheImage from '../CacheImage';
import { Color, Styles } from '@common';

export default class CardCategory extends React.PureComponent {
    constructor(props) {
        super(props);
    }



    render() {
        const { experience } = this.props;
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.7}
            >
                <CacheImage source={{ uri: experience.img }} style={styles.imageView} />
                <Text style={styles.title}>{experience.name}</Text>
                <View style={styles.raintingContent}>
                    <Icon name="star" style={styles.raiting} />
                    <Text style={styles.raiting}> {experience.raiting}</Text>
                    <Text style={styles.subtitle}> ({experience.raiting_count})</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

CardCategory.propTypes = {
    experience: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Platform.isPad ? null : 10,
        width: 125,
        height: '100%',
        marginLeft: Styles.width * 0.05,
        marginBottom: 10,
    },
    imageView: {
        borderRadius: 6,
        width: '100%',
        height: 100,
        overflow: 'hidden',
    },
    title: {
        fontSize: 16,
        color: Color.text,
        fontWeight: 'bold',
        marginTop: 7,
        marginBottom: 3,
    },
    subtitle: {
        color: Color.text,
        fontSize: 12,
        marginVertical: 3,
    },
    raintingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    raiting: {
        color: Color.primary,
        fontWeight: 'bold',
    },
});
