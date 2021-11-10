import React from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Color, Styles} from '@common';

export default class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? null : 'padding'}>
        <View style={[styles.inputWrap, Styles.row]}>
          {this.props.actionIcon && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={this.props.onActionPress}>
              <Icon name={this.props.actionIcon} style={styles.inputIcon} />
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.input}
            placeholder={this.props.placeholder || ''}
            placeholderTextColor={Color.textBorderColor}
            keyboardType="web-search"
            underlineColorAndroid="transparent"
            onTouchStart={this.props.onPress || null}
            autoFocus={!this.props.onPress}
            onChangeText={this.props.onTextChange}
            onSubmitEditing={this.props.onSubmitEditing}
            value={this.props.searchText}
            maxLength={250}
          />
          {this.props.canClear &&
            this.props.searchText !== undefined &&
            this.props.searchText !== '' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={this.props.onClearSearch}>
                <Icon name="closecircle" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

SearchBar.propTypes = {
  searchText: PropTypes.string,
  placeholder: PropTypes.string,
  actionIcon: PropTypes.string, // Left action button
  onActionPress: PropTypes.func, // Left action button
  onPress: PropTypes.func, // Text box action press
  onTextChange: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  canClear: PropTypes.bool,
  onClearSearch: PropTypes.func,
};

const styles = StyleSheet.create({
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Color.textBackgroundColor,
    paddingVertical: 20,
    borderRadius: 5,
  },
  actionBtn: {
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  inputIcon: {
    color: Color.text,
    height: 20,
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
  clearIcon: {
    color: Color.grayIcon,
    height: 16,
    fontSize: 16,
  },
});
