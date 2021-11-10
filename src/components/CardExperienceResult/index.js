import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CacheImageBackground from '../CacheImageBackground';
import ButtonBookmark from '../ButtonBookmark';
import { Color } from '@common';

export default class CardExperienceResult extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.7}
            >
                <View style={styles.imageContainer}>
                    <CacheImageBackground
                        source={{ uri: this.props.experience.img }}
                        style={styles.image}>
                        {/* Bookmark button */}
                        <ButtonBookmark experienceId={this.props.experience.id} />
                    </CacheImageBackground>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.categories}>
                        {this.props.experience.categories.join(', ')}
                    </Text>
                    <Text
                        style={[
                            styles.cardName,
                            this.props.experience.name.length > 45 ? styles.longName : null,
                        ]}>
                        {this.props.experience.name}
                    </Text>
                    <Text style={styles.subtitle}>
                        ${this.props.experience.rate_per_person} per person,{' '}
                        {this.props.experience.duration}
                    </Text>
                    <Text style={styles.subtitle}>{this.props.experience.include}</Text>
                    <View style={styles.raintingContent}>
                        <Icon name="star" style={styles.raiting} />
                        <Text style={styles.raiting}> {this.props.experience.raiting}</Text>
                        <Text style={styles.subtitle}>
                            {' '}
              ({this.props.experience.raiting_count})
            </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

CardExperienceResult.propTypes = {
    experience: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 7.62,
        elevation: 4,
        flexDirection: 'row',
        borderRadius: 15,
        padding: 10,
        backgroundColor: Color.background,
        marginLeft: 30,
        alignItems: 'center',
        marginBottom: 25,
    },
    imageContainer: {
        width: '40%',
        borderRadius: 15,
        overflow: 'hidden',
        marginLeft: -40,
        maxHeight: 170,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 15,
    },
    raintingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    cardName: {
        fontSize: 20,
        color: Color.text,
        fontWeight: 'bold',
        paddingRight: 10,
    },
    longName: {
        fontSize: 17,
    },
    raiting: {
        color: Color.primary,
        fontWeight: 'bold',
    },
    categories: {
        color: Color.text,
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 2,
        textTransform: 'uppercase',
    },
    subtitle: {
        color: Color.text,
        fontSize: 12,
        marginVertical: 2,
    },
});
