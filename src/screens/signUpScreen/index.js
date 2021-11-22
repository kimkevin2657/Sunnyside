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
import { RadioButton } from 'react-native-paper';

class SignUpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      passwordConfirm: '',
      name: '',
      birthday: '', // year + month + day
      year: '',
      month: '',
      day: '',
      gender: 'm',
      email: '',
      postalCode: '',
      address: '',
      addressDetail: '',
      selectedCategory: '',
      phone: '',
      phoneConfirm: '',
      isLoading: false,
      errorMsg: ' ',
      pickerOpen: false,
    };
  }

  onIdHandle = (id) => {
    // 중복아이디 체크 후 errorMsg로 "멋진 아이디입니다" / "중복된 아이디입니다" 출력해야함
    this.setState({id})
  };

  onPasswordHandle = (password) => this.setState({password});

  onPasswordConfirmHandle = (passwordConfirm) => this.setState({passwordConfirm});

  onNameHandle = (name) => this.setState({name});

  onYearHandle = (year) => this.setState({year});

  onMonthHandle = (month) => this.setState({month});

  onDayHandle = (day) => this.setState({day});
  
  onEmailHandle = (email) => this.setState({email});

  onPostalCodeHandle = (postalCode) => this.setState({postalCode});

  onAddressHandle = (address) => this.setState({address});

  onAddressDetailHandle = (addressDetail) => this.setState({addressDetail});

  onPhoneHandle = (phone) => this.setState({phone}); // selectedCategory와 합쳐야함

  onPhoneConfirmHandle = (phoneConfirm) => this.setState({phoneConfirm});
  
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
      this.setState({isLoading: false})
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
                        onChangeText={this.onYearHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.fifthTextInput = input;
                        }}
                        value={this.state.year}
                        onSubmitEditing={() => this.sixthTextInput.focus()}
                      />
                    </View>
                    <View style={{flex: 1}} />
                    <View style={{flex: 4}}>
                      {/* Picker로 교체예정 */}
                      <TextBox
                        placeholder="월"
                        onChangeText={this.onMonthHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.sixthTextInput = input;
                        }}
                        value={this.state.month}
                        onSubmitEditing={() => this.seventhTextInput.focus()}
                      />
                    </View>
                    <View style={{flex: 1}} />
                    <View style={{flex: 4}}>
                      <TextBox
                        placeholder="일"
                        onChangeText={this.onDayHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.seventhTextInput = input;
                        }}
                        value={this.state.day}
                        // onSubmitEditing={() => this.eighthTextInput.focus()}
                      />
                    </View>
                  </View>
                  <View style={styles.space} />
                  <CardTitle title="성별" />
                  {/* RadioButton으로 변경해야함 */}
                  <View style={{flexDirection: 'row', zIndex: 9999, position: 'relative', justifyContent: 'space-around' }}>
                    <TouchableOpacity 
                      style={{
                        flexDirection: 'row', 
                        justifyContent: 'center', 
                        alignItems: 'center'
                      }}
                      onPress={() => this.setState({gender: 'm'})}>
                      <Text style={styles.fontSize14}>
                        남자
                      </Text>
                      <RadioButton
                        value="m"
                        status={this.state.gender === 'm' ? 'checked' : 'unchecked'}
                        onPress={() => this.setState({gender: 'm'})}
                        color={Color.leadColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{
                        flexDirection: 'row', 
                        justifyContent: 'center', 
                        alignItems: 'center'
                      }}
                      onPress={() => this.setState({gender: 'f'})}>
                      <Text style={styles.fontSize14}>
                        여자
                      </Text>
                      <RadioButton
                        value="f"
                        status={this.state.gender === 'f' ? 'checked' : 'unchecked'}
                        onPress={() => this.setState({gender: 'f'})}
                        color={Color.leadColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.space} />
                  <CardTitle title="본인 확인 이메일 (선택)" />
                  <TextBox
                    placeholder="이메일을 입력해주세요."
                    onChangeText={this.onEmailHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.eighthTextInput = input;
                    }}
                    value={this.state.password}
                    onSubmitEditing={() => this.ninethTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="주소" />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 8}}>
                      <TextBox
                        placeholder="우편번호"
                        onChangeText={this.onPostalCodeHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.ninethTextInput = input;
                        }}
                        value={this.state.postalCode}
                        onSubmitEditing={() => this.onAddressSearchHandle()}
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
                      this.tenthTextInput = input;
                    }}
                    value={this.state.address}
                    onSubmitEditing={() => this.eleventhTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <TextBox
                    placeholder="상세주소 입력"
                    onChangeText={this.onAddressDetailHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.eleventhTextInput = input;
                    }}
                    value={this.state.addressDetail}
                    onSubmitEditing={() => this.twelfthTextInput.focus()}
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
                        this.twelfthTextInput = input;
                      }}
                      value={this.state.phone}
                      onSubmitEditing={() => this.thirteenthTextInput.focus()}
                    />
                  </View>
                  <ButtonGradient
                    text="인증번호 요청"
                    fullWidth
                    containerStyle={{marginVertical: 10}}
                    onPress={this.handlePhoneConfirm}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 8}}>
                      <TextBox
                        placeholder="인증번호 입력"
                        onChangeText={this.onPhoneConfirmHandle}
                        returnKeyType="next"
                        onRef={(input) => {
                          this.thirteenthTextInput = input;
                        }}
                        value={this.state.phoneConfirm}
                        onSubmitEditing={() => this.onPhoneConfirmDone()}
                      />
                    </View>
                    <View style={{flex: 0.5}}/>
                    <View style={{flex: 5}}>
                    <ButtonGradient
                      text="확 인"
                      disabled={this.state.isLoading}
                      // containerStyle={styles.loginButton}
                      onPress={this.onPhoneConfirmDone}
                    />
                    </View>
                  </View>
                  <View style={styles.space} />
                  <ButtonGradient
                    text="가 입 하 기"
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
  fontSize14:{
    fontSize:14,
    lineHeight:17,
    fontWeight:'400'
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
