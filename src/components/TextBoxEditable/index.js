import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ButtonToggle from '../ButtonToggle';
import Icon from 'react-native-vector-icons/AntDesign';
import {Color} from '@common';

export default class TextBoxEditable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      text: this.props.text,
    };
  }

  toogleEdit = () => {
    this.setState({editing: !this.state.editing}, () => {
      if (this.state.editing) {
        this.refEmail.focus();
      } else if (this.state.text.trim() !== '') {
        this.props.onEditCompleted(this.state.text.trim());
      } else {
        this.setState({text: this.props.text});
      }
    });
  };

  cancelEdit = () => {
    this.setState({editing: false, text: this.props.text});
  };

  handleTextChange = (text) => {
    this.setState({text});
  };

  render() {
    let {
      readonly,
      description,
      placeholder,
      keyboardType,
      returnKeyType,
    } = this.props;

    return (
      <View>
        <View style={styles.container}>
          {description && <Text style={styles.description}>{description}</Text>}
          {!this.state.editing ? (
            <>
              {readonly ? (
                <Text style={styles.labelValue}>{this.state.text}</Text>
              ) : (
                <TouchableOpacity
                  onPress={this.toogleEdit}
                  style={styles.btnEditContainer}>
                  <Text style={styles.labelValue}>{this.state.text}</Text>
                  <Icon name="edit" style={styles.inputIcon} />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.inputWrap}>
              <TextInput
                value={this.state.text}
                style={styles.input}
                placeholder={placeholder || description || ''}
                placeholderTextColor={Color.textBorderColor}
                ref={(input) => {
                  this.refEmail = input;
                }}
                keyboardType={keyboardType || 'default'}
                returnKeyType={returnKeyType || 'next'}
                onChangeText={this.handleTextChange}
                onSubmitEditing={this.toogleEdit}
                underlineColorAndroid="transparent"
                blurOnSubmit={false}
              />
              <View style={styles.actions}>
                <ButtonToggle text="Save" onPress={this.toogleEdit} />
                <TouchableOpacity
                  style={styles.cancelAction}
                  onPress={this.cancelEdit}>
                  <Icon name="closecircle" style={styles.clearIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 14,
    color: Color.text,
    marginBottom: 3,
  },
  btnEditContainer: {
    flexDirection: 'row',
  },
  labelValue: {
    fontSize: 20,
    color: Color.black,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.textBackgroundColor,
    padding: 20,
    flex: 1,
    borderRadius: 5,
    height: 40,
  },
  inputIcon: {
    color: Color.text,
    height: 20,
    marginTop: 3,
    marginLeft: 5,
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
  actions: {
    flexDirection: 'row',
    height: 30,
    marginRight: -15,
  },
  cancelAction: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    color: Color.grayIcon,
    height: 16,
    fontSize: 16,
  },
});
