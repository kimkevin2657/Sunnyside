import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    Image,
    TextInput,
    BackHandler
} from 'react-native';
import { Color, Images } from '@common';
import { commonApi } from '@common/ApiConnector';
import RectangleButton from '../../../components/_gmcCustom/RectangleButton'
import HeaderBar from '../../../components/_gmcCustom/HeaderBar'
import BottomTab from '../../../components/_gmcCustom/BottomTab'
import SimpleToast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';

class SetPassword extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            prevPasswd: '',
            loginPasswd: '',
            confirmPasswd: '',
            hidePass1: true,
            hidePass2: true,
            hidePass3: true,
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    }

    onPressConfirm() {
        if(this.state.loginPasswd != this.state.confirmPasswd) {
            SimpleToast.show('The old password and the new password cannot be the same.', SimpleToast.SHORT)
        } else {
            const response = commonApi('patch', `/mypage/updateLoginPasswd?certify_idx=21&certify_num=124551&prev_passwd=${this.state.prevPasswd}&login_passwd=${this.state.loginPasswd}`);
            response.then( (res) => {
                if(res.success) {
                    SimpleToast.show('Password change has been completed. Please log back in', SimpleToast.SHORT)
                    this.props.navigation.goBack()
                } else {
                    SimpleToast.show(res.message, SimpleToast.SHORT)
                }
            }).catch(e => {
                console.log('error:: ',e);
            })
        }
    }

    onChangePrevPass = (val) => {
        this.setState({
            prevPasswd: val 
        })
    }

    onChangeLoginPass = (val) => {
        this.setState({
            loginPasswd: val 
        })
    }

    onChangeConfirmPass = (val) => {
        this.setState({
            confirmPasswd: val 
        })
    }

    checkSpecial(){
        let specialPattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
        if(specialPattern.test(this.state.loginPasswd) == true) {
            return true;
        } else {
            return false;
        }
    }

    checkCapital(){
        let capitalPattern = /[A-Z]/;
        if(capitalPattern.test(this.state.loginPasswd) == true) {
            return true;
        } else {
            return false;
        }
    }

    checkSmall(){
        let smallPattern = /[a-z]/;
        if(smallPattern.test(this.state.loginPasswd) == true) {
            return true;
        } else {
            return false;
        }
    }

    checkNumber(){
        let numberPattern = /[0-9]/;
        if(numberPattern.test(this.state.loginPasswd) == true) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="Change Password"></HeaderBar>
                <ScrollView>
                    <View style={styles.bodyContainer}>
                        <Text style={styles.title}>Please enter your current password and new password to be changed.</Text>
                        <Text style={styles.editText}>Current password</Text>
                        <View style={{borderWidth:1,borderColor:"#D7D6D6",flexDirection:'row',paddingHorizontal:17}}>
                            <TextInput
                                style={styles.editBox}
                                selectionColor="grey"
                                value={this.state.prevPasswd}
                                onChangeText={this.onChangePrevPass}
                                secureTextEntry={this.state.hidePass1 ? true : false}
                            />
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Icon
                                    
                                    name={this.state.hidePass1 ? 'eye-slash' : 'eye'}
                                    size={15}
                                    color="grey"
                                    onPress={() => {
                                        this.setState({
                                            hidePass1: !this.state.hidePass1
                                        })
                                    }}
                                    />
                                </View>
                        </View>
                        <Text style={styles.editText}>New password</Text>
                        <View style={{borderWidth:1,borderColor:"#D7D6D6",flexDirection:'row',paddingHorizontal:17}}>
                            
                            <TextInput
                                style={styles.editBox}
                                selectionColor="grey"
                                value={this.state.loginPasswd}
                                onChangeText={this.onChangeLoginPass}
                                secureTextEntry={this.state.hidePass2 ? true : false}
                            />
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Icon
                                    
                                    name={this.state.hidePass2 ? 'eye-slash' : 'eye'}
                                    size={15}
                                    color="grey"
                                    onPress={() => {
                                        this.setState({
                                            hidePass2: !this.state.hidePass2
                                        })
                                    }}
                                    />
                                </View>
                        </View>
                        <Text style={styles.editText}>Confirm new password</Text>
                        <View style={{borderWidth:1,borderColor:"#D7D6D6",flexDirection:'row',paddingHorizontal:17}}>
                            
                            <TextInput
                                style={styles.editBox}
                                selectionColor="grey"
                                value={this.state.confirmPasswd}
                                onChangeText={this.onChangeConfirmPass}
                                secureTextEntry={this.state.hidePass3 ? true : false}
                            />
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Icon
                                    
                                    name={this.state.hidePass3 ? 'eye-slash' : 'eye'}
                                    size={15}
                                    color="grey"
                                    onPress={() => {
                                        this.setState({
                                            hidePass3: !this.state.hidePass3
                                        })
                                    }}
                                    />
                                </View>
                        </View>

                        <Text style={styles.descPassword}>Password must be at least 8 ~ 15 characters long containing English uppercases, English lowercases, numeric characters, and special characters(~!@#$%^*).</Text>
                        <View style={styles.checkContainer}>
                            <Image source={this.checkCapital() ? Images.onCheck : Images.check} style={styles.onCheck}></Image>
                            <Text style={this.checkCapital() ? styles.satisfiedText : styles.unSatisfiedText}>English uppercases</Text>
                        </View>
                        <View style={styles.checkContainer}>
                            <Image source={this.checkSmall() ? Images.onCheck : Images.check} style={styles.check}></Image>
                            <Text style={this.checkSmall() ? styles.satisfiedText :styles.unSatisfiedText}>English lowercases</Text>
                        </View>
                        <View style={styles.checkContainer}>
                            <Image source={this.checkNumber() ? Images.onCheck :Images.check} style={styles.check}></Image>
                            <Text style={this.checkNumber() ? styles.satisfiedText : styles.unSatisfiedText}>Numeric characters</Text>
                        </View>
                        <View style={styles.checkContainer}>
                            <Image source={this.checkSpecial() ? Images.onCheck : Images.check} style={styles.check}></Image>
                            <Text style={this.checkSpecial() ? styles.satisfiedText : styles.unSatisfiedText}>Special characters (~!@#$%^*)</Text>
                        </View>
                        <View style={styles.checkContainer}>
                            <Image source={this.state.loginPasswd.length >= 10 ? Images.onCheck : Images.check} style={styles.check}></Image>
                            <Text style={this.state.loginPasswd.length >= 10 ? styles.satisfiedText : styles.unSatisfiedText}>8 ~ 15 characters</Text>
                        </View>
                        <RectangleButton
                            onPress = {() => this.onPressConfirm()}
                            title = {'Confirm'}
                            style = {styles.btnStyle}
                        />
                    </View>
                    <View style={{height: 50}}/>
                </ScrollView>
                <BottomTab navigation = {this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        height: 52,
        marginTop: 40,
        marginHorizontal: 20,
        borderRadius:10,
    },
    bodyContainer: {
        marginTop: 20,
        marginHorizontal: 15
    },
    title: {
        fontSize: 15,
        color: '#4A4A4A',
        marginBottom: 5
    },
    editText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    editBox: {
        height: 50,
        color: 'black',
        flex: 9
    },
    descPassword: {
        fontSize: 13,
        color: '#1B2937',
        marginVertical: 10
    },
    checkContainer: {
        flexDirection:'row',
        alignItems:'center',
        marginBottom: 1
    },
    check: {
        width:12,
        height:12,
        marginRight: 15,
    },
    onCheck: {
        width:12,
        height:12,
        marginRight: 15,
        color: '#1B2937'
    },
    satisfiedText: {
        fontSize: 13,
        color: '#1B2937'
    },
    unSatisfiedText: {
        fontSize: 13,
        color: '#BEBEBE'
    }
});

export default SetPassword;
