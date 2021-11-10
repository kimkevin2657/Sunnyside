import React from 'react';
import {Modal, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Color} from '@common';
import Icon from 'react-native-vector-icons/AntDesign';

export default class ModalImageViewer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const imageSource = this.props.images.map((img) => {
      return {url: img};
    });

    return (
      <Modal
        animationType="fade"
        presentationStyle="fullScreen"
        transparent={false}
        visible={this.props.show}>
        <TouchableOpacity onPress={this.props.onClose} style={styles.closeBtn}>
          <Icon name="close" style={styles.closeIcon} />
        </TouchableOpacity>
        <ImageViewer
          imageUrls={imageSource}
          index={this.props.index}
          enableSwipeDown={true}
          onSwipeDown={this.props.onClose}
          enablePreload={true}
          menus={() => <React.Fragment />}
        />
      </Modal>
    );
  }
}

ModalImageViewer.propTypes = {
  show: PropTypes.bool,
  index: PropTypes.number,
  images: PropTypes.array,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  closeBtn: {
    alignSelf: 'flex-start',
    marginTop: 38,
    position: 'absolute',
    zIndex: 10,
  },
  closeIcon: {
    color: Color.background,
    fontSize: 25,
    padding: 10,
  },
});
