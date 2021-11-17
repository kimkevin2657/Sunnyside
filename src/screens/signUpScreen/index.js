import React from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Color, Styles, FontSize, Util, Images} from '@common';
import {ButtonGradient, Spinner, TextBox, CardTitle} from '@components';
import {connect} from 'react-redux';
import {setUser} from '@redux/actions/user';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class SignUpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      password: '',
      name: '',
      birthday: '',
      gender: 'm',
      address: '',
      phone: '',
      isLoading: false,
      errorMsg: ' ',
    };
  }

  onIdHandle = (id) => {
    // 중복아이디 체크 후 errorMsg로 "멋진 아이디입니다" / "중복된 아이디입니다" 출력해야함
    this.setState({id})
  };

  onEmailHandle = (email) => this.setState({email});

  onPasswordHandle = (password) => this.setState({password});

  handleSignUp = () => {
    if (this.state.id.trim() === '') {
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
              id: this.state.id,
            })
            .then(() => {
              this.props.setUser({
                uid: userCredentials.user.uid,
                id: this.state.id,
                email: userCredentials.user.email,
                token: userCredentials.user.email,
              });
              this.setState({
                id: '',
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
              <View style={styles.logoImageContainer}>
                <Image style={styles.logoImage} source={Images.sunnysideLogo} />
              </View>
              <View>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'android' ? null : 'padding'}>
                  <CardTitle title="아이디" />
                  <TextBox
                    value={this.state.id}
                    placeholder="아이디를 입력해주세요."
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.secondTextInput.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText={this.onIdHandle}
                  />
                  <Text style={styles.error}>{this.state.errorMsg}</Text>
                  {/* <View style={styles.space} /> */}
                  <CardTitle title="비밀번호" />
                  <TextBox
                    value={this.state.password}
                    placeholder="비밀번호를 입력해주세요."
                    secureTextEntry
                    returnKeyType="next"
                    onRef={(input) => {
                      this.secondTextInput = input;
                    }}
                    onSubmitEditing={() => {
                      this.thirdTextInput.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText={this.onPasswordHandle}
                  />
                  <View style={styles.space} />
                  <CardTitle title="비밀번호 재확인" />
                  <TextBox
                    placeholder="비밀번호를 다시 입력해주세요."
                    secureTextEntry
                    onChangeText={this.onPasswordHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.thirdTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={() => this.fourthTextInput.focus()}
                  />
                  {/* <Text style={styles.error}>{this.state.errorMsg}</Text> */}
                  <View style={styles.space} />
                  <CardTitle title="이름" />
                  <TextBox
                    placeholder="이름을 입력해주세요."
                    autoCapitalize="none"
                    onChangeText={this.onNameHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.fourthTextInput = input;
                    }}
                    value={this.state.name}
                    onSubmitEditing={() => this.fifthTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="생년월일" />
                  <TextBox
                    placeholder="Password"
                    onChangeText={this.onPasswordHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.fifthTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={() => this.sixthTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="성별" />
                  {/* Picker로 변경해야함 */}
                  <TextBox
                    placeholder="Password"
                    onChangeText={this.onPasswordHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.sixthTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={() => this.seventhTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="본인 확인 이메일 (선택)" />
                  <TextBox
                    placeholder="이메일을 입력해주세요."
                    onChangeText={this.onEmailHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.seventhTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={() => this.eighthTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="주소" />
                  <TextBox
                    placeholder="주소를 입력해주세요."
                    onChangeText={this.onPasswordHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.eighthTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={() => this.ninethTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="전화번호" />
                  <TextBox
                    placeholder="전화번호를 입력해주세요."
                    onChangeText={this.onPasswordHandle}
                    returnKeyType="send"
                    onRef={(input) => {
                      this.ninethTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={() => this.tenthTextInput.focus()}
                  />
                  <ButtonGradient
                    text="SIGN UP"
                    fullWidth
                    disabled={this.state.isLoading}
                    containerStyle={styles.loginButton}
                    onPress={this.handleSignUp}
                  />
                </KeyboardAvoidingView>
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
    // marginTop: 60,
  },
  logoImageContainer: {
    marginVertical: 30,
  },
  logoImage: {
    transform: [{scale: 0.8}],
    resizeMode: 'contain',
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
