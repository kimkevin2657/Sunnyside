import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import ExchangeBox from '../../../../components/_gmcCustom/ExchangeBox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import { FlatList } from 'react-native-gesture-handler';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar'
import Modal from "react-native-modal";
import BottomTab from '../../../../components/_gmcCustom/BottomTab';

class emailCertification extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            modalShow : false
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
    

    render() {
        return (
            <SafeAreaView style={[Styles.Wrap]}>
                    <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="DFSC 받기"></HeaderBar>
                    <ScrollView>
                        <View style={styles.container}>
                            <View>
                                <Text style={{fontSize:20,lineHeight:24,fontWeight:'700'}}>Please check your email</Text>
                            </View>
                            <View style={{marginTop:20}}>
                                <Text style={{fontSize:14}}>Please check a verification email in your mailbox. You have to click a verification link in the email to complete the withdrawal request.</Text>
                                {/* <Text style={{fontSize:14,lineHeight:17,fontWeight:'400'}}>인증메일이 발송되었습니다.</Text>
                                <Text style={{fontSize:14,lineHeight:17,fontWeight:'400'}}>이메일의 인증 링크를 선택하면 출금이 완료됩니다.</Text> */}
                            </View>

                            <View style={{marginTop:10,backgroundColor:"#F9F9F9",flex:1,paddingVertical:20,paddingHorizontal:20}}>
                                <View style={{flexDirection:"row",alignItems:'center'}}>
                                    <Image source={Images.reminder} style={{width:11,height:11,marginRight:5}}></Image>
                                    <Text style={{fontWeight:'400',fontSize:12,lineHeight:14,color:'#FF0000'}}>Notice</Text>
                                </View>
                                <View style={[{marginTop:11},]}>
                                    <View style={{flexDirection:'row',flex:1,marginBottom:8}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}>A verification link will be valid for 30 minutes since sent for the security of your account, and it will terminate upon re-sending. Please confirm the last received email.</Text>
                                    </View>
                                    <View style={{flexDirection:'row',flex:1,}}>
                                        <Text style={[styles.warnText,{}]}>· </Text>
                                        <Text style={styles.warnText}>If you did not receive your email, please check your spam or junk mail folders.</Text>
                                    </View>
                                    <View style={{paddingVertical:15}}>
                                        <RectangleButton title={"Resend verification email"} style={{height:52}} onPress={()=>{this.setState({modalShow:true})}}></RectangleButton>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <BottomTab navigation={this.props.navigation}/>
                    <Modal
                    isVisible={this.state.modalShow}
                    backdropOpacity={0.2}
                    backdropColor = {'black'}
                    style={styles.Modal}
                >
                    
                        <View style={styles.ModalContainer}>
                            {/* <ScrollView> */}
                                {/* <View style={{paddingRight:8,alignItems:'flex-end'}}>
                                    <TouchableOpacity onPress={()=>{this.setState({modalShow: false})}} disabled={false}>
                                        <View style={{width:12,height:12,backgroundColor:'blue'}}></View>
                                    </TouchableOpacity>
                                </View> */}
                                <View style={{alignItems:'center'}}>
                                    <Image source={Images.complet} style={{width:30,height:30}}></Image>
                                    {/* <View style={{width:24,height:24,backgroundColor:'#FFD700'}}></View> */}
                                </View>
                                <View style={{marginTop:15,alignItems:'center'}}>
                                    <View>
                                        <Text style={{fontSize:14,lineHeight:18,}}>인증메일이 재발송 되었습니다.</Text>
                                        <Text style={{fontSize:14,lineHeight:18,}}>마지막에 수신된 메일을 확인해주세요.</Text>
                                    </View>
                                </View>

                                <View style={{marginTop:20}}>
                                    <RectangleButton style={{height:51}} title={"확인"} onPress={()=>{this.setState({modalShow:false})}}></RectangleButton>
                                </View>
                            {/* </ScrollView> */}
                        </View>
                    
                </Modal>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        paddingTop:48,
        
    },
   warnText:{
    fontSize:11,
    lineHeight:16,
    fontWeight:'400',
    color:"#9A9A9A"
   },
   Modal:{
    paddingHorizontal:20,
    
    margin:0,
    },
    ModalContainer:{
        // borderColor:'#4A4A4A',
        // borderWidth:1,
        // paddingBottom:37,
        // paddingTop:23,
        paddingVertical:40,
        paddingHorizontal:20,
        borderRadius:20,
        backgroundColor:Color.white,
        width:'100%',
        // height:194,
    },
   
});


export default emailCertification;
