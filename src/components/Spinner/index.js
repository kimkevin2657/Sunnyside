import React from 'react';
import {View, ActivityIndicator, Dimensions, StyleSheet} from 'react-native';
import Color from '../../common/Color';

const {width, height} = Dimensions.get('window');
const SIZES = {SMALL: 'small', LARGE: 'large'};
export const Mode = {normal: 'normal', full: 'full', overlay: 'overlay'};

class Spinner extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {size, color, mode} = this.props;

    let containerStyle = styles.container;
    switch (mode) {
      case Mode.full:
        containerStyle = styles.container_full_stretch;
        break;
      case Mode.overlay:
        containerStyle = styles.container_overlay;
        break;
    }
    return (
      <View style={[containerStyle, this.props.containerStyle]}>
        <ActivityIndicator
          size={size}
          color={color}
          style={[
            styles.wrapper,
            // eslint-disable-next-line react-native/no-inline-styles
            {borderRadius: size === SIZES.SMALL ? 10 : 20},
            this.props.style,
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: null,
    width: null,
  },
  container_full_stretch: {
    flexGrow: 1,
    height: null,
    width: null,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    zIndex: 100,
  },
});

Spinner.defaultProps = {
  color: Color.text,
  size: 'large',
  mode: Mode.normal,
  style: {},
};

export default Spinner;
