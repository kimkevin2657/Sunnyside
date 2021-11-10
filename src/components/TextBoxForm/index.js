import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {Color} from '@common';

export default class TextBoxForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  render() {
    let {
      value,
      error,
      placeholder,
      keyboardType,
      maxLength,
      returnKeyType,
      onChangeText,
    } = this.props;

    return (
      <View
        style={[
          styles.inputWrap,
          !error ? styles.inputRegular : styles.inputError,
        ]}>
        <Text style={!error ? styles.placeholder : styles.placeholderError}>
          {placeholder}
        </Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={onChangeText}
          returnKeyType={returnKeyType || 'next'}
          value={value}
          keyboardType={keyboardType || 'default'}
          maxLength={maxLength || 550}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputWrap: {
    width: '100%',
    alignItems: 'flex-start',
    borderBottomWidth: 2.5,
  },
  inputRegular: {
    borderBottomColor: Color.textUnderLine,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  placeholder: {
    color: Color.textBorderColor,
  },
  placeholderError: {
    color: 'red',
  },
  input: {
    color: Color.text,
    borderColor: '#9B9B9B',
    width: '100%',
    paddingVertical: 5,
    fontSize: 20,
  },
});
