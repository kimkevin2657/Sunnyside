import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Color, FontSize} from '@common';
import Icon from 'react-native-vector-icons/AntDesign';
import {addBookmark, deleteBookmark} from '@redux/actions/bookmarks';
import {connect} from 'react-redux';

class ButtonBookmark extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  addBookmark = () => {
    const experience = this.props.experiences.find(
      (e) => e.id === this.props.experienceId,
    );
    this.props.addBookmark(experience);
  };

  removeBookmark = () => {
    if (this.props.confirm) {
      this.confirmRemoveBookmark();
    } else {
      this.props.deleteBookmark(this.props.experienceId);
    }
  };

  confirmRemoveBookmark = () => {
    Alert.alert(
      'Remove Listing',
      `Are you sure you want to remove "${this.props.name}" from saved?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            this.props.deleteBookmark(this.props.experienceId);
          },
        },
      ],
      {cancelable: true},
    );
  };

  render() {
    const booked = this.props.bookmarks.some(
      (b) => b.id === this.props.experienceId,
    );
    return (
      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.7}
        onPress={booked ? this.removeBookmark : this.addBookmark}>
        <Icon
          name={booked ? 'heart' : 'hearto'}
          color={booked ? Color.heart : Color.background}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  }
}

ButtonBookmark.propTypes = {
  experienceId: PropTypes.number,
};

const styles = StyleSheet.create({
  content: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    padding: 8,
  },
  icon: {
    fontSize: FontSize.xLarge,
  },
});

const mapStateToProps = (state) => {
  return {
    bookmarks: state.bookmarks,
    experiences: state.explore.experienceResults.experiences,
  };
};

const mapDispatchToProps = {
  addBookmark,
  deleteBookmark,
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonBookmark);
