import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput, ImageStore, FlatList } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import RectangleButton from '../../../components/_gmcCustom/RectangleButton';
import PickerCustom from '../../../components/_gmcCustom/PickerCustom'
import ModalPicker from '../../../components/_gmcCustom/ModalPicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';
import { commonApi } from '@common/ApiConnector';
import Modal from 'react-native-modal';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SimpleToast from 'react-native-simple-toast';

class FindUserPwComplet extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            resultData : this.props.navigation.getParam('resultData'),
        }
    }

    resendEmail() {

        
        let findPwParam = {
            mb_id : this.state.resultData
        }
        console.log(findPwParam)

        const findPasswordResult = commonApi('post', 'member/open/passwordSend', findPwParam)
                    .then((result) => {
                    console.log("find pw result:::",result)
                    SimpleToast.show('Resend was finish. check your mail box', SimpleToast.SHORT)
                    
                    }).catch((error) => {
                    console.log('find pw error', error)
                    SimpleToast.show('resend fail. try again.', SimpleToast.SHORT)
                    }) 
    }

    render() {
        

        return (
            <SafeAreaView style={[Styles.Wrap, {}]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Find my password"></HeaderBar>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0}>
                    <ScrollView style={Styles.ScrollContainer}>
                    <View style={styles.container}>
                            <View style={{marginTop:67,justifyContent:'center',alignItems:'center'}}>
                                <Image source={Images.pwSequence_3} style={{width:192,height:30,resizeMode:"contain"}}></Image>
                            </View>
                            <View style={{marginTop:52}}>
                                <Text style={styles.fontSize16}>We have sent a link to your email for resetting your password and it will be valid for 30 minutes. If you did not receive the email we sent, please click the “Resent” button below.</Text>
                            </View>
                            
                            <View style={{marginTop:22}}>
                                <View style={{flex:1,marginTop:18,marginBottom:60}}>
                                    <RectangleButton
                                        title='Resend Email'
                                        style={{flex:1, height:52, marginTop: 40, borderRadius:10,marginHorizontal:5}}
                                        onPress={() => {
                                            this.resendEmail()
                                        }}
                                    />
                                    <RectangleButton
                                        title='Go To Login'
                                        textColor='#1B2937'
                                        style={{flex:1, height:52, marginTop: 20, borderRadius:10, backgroundColor: '#fff', borderColor: '#1B2937', borderWidth: 2, marginHorizontal:5, marginBottom:20}}
                                        onPress={() => {
                                            console.log("loggg",this.props.navigation)
                                            this.props.navigation.navigate("GmcLoginScreen")
                                        }}
                                    />
                                </View>
                            </View>
                    </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20
    },
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'400'
    },
    fontSize13:{
        fontSize:13,
        lineHeight:15,
        fontWeight:'400'
    },  
    fontSize16:{
        fontSize:16,
        lineHeight:20,
        fontWeight:'400'
    },
    completTableLable : {
        width:130,
        backgroundColor:"#F4F4F4",
        justifyContent:'center',
        paddingHorizontal:10,
        alignItems:'flex-start'
    }
   
});


export default FindUserPwComplet;
