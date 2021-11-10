import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CacheImageBackground from '../CacheImageBackground';
import { Color, Styles } from '@common';

export default class CardTopExperience extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.7}
            >
                <View style={styles.titleRanking}>
                    <View>
                        <View style={styles.titleRanking}>
                            <Text style={styles.number}>{this.props.experience.top}</Text>
                            <Text style={styles.title}>{this.props.experience.name}</Text>
                        </View>
                        <View style={styles.raintingContent}>
                            <Icon name="star" style={styles.bold} />
                            <Text style={styles.bold}> {this.props.experience.raiting}</Text>
                            <Text style={styles.subtitle}>
                                {' '}
                ({this.props.experience.raiting_count})
              </Text>
                        </View>
                    </View>
                </View>
                <CacheImageBackground
                    source={{ uri: this.props.experience.img }}
                    style={styles.imageView}
                    imageStyle={styles.image}>
                    <Text style={styles.location}>{this.props.experience.location}</Text>
                </CacheImageBackground>
            </TouchableOpacity>
        );
    }
}

CardTopExperience.propTypes = {
    experience: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginBottom: 30,
    },
    titleRanking: {
        flexDirection: 'row',
        marginRight: 20,
    },
    imageView: {
        height: Styles.height * 0.18,
    },
    image: {
        borderRadius: 3,
    },
    number: {
        fontSize: 32,
        color: Color.yellow,
        fontWeight: 'bold',
    },
    raintingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    bold: {
        color: Color.text,
        fontWeight: 'bold',
    },
    subtitle: {
        color: Color.graySubtitle,
        fontSize: 12,
    },
    title: {
        fontSize: 22,
        color: Color.text,
        fontWeight: '500',
        paddingLeft: 10,
        paddingTop: 10,
    },
    location: {
        color: Color.background,
        fontSize: 14,
        fontWeight: '300',
        padding: 10,
        textTransform: 'uppercase',
    },
});
