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
import {connect} from 'react-redux';
import {setUser} from '@redux/actions/user';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class SignUpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      email: '',
      password: '',
      isLoading: false,
      errorMsg: ' ',
    };
  }

  onUserNameHandle = (userName) => this.setState({userName});

  onEmailHandle = (email) => this.setState({email});

  onPasswordHandle = (password) => this.setState({password});

  handleSignUp = () => {
    if (this.state.userName.trim() === '') {
      this.setState({
        isLoading: false,
        errorMsg: 'You must include your name',
      });
      return;
    }
    if (!Util.isValidEmail(this.state.email)) {
      this.setState({
        isLoading: false,
        errorMsg: 'Invalid email address',
      });
      return;
    }
    if (this.state.password === '') {
      this.setState({
        isLoading: false,
        errorMsg: 'You must include a password',
      });
      return;
    }

    this.setState({isLoading: true}, () => {
      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((userCredentials) => {
          database()
            .ref(`users/${userCredentials.user.uid}`)
            .set({
              uid: userCredentials.user.uid,
              email: userCredentials.user.email,
              userName: this.state.userName,
            })
            .then(() => {
              this.props.setUser({
                uid: userCredentials.user.uid,
                userName: this.state.userName,
                email: userCredentials.user.email,
                token: userCredentials.user.email,
              });
              this.setState({
                userName: '',
                email: '',
                password: '',
                isLoading: false,
                errorMsg: ' ',
              });
              this.props.navigation.navigate('Main');
            })
            .catch((e) => {
              this.setState({
                isLoading: false,
                errorMsg: e.message,
              });
            });
        })
        .catch((e) => {
          this.setState({
            isLoading: false,
            errorMsg: e.message,
          });
        });
    });
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
              <Text style={styles.title}>Sign Up</Text>
              <View>
                <Text style={styles.subTitle}>
                  Enter your email to reset your password
                </Text>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'android' ? null : 'padding'}>
                  <TextBox
                    value={this.state.userName}
                    placeholder="Name"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.secondTextInput.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText={this.onUserNameHandle}
                  />
                  <View style={styles.space} />
                  <TextBox
                    value={this.state.email}
                    autoCapitalize={'none'}
                    placeholder="Email Address"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onRef={(input) => {
                      this.secondTextInput = input;
                    }}
                    onSubmitEditing={() => {
                      this.thirdTextInput.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText={this.onEmailHandle}
                  />
                  <View style={styles.space} />
                  <TextBox
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={this.onPasswordHandle}
                    returnKeyType="send"
                    onRef={(input) => {
                      this.thirdTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={this.onLoginPressHandle}
                  />
                  <Text style={styles.error}>{this.state.errorMsg}</Text>
                  <ButtonGradient
                    text="SIGN UP"
                    fullWidth
                    disabled={this.state.isLoading}
                    containerStyle={styles.loginButton}
                    onPress={this.handleSignUp}
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
  space: {
    marginBottom: 20,
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
  resetPassword: {
    color: Color.blackTextSecondary,
  },
  highlight: {
    fontWeight: 'bold',
    color: Color.primary,
  },
});

const mapDispatchToProps = {
  setUser,
};

export default connect(null, mapDispatchToProps)(SignUpScreen);
