import React from 'react';
import {
    View,
    StatusBar,
    Alert,
    AppState,
    Image,
    Switch,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Color, Styles, FontSize, RealtimeDatabase, Images, Util } from '@common';
import { ButtonGradient, Spinner, TextBox, ButtonToggle } from '@components';
import { setUser } from '@redux/actions/user';
import { setConfigParameter } from '@redux/actions/config';
import { connect } from 'react-redux';
import ReactNativeBiometrics from 'react-native-biometrics';
// import ReactNativeBiometrics from '@common/react-native-biometrics'
import CheckBox from '@react-native-community/checkbox';
import * as Keychain from 'react-native-keychain';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Footer from '../../components/Footer';

class LoginScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            biometricType: null,
            shouldEnableBiometrics: false,
            appState: AppState.currentState,  //AppState 앱이 포 그라운드인지 백그라운드인지 알려주고 상태가 변경되면 알려줄 수 있습니다.
            isLoading: false,
            errorMsg: ' ',
            saveId: false,
            autoLogin: false,
        };
    }

    async componentDidMount() {
        try {    //TouchID 및 FaceId 관련 로직
            const {
                available,
                biometryType,
            } = await ReactNativeBiometrics.isSensorAvailable();

            if (available) {
                if (
                    biometryType === ReactNativeBiometrics.TouchID ||
                    biometryType === ReactNativeBiometrics.Biometrics
                ) {
                    this.setState(
                        {
                            biometricType:
                                biometryType === ReactNativeBiometrics.TouchID
                                    ? 'touchID'
                                    : 'fingerprint',
                            shouldEnableBiometrics: this.props.enableBiometrics,
                            appState: this.props.enableBiometrics
                                ? 'loadedBiometrics'
                                : AppState.currentState, // If enableBiometrics was enable, set up appState to load biometrics
                        },
                        () => {
                            AppState.addEventListener('change', this._handleAppStateChange);
                            if (this.props.enableBiometrics) {
                                // If enableBiometrics was enable, try to lunch biometrics
                                this.authWithBiometrics();
                            }
                        },
                    );
                } else if (biometryType === ReactNativeBiometrics.FaceID) {
                    this.setState({
                        biometricType: 'faceID',
                        shouldEnableBiometrics: this.props.enableBiometrics,
                    });
                }
            }
        } catch (err) { }
    }

    componentWillUnmount() {
        if (
            this.state.biometricType === 'touchID' ||
            this.state.biometricType === 'fingerprint'
        ) {
            // Remove event for touchID biometrics
            AppState.removeEventListener('change', this._handleAppStateChange);
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.props.token === '' &&
            this.state.shouldEnableBiometrics &&
            this.props.enableBiometrics &&
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            this.setState({ appState: 'loadedBiometrics' }, () => {
                this.authWithBiometrics();
            });
        }
        if (this.state.appState !== 'loadedBiometrics') {
            this.setState({ appState: nextAppState });
        }
    };

    activateBiometrics = async () => {
        const { keysExist } = await ReactNativeBiometrics.biometricKeysExist();
        if (!keysExist) {
            ReactNativeBiometrics.createKeys('Confirm fingerprint');
        }
    };

    login = (email, password, saveCredentials) => {
        this.setState({ isLoading: true }, () => {
            auth()
                .signInWithEmailAndPassword(email, password)
                .then((userCredentials) => {
                    database()
                        .ref(`users/${userCredentials.user.uid}`)
                        .once('value')
                        .then(async (snapshot) => {
                            // Check to save biometrics
                            if (saveCredentials) {
                                Keychain.setGenericPassword(email, password); // store the credentials in the keychain
                                const epochTimeSeconds = Math.round(
                                    new Date().getTime() / 1000,
                                ).toString();
                                const { success } = await ReactNativeBiometrics.createSignature({
                                    promptMessage:
                                        'Use your fingerprint to set up your credentials',
                                    payload: epochTimeSeconds,
                                });
                                if (success) {
                                    this.props.setConfigParameter('enableBiometrics', true);
                                }
                            }
                            // Set user information
                            let loggedinUser = snapshot.val();
                            this.props.setUser({
                                uid: userCredentials.user.uid,
                                userName: loggedinUser.userName,
                                email: userCredentials.user.email,
                                token: userCredentials.user.email,
                            });
                            this.setState({
                                isLoading: false,
                                password: '',
                                errorMsg: ' ',
                            });
                            // Start listening for remote events
                            RealtimeDatabase.startListening();
                            this.props.navigation.navigate('Main');
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

    authWithBiometrics = async () => {
        try {
            const epochTimeSeconds = Math.round(
                new Date().getTime() / 1000,
            ).toString();
            const { success } = await ReactNativeBiometrics.createSignature({
                promptMessage: 'Use your fingerprint to Login',
                payload: epochTimeSeconds,
            });
            if (success) {
                const { username, password } = await Keychain.getGenericPassword(); // Retrieve the credentials from the keychain
                this.login(username, password, false);
            }
        } catch (err) {
            setTimeout(() => {
                this.setState({ appState: AppState.currentState });
            }, 2000);
        }
    };

    authWithUserPassword = () => {
        const { email, password, shouldEnableBiometrics } = this.state;

        if (!Util.isValidEmail(email)) {
            this.setState({
                errorMsg: 'Invalid email address',
            });
            return;
        } else if (password === '') {
            this.setState({
                errorMsg: 'You must include a password',
            });
            return;
        } else {
            this.login(email, password, shouldEnableBiometrics);
        }
    };

    onEmailHandle = (email) => this.setState({ email });

    onPasswordHandle = (password) => this.setState({ password });

    toggleEnableBiometrics = () => {
        this.setState(
            { shouldEnableBiometrics: !this.state.shouldEnableBiometrics },
            () => {
                if (this.state.shouldEnableBiometrics) {
                    let biometricTitle,
                        biometricBody = '';
                    switch (this.state.biometricType) {
                        case 'faceID':
                            biometricTitle = 'Enable Face ID';
                            biometricBody =
                                'By activating Face ID, the next time you login you will not need to re-enter your credentials';
                            break;
                        case 'touchID':
                            biometricTitle = 'Enable Touch ID';
                            biometricBody =
                                'By activating Touch ID, the next time you login you will not need to re-enter your credentials';
                            break;
                        default:
                            biometricTitle = 'Enable Fingerprint Authentication';
                            biometricBody =
                                'By activating Fingerprint Authentication, the next time you login you will not need to re-enter your credentials';
                            break;
                    }
                    // Show info message
                    Alert.alert(biometricTitle, biometricBody, [
                        {
                            text: 'Ok',
                            onPress: () => this.activateBiometrics(),
                            style: 'default',
                        },
                    ]);
                } else {
                    // delete keys
                    ReactNativeBiometrics.deleteKeys();
                    // remove local credentials
                    Keychain.resetGenericPassword();
                    // Save global status
                    this.props.setConfigParameter('enableBiometrics', false);
                }
            },
        );
    };

    onLoginPressHandle = () => {
        if (this.state.shouldEnableBiometrics && this.props.enableBiometrics) {
            this.authWithBiometrics();
        } else {
            this.authWithUserPassword();
        }
    };

    openResetPassword = () => {
        this.props.navigation.navigate('ResetPasswordScreen');
    };

    openSignUp = () => {
        this.props.navigation.navigate('SignUpScreen');
    };

    openTerms = () => {
        this.props.navigation.navigate('TermsScreen');
    }

    //-- dev options --

    restartIntro = () => {
        this.props.setConfigParameter('introSlider', 'new');
        this.props.navigation.navigate('IntroSliderScreen');
    };

    handleAutoSignUp = () => {
        const autogeneratedEmail = `${Util.makeRandomString(10)}@svalvard.dev`;
        const autogeneratedPassword = Util.makeRandomString(12);
        this.setState({ isLoading: true }, () => {
            auth()
                .createUserWithEmailAndPassword(
                    autogeneratedEmail,
                    autogeneratedPassword,
                )
                .then((userCredentials) => {
                    database()
                        .ref(`users/${userCredentials.user.uid}`)
                        .set({
                            uid: userCredentials.user.uid,
                            email: userCredentials.user.email,
                            userName: 'Autogenerated',
                        })
                        .then(() => {
                            this.props.setUser({
                                uid: userCredentials.user.uid,
                                userName: 'Autogenerated',
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
                            // Start listening for remote events
                            RealtimeDatabase.startListening();
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

    //-- dev options --

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <KeyboardAwareScrollView
                    scrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.wrap}>
                        <View style={styles.subContain}>
                            {/* <Text style={styles.subTitle}>SIGN IN</Text>
                            <Text style={styles.title}>Welcome Back</Text> */}
                            <View style={styles.logoImageContainer}>
                                <Image style={styles.logoImage} source={Images.sunnysideLogo} />
                            </View>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'android' ? null : 'padding'}>
                                {(!this.state.shouldEnableBiometrics ||
                                    !this.props.enableBiometrics) && (
                                        <React.Fragment>
                                            <TextBox
                                                value={this.state.email}
                                                autoCapitalize={'none'}
                                                placeholder="아이디"
                                                returnKeyType="next"
                                                onChangeText={this.onEmailHandle}
                                                onSubmitEditing={() => {
                                                    this.secondTextInput.focus();
                                                }}
                                                blurOnSubmit={false}
                                                icon="user"
                                            />
                                            <View style={styles.space} />
                                            <TextBox
                                                value={this.state.password}
                                                placeholder="비밀번호"
                                                secureTextEntry
                                                onChangeText={this.onPasswordHandle}
                                                returnKeyType="send"
                                                onRef={(input) => {
                                                    this.secondTextInput = input;
                                                }}
                                                onSubmitEditing={this.onLoginPressHandle}
                                                icon="lock"
                                            />
                                        </React.Fragment>
                                    )}
                                <Text style={styles.error}>{this.state.errorMsg}</Text>
                                {this.state.biometricType === 'faceID' && (
                                    <View style={styles.bioContainer}>
                                        <Image style={styles.bioIcon} source={Images.logoFaceID} />
                                        <Text style={styles.bioText}>Log in with Face ID</Text>
                                        <Switch
                                            trackColor={{
                                                false: Color.text,
                                                true: Color.text,
                                            }}
                                            thumbColor={
                                                this.state.shouldEnableBiometrics
                                                    ? Color.primaryLight
                                                    : Color.background
                                            }
                                            ios_backgroundColor={Color.text}
                                            onValueChange={this.toggleEnableBiometrics}
                                            value={this.state.shouldEnableBiometrics}
                                        />
                                    </View>
                                )}
                                {this.state.biometricType === 'touchID' && (
                                    <View style={styles.bioContainer}>
                                        <Image style={styles.bioIcon} source={Images.logoTouchID} />
                                        <Text style={styles.bioText}>
                                            {this.props.language === 'es'
                                                ? 'Iniciar sesión con Touch ID'
                                                : 'Log in with Touch ID'}
                                        </Text>
                                        <Switch
                                            trackColor={{
                                                false: Color.text,
                                                true: Color.text,
                                            }}
                                            thumbColor={
                                                this.state.shouldEnableBiometrics
                                                    ? Color.primaryLight
                                                    : Color.background
                                            }
                                            ios_backgroundColor={Color.text}
                                            onValueChange={this.toggleEnableBiometrics}
                                            value={this.state.shouldEnableBiometrics}
                                        />
                                    </View>
                                )}
                                {this.state.biometricType === 'fingerprint' && (
                                    <View style={styles.bioContainer}>
                                        <Image style={styles.bioIcon} source={Images.logoTouchID} />
                                        <Text style={styles.bioText}>
                                            {this.props.language === 'es'
                                                ? 'Usa tu huella para iniciar sesión'
                                                : 'Use your fingerprint to login'}
                                        </Text>
                                        <Switch
                                            trackColor={{
                                                false: Color.text,
                                                true: Color.text,
                                            }}
                                            thumbColor={
                                                this.state.shouldEnableBiometrics
                                                    ? Color.primaryLight
                                                    : Color.background
                                            }
                                            ios_backgroundColor={Color.text}
                                            onValueChange={this.toggleEnableBiometrics}
                                            value={this.state.shouldEnableBiometrics}
                                        />
                                    </View>
                                )}
                                <View style={{flex: 1, flexDirection: 'row',  justifyContent: 'space-between'}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1}}>
                                        <TouchableOpacity onPress={() => this.setState({saveId : !this.state.saveId})}>
                                            <Text style={[styles.fontSize13,{}]}>아이디 저장</Text>
                                        </TouchableOpacity>
                                        <CheckBox tintColors={{true: '#FF843A'}} style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.saveId} onValueChange={(e)=>{this.setState({saveId : e})}} />
                                    </View>
                                    <View style={{flex: 1}} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1}}>
                                        <TouchableOpacity onPress={() => this.setState({ autoLogin: !this.state.autoLogin })}>
                                            <Text style={[styles.fontSize13,{}]}>자동 로그인</Text>
                                        </TouchableOpacity>
                                        <CheckBox tintColors={{true: '#FF843A'}} style={Platform.OS=="ios" ? styles.checkBox:null} value={this.state.autoLogin} onValueChange={(e)=>{this.setState({autoLogin : e})}} />
                                    </View>
                                </View>
                                <ButtonGradient
                                    text="로그인"
                                    fullWidth
                                    disabled={this.state.isLoading}
                                    containerStyle={styles.loginButton}
                                    onPress={this.onLoginPressHandle}
                                />
                            </KeyboardAvoidingView>
                            {(!this.state.shouldEnableBiometrics ||
                                !this.props.enableBiometrics) && (
                                    <React.Fragment>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                            <TouchableOpacity
                                                style={Styles.ColumnCenter}
                                                onPress={this.openSignUp}>
                                                <Text style={styles.subTitle}>
                                                    아이디 찾기
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={styles.subTitle}>
                                                |
                                            </Text>
                                            {/* <View style={styles.space} /> */}
                                            <TouchableOpacity
                                                style={Styles.ColumnCenter}
                                                onPress={this.openResetPassword}>
                                                <Text style={styles.subTitle}>비밀번호 찾기</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.subTitle}>
                                                |
                                            </Text>
                                            <TouchableOpacity
                                                style={Styles.ColumnCenter}
                                                onPress={this.openTerms}>
                                                <Text style={styles.subTitle}>회원가입</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </React.Fragment>
                                )}
                            {/* dev options */}
                            {/* <View style={[Styles.ColumnCenterBottom, styles.containerDev]}>
                                <Text style={styles.subTitleDev}>dev options</Text>
                                <ButtonToggle
                                    disabled={this.state.adults === 0 || this.state.adults === 1}
                                    icon="user"
                                    text=" SIGN IN NOW "
                                    onPress={this.handleAutoSignUp}
                                    style={styles.btnDev}
                                />
                                <ButtonToggle
                                    disabled={this.state.adults === 0 || this.state.adults === 1}
                                    icon="left"
                                    text=" GO TO INTRO "
                                    onPress={this.restartIntro}
                                    style={styles.btnDev}
                                />
                            </View> */}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {this.state.isLoading ? <Spinner mode="overlay" /> : null}
                <Footer />
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
        marginTop: 100,
    },
    logoImageContainer: {
        marginBottom: 100,
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
    bioContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignContent: 'flex-start',
    },
    bioIcon: {
        resizeMode: 'contain',
        height: 32,
        width: 32,
    },
    bioText: {
        marginTop: 5,
        marginHorizontal: 8,
        color: Color.text,
        fontSize: FontSize.mLarge,
    },
    loginButton: {
        marginVertical: 30,
        // marginTop: 30,
        // marginBottom: 10,
    },
    checkBox:{
        width:15,
        height:15,
        marginRight: 10
    },
    title: {
        fontWeight: 'bold',
        color: Color.primary,
        fontSize: FontSize.xMidLarge,
        marginBottom: 40,
    },
    subTitle: {
        color: Color.blackTextSecondary,
    },
    containerDev: {
        alignSelf: 'center',
        marginTop: 50,
        paddingTop: 10,
        width: '80%',
        borderTopColor: Color.separator,
        borderTopWidth: 2,
    },
    subTitleDev: {
        color: Color.textBorderColor,
        fontSize: FontSize.xLarge,
        fontWeight: '300',
        marginBottom: 30,
    },
    btnDev: {
        marginBottom: 20,
    },
    highlight: {
        fontWeight: 'bold',
        color: Color.primary,
    },
});

const mapStateToProps = (state) => {
    return {
        enableBiometrics: state.config.enableBiometrics,
        token: state.user.token,
    };
};

const mapDispatchToProps = {
    setUser,
    setConfigParameter,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
