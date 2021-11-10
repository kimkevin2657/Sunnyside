import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput, ImageStore, FlatList } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import RectangleButton from '../../../components/_gmcCustom/RectangleButton';
import PickerCustom from '../../../components/_gmcCustom/PickerCustom'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';
import { commonApi } from '@common/ApiConnector';
import Modal from 'react-native-modal';
import { Colors } from 'react-native/Libraries/NewAppScreen';

class FindUserIdMain extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            carrierCode : "KT",
            modalShow: false,
            carrierArray: [
                { label: 'KT', value: 'KT' },
                { label: 'SKT', value: 'SKT' },
                { label: 'LGT', value: 'LGT' },
                { label: '알뜰폰', value: 'MVNO' },
            ],
            mbName : "",
            mbPhone : "",
            mbCfCode : "",
        }
    }

    onChangeName = (e)=>{
        this.setState({
            mbName : e
        })
    }

    onChangeMbCfCode = (e)=>{
        this.setState({
            mbCfCode : e
        })
    }

    onChangeMbPhone = (e)=>{
        this.setState({
            mbPhone : e
        })
    }

    findId=()=>{
        let params = {
            mbName : this.state.mbName,
            mbPhone: this.state.mbPhone,
            carrierCode: this.state.carrierCode,
            // mb_cf_code : this.state.mbCfCode,
            process : "findId"
        } 

        // let resultId = "test@test.kr"
        // console.log("params :: ",params)

        this.props.navigation.navigate("IamportMain",{certData : params})
    }

    findPw=()=>{
        this.props.navigation.navigate("FindUserPwMain")
    }



    render() {
        

        return (
            <SafeAreaView style={[Styles.Wrap, {}]}>
                <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="Find your ID"></HeaderBar>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0}>
                    <ScrollView style={Styles.ScrollContainer}>
                    <View style={styles.container}>

                        <View style={{marginTop:22}}>
                            <Text style={[styles.fontSize16,{}]}>You can find your id by name and phone number registered in member information.</Text>
                        </View>
                        
                        <View style={{marginTop:23}}>
                            <View style={{borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                <TextInput style={[styles.fontSize14,{padding:0,height:50}]} value={this.state.mbName} onChangeText={(e)=>{this.onChangeName(e)}} placeholder="Name" placeholderTextColor={Color.textGray}></TextInput>
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:4,}}>
                                <View style={styles.phoneView}>
                                    <PickerCustom  pickerTextStyle={styles.pickerTextStyle} selected={this.state.carrierCode == "MVNO" ? "알뜰폰" : this.state.carrierCode} onPress={()=>{this.setState({modalShow : true})}}></PickerCustom>
                                        <TextInput style={{ flex: 1, marginLeft: 10 ,overflow:"hidden"}} numberOfLines={1} placeholder="Please enter your phone number without -." keyboardType="number-pad" onChangeText={(e)=>{this.onChangeMbPhone(e)}} placeholderTextColor={Color.textGray}></TextInput>
                                </View>
                            </View>
                        </View>

                        {/* <View style={{marginTop:21}}>
                            <View style={{borderWidth:1,borderColor:"#D7D6D6",justifyContent:'center',paddingHorizontal:17}}>
                                <TextInput style={[styles.fontSize14,{padding:0,height:50}]} placeholder="인증 번호 6자리를 입력해주세요" onChangeText={(e)=>this.onChangeMbCfCode(e)} placeholderTextColor={Color.textGray}></TextInput>
                            </View>
                        </View> */}
                        
                        <View style={{marginTop:20}}>
                                <RectangleButton disable={this.state.mbPhone.length > 9 && this.state.mbName != "" ? false : true} style={{height:53}} title={"Find my ID"} onPress={()=>{this.findId()}}></RectangleButton>
                        </View>

                        <View style={{marginTop:58}}>
                            <Text style={[styles.fontSize16,{}]}>Please click ‘Find my password’ below to change to a new password if you have forgotten your password.</Text>
                        </View>

                        <View style={{marginTop:30,marginBottom:44}}>
                            <RectangleButton style={{height:53}} title={"Find my password"} onPress={()=>{this.findPw()}}></RectangleButton>
                        </View>
                    </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <BottomTab navigation={this.props.navigation}/>


                <Modal
                    style={styles.modal}
                    isVisible={this.state.modalShow}
                    onBackdropPress={()=>{this.setState({ modalShow :false})}}
                    backdropOpacity={0.5}
                    // backdropColor = {'red'}
                >
                    <View style={styles.modalView}>
                        <View style={{height:50,width:'100%',padding:10,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',borderBottomWidth:1,borderColor:"#D7D6D6"}}>
                                {/* <Text style={[styles.fontSize16,{fontWeight:'600'}]}>carrierCode</Text> */}
                                <TouchableOpacity onPress={()=>{this.setState({modalShow:false})}}>
                                    <Text style={styles.fontSize14}>Cancel</Text>
                                </TouchableOpacity>
                        </View>
                        <View style={{marginTop:20,width:"100%"}}>
                            <FlatList
                                data={this.state.carrierArray}
                                style={{maxHeight:100}}
                                renderItem={({item})=>
                                    <TouchableOpacity style={{width:"100%",}} onPress={()=>{this.setState({carrierCode : item.value,modalShow:false})}}>
                                        <View style={{paddingVertical:10,paddingHorizontal:10,alignItems:'center'}}>
                                            <Text style={styles.fontSize14}>{item.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={(item, index) => `${index}`}
                            />
                        </View>
                    </View>
                </Modal>
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
    warnText:{
        fontSize:11,
        lineHeight:13,
        fontWeight:'400',
        color:"#FF0000"
    },
    pickerTextStyle : {
        fontSize:14,
        lineHeight:17,
        fontWeight:'400',
        color:'#606060'
    },
    phoneView:{
        borderWidth:1,
        borderColor:"#D7D6D6",
        flex:1,
        paddingHorizontal:13,
        height:52,
        flexDirection:'row',
        justifyContent:'center',
        marginRight:10
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
});


export default FindUserIdMain;
