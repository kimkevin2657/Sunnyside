import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import CacheImageBackground from '../CacheImageBackground';
import {Color, Styles} from '@common';

export default class CardTripItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  openDetails = () => {
    this.props.navigation.navigate('MyTripDetailsScreen', {
      trip: {
        experience: this.props.experience,
        totalPaid: this.props.totalPaid,
        guests: this.props.guests,
        date: this.props.date,
        completed: this.props.completed,
      },
    });
  };

  render() {
    const {experience, date} = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.7}
        onPress={this.openDetails}>
        <CacheImageBackground
          source={{uri: experience.img}}
          style={styles.imageView}
          imageStyle={styles.image}
        />
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.date}>
              {moment(date).format('MMM DD, YYYY')}
            </Text>
            <Text style={styles.title}>{experience.name}</Text>
            <Text style={styles.location}>{experience.location}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="right" style={styles.iconRight} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

CardTripItem.propTypes = {
  id: PropTypes.string,
  totalPaid: PropTypes.number,
  guests: PropTypes.number,
  date: PropTypes.string,
  experience: PropTypes.object,
  completed: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: Color.background,
    shadowColor: Color.text,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 18,
  },
  imageView: {
    height: Styles.height * 0.16,
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  title: {
    fontSize: 18,
    color: Color.text,
    fontWeight: 'bold',
  },
  date: {
    color: Color.blackTextSecondary,
    fontSize: 12,
    fontWeight: '400',
    marginTop: 7,
    marginBottom: 3,
  },
  location: {
    color: Color.text,
    fontSize: 16,
    marginVertical: 3,
  },
  iconContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconRight: {
    color: Color.text,
    fontSize: 12,
  },
});
