import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CacheImageBackground from '../CacheImageBackground';
import ButtonBookmark from '../ButtonBookmark';
import { Color, Styles } from '@common';

export default class CardExperienceResultLarge extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.7}
            >
                <CacheImageBackground
                    source={{ uri: this.props.experience.img }}
                    style={styles.imageView}
                    imageStyle={styles.image}>
                    {/* Bookmark button */}
                    <ButtonBookmark
                        experienceId={this.props.experience.id}
                        confirm={this.props.bookmarkConfirm || false}
                        name={this.props.experience.name}
                    />
                </CacheImageBackground>
                <Text style={styles.categories}>
                    {this.props.experience.categories.join(', ')}
                </Text>
                <Text style={styles.title}>{this.props.experience.name}</Text>
                <Text style={styles.subtitle}>
                    ${this.props.experience.rate_per_person} per person •{' '}
                    {this.props.experience.duration}
                    {this.props.experience.include
                        ? ` • ${this.props.experience.include}`
                        : ''}
                </Text>
                <View style={styles.raintingContent}>
                    <Icon name="star" style={styles.raiting} />
                    <Text style={styles.raiting}> {this.props.experience.raiting}</Text>
                    <Text style={styles.subtitle}>
                        {' '}
            ({this.props.experience.raiting_count})
          </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

CardExperienceResultLarge.propTypes = {
    experience: PropTypes.object,
    bookmarkConfirm: PropTypes.bool,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingVertical: 10,
        marginBottom: 10,
    },
    imageView: {
        height: Styles.height * 0.15,
    },
    image: {
        borderRadius: 3,
    },
    title: {
        fontSize: 16,
        color: Color.text,
        fontWeight: 'bold',
    },
    categories: {
        color: Color.text,
        fontSize: 12,
        fontWeight: '500',
        marginTop: 7,
        marginBottom: 3,
        textTransform: 'uppercase',
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
