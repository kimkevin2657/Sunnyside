import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Color} from '@common';

export default class TextBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: this.props.secureTextEntry || false,
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  handleShowPassword = () => {
    this.setState({showPassword: false});
  };

  handleHidePassword = () => {
    this.setState({showPassword: true});
  };

  focus() {
    this.textInput.focus();
  }

  render() {
    let {
      value,
      autoCapitalize,
      placeholder,
      keyboardType,
      returnKeyType,
      onChangeText,
      onSubmitEditing,
      blurOnSubmit,
      multiline
    } = this.props;

    return (
      <View style={[styles.inputWrap, this.props.containerStyle]}>
        {this.props.icon && (
          <Icon name={this.props.icon} style={styles.inputIcon} />
        )}
        <TextInput
          value={value}
          autoCapitalize={autoCapitalize || 'sentences'}
          style={[styles.input, this.props.textStyle]}
          placeholder={placeholder || ''}
          placeholderTextColor={Color.textBorderColor}
          secureTextEntry={this.state.showPassword}
          keyboardType={keyboardType || 'default'}
          returnKeyType={returnKeyType || 'next'}
          ref={(input) => (this.textInput = input)}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          underlineColorAndroid="transparent"
          blurOnSubmit={this.props.blurOnSubmit || true}
          multiline={multiline || false}
        />
        {this.props.secureTextEntry && (
          <TouchableOpacity
            style={styles.rigthAction}
            onPressIn={this.handleShowPassword}
            onPressOut={this.handleHidePassword}>
            <Icon name="eyeo" style={styles.rigthIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.textBackgroundColor,
    padding: 20,
    flex: 1,
    borderRadius: 5,
    height: 40,
    borderColor: '#FCFCFC',
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
    // backgroundColor: 'transparent',
  },
  inputIcon: {
    color: Color.text,
    height: 20,
    marginTop: 3,
    marginRight: 10,
    fontSize: 18,
  },
  input: {
    color: Color.text,
    borderColor: Color.textBorderColor,
    height: 40,
    marginTop: 10,
    paddingTop: 0,
    paddingBottom: 8,
    textAlign: 'left',
    flex: 1,
  },
  rigthAction: {
    marginRight: -10,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rigthIcon: {
    color: Color.text,
    fontSize: 20,
  },
});
