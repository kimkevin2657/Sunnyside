import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Color, FontSize} from '@common';

export default class ButtonToggle extends React.PureComponent {
  render() {
    let {text, onPress, style, icon, disabled} = this.props;

    return (
      <TouchableOpacity
        disabled={disabled}
        style={[
          style,
          styles.container,
          this.props.hasSelected ? styles.selected : styles.unselected,
        ]}
        activeOpacity={0.7}
        onPress={onPress}>
        {icon && (
          <Icon
            name={icon}
            style={disabled ? styles.disableIcon : styles.regularIcon}
          />
        )}
        {text && (
          <Text style={disabled ? styles.disableText : styles.regularText}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    flexDirection: 'row',
    padding: 5,
    marginRight: 7,
  },
  selected: {
    backgroundColor: '#f3f6f6',
    borderColor: '#909292',
  },
  unselected: {
    backgroundColor: 'transparent',
    borderColor: '#e3e3e3',
  },
  regularText: {
    fontWeight: '500',
    textAlign: 'center',
    color: Color.text,
  },
  disableText: {
    fontWeight: '500',
    textAlign: 'center',
    color: Color.textDisabled,
  },
  regularIcon: {
    color: Color.text,
    fontSize: FontSize.large,
  },
  disableIcon: {
    color: Color.textDisabled,
    fontSize: FontSize.large,
  },
});
