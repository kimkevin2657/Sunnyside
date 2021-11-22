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
import {ButtonGradient, ButtonSecundary, Spinner, TextBox, CardTitle} from '@components';
import {connect} from 'react-redux';
import {setUser} from '@redux/actions/user';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import DropDownPicker from 'react-native-dropdown-picker';

class CounselScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      postalCode: '',
      address: '',
      addressDetail: '',
      installType: '',
      installPurpose: '',
      licence: '',
      volumn: '',
      generatorName: '',
      etc: '', // 할말을 적는 공간 값
      isLoading: false,
      errorMsg: ' ',
      pickerOpen: false,
      selectedCategory: '',
    };
  }

  onPostalCodeHandle = (postalCode) => this.setState({postalCode})
  
  onAddressHandle = (address) => this.setState({address})

  onAddressDetailHandle = (addressDetail) => this.setState({addressDetail})

  onVolumeHandle = (volume) => this.setState({volume})

  onGeneratorNameHandle = (generatorName) => {
    // 중복되는 발전소명 체크 후 errorMsg로 "멋진 발전소명 입니다" / "중복된 발전소명 입니다" 출력해야함
    this.setState({generatorName})
  };

  onEtcHandle = (etc) => this.setState({etc})

  handleCounsel = () => {
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

    // this.setState({isLoading: true}, () => {
      // 상담신청 API 통신 
      // 이후 상담신청 완료 페이지로 이동

      this.props.navigation.navigate("CounselDoneScreen")
    // });
  };

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
              <View style={styles.textWrap}>
                <Text style={styles.fontSize16}>
                  아래의 항목을 입력하여 상담신청하시면 3일 이내에 상담결과를 메시지로 확인 할 수 있으며, 설치 가능시에 나만의 발전소페이지에 접속하여 조금 더 자세한 <Text style={{fontWeight: 'bold', color: Color.leadColor}}>상담 결과</Text>를 확인할 수 있습니다.
                </Text>
              </View>
              <View>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'android' ? null : 'padding'}>
                  <CardTitle title="희망설치장소" />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 8}}>
                      <TextBox
                        placeholder="우편번호"
                        onChangeText={this.onPostalCodeHandle}
                        returnKeyType="next"
                        keyboardType="number-pad"
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
                  <CardTitle title="설치유형" />
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: 5}}>
                      <ButtonSecundary 
                        containerStyle={{backgroundColor: this.state.installType === 'land' ? '#E35F2C' : '#FFF', borderColor: '#FCFCFC'}}
                        textStyle={{color: this.state.installType === 'land' ? '#FFF' : '#000'}}
                        text='토 지'
                        fullWidth
                        // disabled={this.state.installType === 'land' ? false : true}
                        onPress={() => this.setState({installType: 'land'})}
                      />
                    </View>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 5}}>
                      <ButtonSecundary 
                        containerStyle={{backgroundColor: this.state.installType === 'building' ? '#E35F2C' : '#FFF', borderColor: '#FCFCFC'}}
                        textStyle={{color: this.state.installType === 'building' ? '#FFF' : '#000'}}
                        text='건 물'
                        fullWidth
                        // disabled={this.state.installType === 'building' ? false : true}
                        onPress={() => this.setState({installType: 'building'})}
                      />
                    </View>
                  </View>
                  <View style={styles.space} />
                  <CardTitle title="설치목적" />
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: 5}}>
                      <ButtonSecundary 
                        containerStyle={{backgroundColor: this.state.installPurpose === 'business' ? '#E35F2C' : '#FFF', borderColor: '#FCFCFC'}}
                        textStyle={{color: this.state.installPurpose === 'business' ? '#FFF' : '#000'}}
                        text='발전사업용'
                        fullWidth
                        // disabled={this.state.installPurpose === 'business' ? false : true}
                        onPress={() => this.setState({installPurpose: 'business'})}
                      />
                    </View>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 5}}>
                      <ButtonSecundary 
                        containerStyle={{backgroundColor: this.state.installPurpose === 'consumption' ? '#E35F2C' : '#FFF', borderColor: '#FCFCFC'}}
                        textStyle={{color: this.state.installPurpose === 'consumption' ? '#FFF' : '#000'}}
                        text='자가소비용'
                        fullWidth
                        // disabled={this.state.installPurpose === 'consumption' ? false : true}
                        onPress={() => this.setState({installPurpose: 'consumption'})}
                      />
                    </View>
                  </View>
                  <View style={styles.space} />
                  <CardTitle title="보유자격유무" />
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: 5}}>
                      <ButtonSecundary 
                        containerStyle={{backgroundColor: this.state.licence === 'agribusiness' ? '#E35F2C' : '#FFF', borderColor: '#FCFCFC'}}
                        textStyle={{color: this.state.licence === 'agribusiness' ? '#FFF' : '#000'}}
                        text='농업경영체'
                        fullWidth
                        // disabled={this.state.licence === 'agribusiness' ? false : true}
                        onPress={() => this.setState({licence: 'agribusiness'})}
                      />
                    </View>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 5}}>
                      <ButtonSecundary 
                        containerStyle={{backgroundColor: this.state.licence === 'N' ? '#E35F2C' : '#FFF', borderColor: '#FCFCFC'}}
                        textStyle={{color: this.state.licence === 'N' ? '#FFF' : '#000'}}
                        text='없음'
                        fullWidth
                        // disabled={this.state.licence === 'N' ? false : true}
                        onPress={() => this.setState({licence: 'N'})}
                      />
                    </View>
                  </View>
                  <View style={styles.space} />
                  <CardTitle title="희망 설치 용량(선택)" />
                  <TextBox
                    placeholder="입력"
                    onChangeText={this.onVolumeHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.firstTextInput = input;
                    }}
                    value={this.state.volume}
                    onSubmitEditing={() => this.secondTextInput.focus()}
                  />
                  <View style={styles.space} />
                  <CardTitle title="발전소명(가칭)" />
                  <TextBox
                    placeholder="입력"
                    onChangeText={this.onGeneratorNameHandle}
                    returnKeyType="next"
                    onRef={(input) => {
                      this.secondTextInput = input;
                    }}
                    value={this.state.generatorName}
                    onSubmitEditing={() => this.thirdTextInput.focus()}
                  />
                  <Text style={styles.error}>{this.state.errorMsg}</Text>
                  <View style={styles.space} /> 
                  <TextBox
                    blurOnSubmit={false}
                    multiline={true}
                    placeholder={`기타 문의 사항이 있다면 작성해주세요.`}
                    containerStyle={{height: 200}}
                    textStyle={{flex: 1, height: '100%'}}
                    onChangeText={this.onEtcHandle}
                    returnKeyType="done"
                    value={this.state.etc}
                  />
                  <ButtonGradient
                    text="상 담 신 청 하 기"
                    fullWidth
                    disabled={this.state.isLoading}
                    containerStyle={styles.loginButton}
                    onPress={this.handleCounsel}
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
  textWrap: {
    padding: 20,
    borderRadius: 5,
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
    backgroundColor: Color.textBackgroundColor,
    marginVertical: 20,
  },
  fontSize16:{
    fontSize:16,
    // lineHeight:20,
    fontWeight:'400'
  },
  fontSize20:{
      fontSize:20,
      // lineHeight:20,
      fontWeight:'400'
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
