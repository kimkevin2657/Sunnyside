import React from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Color, Styles, FontSize, Util} from '@common';
import {ButtonGradient, Spinner, TextBox} from '@components';
import auth from '@react-native-firebase/auth';

export default class ResetPasswordScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reset: false,
      email: '',
      isLoading: false,
      errorMsg: ' ',
    };
  }

  onEmailHandle = (email) => this.setState({email});

  handleReset = async () => {
    if (Util.isValidEmail(this.state.email)) {
      this.setState({isLoading: true}, async () => {
        try {
          await auth().sendPasswordResetEmail(this.state.email);
          this.setState({
            isLoading: false,
            reset: true,
            errorMsg: ' ',
          });
        } catch (e) {
          this.setState({
            isLoading: false,
            errorMsg: e.message,
          });
        }
      });
    } else {
      this.setState({
        isLoading: false,
        errorMsg: 'Invalid email address',
      });
    }
  };

  backToLogin = () => {
    this.props.navigation.navigate('LoginScreen');
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.wrap}>
            <View style={styles.subContain}>
              <Text style={styles.title}>Reset Password</Text>
              {this.state.reset ? (
                <View style={styles.resetedContainer}>
                  <Text style={styles.subTitle}>
                    Check your Inbox, instructions for resetting your password
                    have been sent.
                  </Text>
                  <TouchableOpacity
                    style={Styles.ColumnCenter}
                    onPress={this.backToLogin}>
                    <Text style={styles.resetPassword}>
                      Back to <Text style={styles.highlight}>SIGN IN</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={styles.subTitle}>
                    Enter your email to reset your password
                  </Text>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? null : 'padding'}>
                    <TextBox
                      value={this.state.email}
                      placeholder="Email Address"
                      keyboardType="email-address"
                      onChangeText={this.onEmailHandle}
                      onSubmitEditing={this.handleReset}
                    />
                    <Text style={styles.error}>{this.state.errorMsg}</Text>
                    <ButtonGradient
                      text="RESET PASSWORD"
                      fullWidth
                      disabled={this.state.isLoading}
                      containerStyle={styles.loginButton}
                      onPress={this.handleReset}
                    />
                  </KeyboardAvoidingView>
                  <TouchableOpacity
                    style={Styles.ColumnCenter}
                    onPress={this.backToLogin}>
                    <Text style={styles.resetPassword}>
                      Back to <Text style={styles.highlight}>SIGN IN</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  wrap: {
    width: Platform.isPad ? 400 : null,
  },
  subContain: {
    paddingHorizontal: Platform.isPad ? null : Styles.width * 0.1,
    marginTop: 60,
  },
  error: {
    marginTop: 10,
    color: Color.error,
  },
  loginButton: {
    marginVertical: 30,
  },
  title: {
    fontWeight: 'bold',
    color: Color.primary,
    fontSize: FontSize.xMidLarge,
  },
  subTitle: {
    color: Color.blackTextSecondary,
    marginTop: 10,
    marginBottom: 40,
  },
  resetedContainer: {
    marginTop: 50,
  },
  resetPassword: {
    color: Color.blackTextSecondary,
  },
  highlight: {
    fontWeight: 'bold',
    color: Color.primary,
  },
});
