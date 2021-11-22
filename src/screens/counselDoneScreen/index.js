import React from 'react';
import {  View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput, ImageStore, FlatList } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';

import {ButtonGradient, ButtonSecundary} from '@components';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';
import SimpleToast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer';
class CounselDoneScreen extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <SafeAreaView style={[Styles.Wrap, {flex: 1}]}>
                <View style={styles.container}>
                    <View style={{flex: 9}}>
                        <View style={[styles.logoImageContainer, {flex: 1}]}>
                            <Image style={styles.logoImage} source={Images.sunnysideLogo} />
                        </View>
                        <View style={{flex: 3, justifyContent: 'space-around', alignItems: 'center'}}>
                            <Text style={styles.fontSize20}>상담신청이 성공적으로</Text>
                            <Text style={styles.fontSize20}>완료되었습니다!</Text>
                        </View>
                        <View style={[styles.textWrap, {flex: 8}]}>
                            <Text style={styles.fontSize16}>
                                1. 상담신청하신 결과는 검토 후 3일 이내로 메시지로 발송됩니다. {'\n'}
                                <Text style={{fontWeight: 'bold', color: Color.leadColor}}>
                                    - 설치 가능여부 - 설치 가능용량
                                </Text>
                            </Text>
                            <Text style={styles.fontSize16}>
                                2. 설치 가능 시 귀하만의 발전소 페이지에 접속하여 더 자세한 상담 결과를 확인하시기 바랍니다.
                            </Text>
                        </View>
                    </View>
                    <View style={{flex: 2}} />
                    <View style={{
                        position: 'absolute',
                        bottom: 80,
                        flexDirection: 'row', 
                        justifyContent: 'space-around', 
                        alignItems: 'center', 
                        width: '100%', 
                    }}>
                        <View style={{flex: 8}}>
                            <ButtonGradient
                                text="홈으로 가기"
                                fullWidth
                                containerStyle={styles.loginButton}
                                onPress={() => this.props.navigation.pop()}
                            />
                        </View>
                    </View>
                </View>
                <Footer />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    logoImageContainer: {
        marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        transform: [{scale: 0.8}],
        resizeMode: 'contain',
    },
    textWrap: {
        padding: 20,
        borderRadius: 5,
        borderColor: '#FCFCFC',
        borderWidth: 1,
        justifyContent: 'space-around',
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
    fontSize14:{
        fontSize:14,
        lineHeight:17,
        fontWeight:'400'
    },
    fontSize13:{
        fontSize:13,
        // lineHeight:15,
        fontWeight:'400'
    },  
    fontSize16:{
        fontSize:16,
        // lineHeight:20,
        fontWeight:'400'
    },
    fontSize20:{
        fontSize:20,
        // lineHeight:20,
        fontWeight:'bold'
    },
    warnText:{
        fontSize:11,
        lineHeight:13,
        fontWeight:'400',
        color:"#FF0000"
    },
    pickerTextStyle : {
        fontSize:14,
        lineHeight: 17,
        fontWeight:'400',
        color:'#606060'
    },
    phoneView:{
        borderWidth:1,
        borderColor:"#D7D6D6",
        flex:1,
        paddingHorizontal: 13,
        marginRight: 10,
        height:52,
        flexDirection:'row',
        justifyContent:'center',
    },
    checkBox:{
        width:15,
        height:15,
        marginRight: 10
    },
    modalView :{
        alignItems:'center',
        position: 'absolute',
        width: '100%',
        bottom : 0,
        height:200,
        backgroundColor : Color.white
    },
    modal:{
        alignItems:'center',
        width : '100%',
        margin : 0,
        padding :0,
    },
    termsContainer: {
        height: 50,
        zIndex: 99,
        padding: 10,
    },
});


export default CounselDoneScreen;
