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
import DropDownPicker from 'react-native-dropdown-picker';

class CounselScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      birthday: '',
      gender: 'm',
      address: '',
      phone: '',
      isLoading: false,
      errorMsg: ' ',
      pickerOpen: false,
      selectedCategory: '',
    };
  }

  onIdHandle = (id) => {
    // 중복아이디 체크 후 errorMsg로 "멋진 아이디입니다" / "중복된 아이디입니다" 출력해야함
    this.setState({id})
  };

  onEmailHandle = (email) => this.setState({email});
  
  onNameHandle = (name) => this.setState({name});

  onPasswordHandle = (password) => this.setState({password});

  onPasswordConfirmHandle = (passwordConfirm) => this.setState({passwordConfirm});

  handleSignUp = () => {
    // if (this.state.id.trim() === '') {
    //   this.setState({
    //     isLoading: false,
    //     errorMsg: 'You must include your name',
    //   });
    //   return;
    // }
    // if (!Util.isValidEmail(this.state.email)) {
    //   this.setState({
    //     isLoading: false,
    //     errorMsg: 'Invalid email address',
    //   });
    //   return;
    // }
    // if (this.state.password === '') {
    //   this.setState({
    //     isLoading: false,
    //     errorMsg: 'You must include a password',
    //   });
    //   return;
    // }

    this.setState({isLoading: true}, () => {
      // 회원가입 API 통신 
      // 이후 redux에 user 작성, 가입완료 페이지로 이동
      this.props.navigation.navigate("SignUpDoneScreen")
    });
  };

  backToLogin = () => {
    this.props.navigation.navigate('LoginScreen');
  };

  setOpen = () => {
    this.setState({
        pickerOpen: !this.state.pickerOpen
    });
  }
  setValue = (callback) => {
    this.setState(state => ({
        selectedCategory: callback(state.label)
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}>
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
                    onChangeText={this.onPasswordConfirmHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.thirdTextInput = input;
                    }}
                    value={this.state.passwordConfirm}
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
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 5}}>
                      <TextBox
                        placeholder="년(4자)"
                        onChangeText={this.onPasswordHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.fifthTextInput = input;
                        }}
                        value={this.state.password}
                        onSubmitEditing={() => this.sixthTextInput.focus()}
                      />
                    </View>
                    <View style={{flex: 1}} />
                    <View style={{flex: 4}}>
                      {/* Picker로 교체예정 */}
                      <TextBox
                        placeholder="월"
                        onChangeText={this.onPasswordHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.fifthTextInput = input;
                        }}
                        value={this.state.password}
                        onSubmitEditing={() => this.sixthTextInput.focus()}
                      />
                    </View>
                    <View style={{flex: 1}} />
                    <View style={{flex: 4}}>
                      <TextBox
                        placeholder="일"
                        onChangeText={this.onPasswordHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.fifthTextInput = input;
                        }}
                        value={this.state.password}
                        onSubmitEditing={() => this.sixthTextInput.focus()}
                      />
                    </View>
                  </View>
                  <View style={styles.space} />
                  <CardTitle title="성별" />
                  {/* Picker로 변경해야함 */}
                  <View style={{flexDirection: 'row', zIndex: 9999, position: 'relative', }}>
                    <DropDownPicker
                      style={{borderColor: '#FCFCFC',  zIndex: 9999}}
                      // containerStyle={{width: 80,  zIndex: 9999}}
                      placeholder="선택"
                      items={[
                        {label: '남자', value: 'm'},
                        {label: '여자', value: 'f'},
                      ]}
                      onChangeItem={item => console.log(item)}
                      open={this.state.pickerOpen}
                      setOpen={this.setOpen}
                      // dropDownMaxHeight={200}
                      dropDownContainerStyle={{zIndex: 9999, borderColor: '#FCFCFC', }}
                      // dropDownStyle={{height: 200}}
                      value={String(this.state.selectedCategory.value)}
                      setValue={this.setValue}
                    />
                  </View>
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
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 8}}>
                      <TextBox
                        placeholder="우편번호"
                        onChangeText={this.onAddressHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.eighthTextInput = input;
                        }}
                        value={this.state.address}
                        onSubmitEditing={() => this.ninethTextInput.focus()}
                      />
                    </View>
                    <View style={{flex: 0.5}}/>
                    <View style={{flex: 5}}>
                    <ButtonGradient
                      text="주소검색"
                      disabled={this.state.isLoading}
                      // containerStyle={styles.loginButton}
                      onPress={this.onAddressSearchHandle}
                    />
                    </View>
                  </View>
                  <View style={styles.space} />
                  <TextBox
                    placeholder="주소"
                    onChangeText={this.onAddressHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.eighthTextInput = input;
                    }}
                    value={this.state.address}
                    onSubmitEditing={() => this.ninethTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <TextBox
                    placeholder="상세주소 입력"
                    onChangeText={this.onAddressHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.eighthTextInput = input;
                    }}
                    value={this.state.address}
                    onSubmitEditing={() => this.ninethTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="전화번호" />
                  <View style={{flexDirection: 'row', zIndex: 9999, position: 'relative', }}>
                    <DropDownPicker
                      style={{borderColor: '#FCFCFC',  zIndex: 9999}}
                      containerStyle={{width: 80,  zIndex: 9999}}
                      placeholder="선택"
                      items={[
                        {label: '010', value: '010'},
                        {label: '011', value: '011'},
                        {label: '016', value: '016'},
                        {label: '017', value: '017'},
                        {label: '018', value: '018'},
                        {label: '019', value: '019'},
                      ]}
                      defaultIndex={0}
                      onChangeItem={item => console.log(item)}
                      open={this.state.pickerOpen}
                      setOpen={this.setOpen}
                      // dropDownMaxHeight={200}
                      dropDownContainerStyle={{zIndex: 9999, borderColor: '#FCFCFC', }}
                      // dropDownStyle={{height: 200}}
                      value={String(this.state.selectedCategory.value)}
                      setValue={this.setValue}
                    />
                    <TextBox
                      placeholder="전화번호를 입력해주세요."
                      onChangeText={this.onPhoneHandle}
                      returnKeyType="send"
                      onRef={(input) => {
                        this.ninethTextInput = input;
                      }}
                      value={this.state.phone}
                      onSubmitEditing={this.handleSignUp}
                    />
                  </View>
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

export default connect(null, mapDispatchToProps)(CounselScreen);
