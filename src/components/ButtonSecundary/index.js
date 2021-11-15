import React from 'react';
import {TouchableOpacity, Platform, Text, StyleSheet} from 'react-native';
import {Color} from '@common';

export default class ButtonSecundary extends React.PureComponent {
  render() {
    let {
      text,
      onPress,
      textStyle,
      containerStyle,
      disabled,
      fullWidth,
    } = this.props;

    let textColor;

    if (!disabled) {
      textColor = Color.text;
    } else {
      textColor = Color.textDisabled;
    }

    return (
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.container,
          fullWidth ? styles.fullWidth : null,
          containerStyle,
        ]}
        activeOpacity={0.7}
        onPress={onPress}>
        <React.Fragment>
          <Text style={[styles.text, {color: textColor}, textStyle]}>
            {text}
          </Text>
        </React.Fragment>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingHorizontal: 30,
    borderRadius: 8,
    borderColor: '#808080',
    borderWidth: 1,
    ...Platform.select({
      ios: {
          shadowColor: '#4d4d4d', 
          shadowOffset: {
              width: 0, 
              height: 6,
          }, 
          shadowRadius: 10,
          shadowOpacity: 1, 
      }, 
      android: {
          elevation: 3,
      }, 
    }),
  },
  fullWidth: {
    width: Platform.isPad ? 400 : '100%',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

ButtonSecundary.defaultProps = {
  text: '',
  containerStyle: {},
  textStyle: {},
  disabled: false,
  type: 'regular',
  fullWidth: false,
  paddingHorizontal: 30,
};
