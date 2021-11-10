import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import CacheImage from '../CacheImage';
import PropTypes from 'prop-types';

export default class ImageCollage extends React.PureComponent {
  renderMatrix() {
    const {matrix, direction} = this.props;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sectionDirection = direction === 'row' ? 'column' : 'row';

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;
      const images = this.props.images
        .slice(startIndex, startIndex + element)
        .map((image, i) => {
          const source = !Number.isInteger(image)
            ? {uri: image}
            : Image.resolveAssetSource(image);
          return (
            <TouchableOpacity
              key={i}
              style={styles.touchContainer}
              activeOpacity={0.7}
              onPress={() => this.props.onPressImage(source)}>
              <CacheImage source={source} style={styles.image} />
            </TouchableOpacity>
          );
        });

      return (
        <View
          key={m}
          style={[styles.container, {flexDirection: sectionDirection}]}>
          {images}
        </View>
      );
    });
  }

  render() {
    const {width, height, direction, containerStyle} = this.props;
    return (
      <View style={[{width, height}, styles.borderless, containerStyle]}>
        <View style={[styles.matrixContainer, {flexDirection: direction}]}>
          {this.renderMatrix()}
        </View>
      </View>
    );
  }
}

ImageCollage.defaultProps = {
  direction: 'row',
  width: 400,
  height: 400,
};

ImageCollage.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  images: PropTypes.array,
  matrix: PropTypes.array,
  direction: PropTypes.oneOf(['row', 'column']),
  onPressImage: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
  touchContainer: {
    flex: 1,
    marginTop: 2,
    marginRight: 2,
  },
  image: {flex: 1},
  borderless: {
    borderWidth: 0,
  },
  matrixContainer: {
    flex: 1,
  },
});
