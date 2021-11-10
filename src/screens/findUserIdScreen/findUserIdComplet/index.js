import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView, ImageBackground, TextInput } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import RectangleButton from '../../../components/_gmcCustom/RectangleButton';
import { commonApi } from '@common/ApiConnector';
import { store } from '@redux/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import SimpleToast from 'react-native-simple-toast';

class FindUserIdComplet extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            resultData : this.props.navigation.getParam('resultData'),
            resultId : "",
        }


    } 

    findId() {

        let param = {
            mb_phone_no : this.props.navigation.getParam('resultData').certData.mbPhone,
        }
        console.log("before",param)
            const findResult = commonApi('post', 'member/open/memberIdSend', param)
                    .then((result) => {
                    console.log(" find iddd result:::",result)
                    this.setState({
                        resultId:result
                    })
                    })
                    .catch((error) => {
                    console.log('error', error)
                    SimpleToast.show('connection refused. please try again', SimpleToast.SHORT)
                    this.props.navigation.navigate("GmcLoginScreen")
                    }) 
    }

    componentDidMount() {

        this.findId()

        
    }
    


    render() {
        
        return (
            <SafeAreaView style={[Styles.Wrap, {}]}>
                <HeaderBar noLeftBtn title="Find your ID"></HeaderBar>
                <KeyboardAwareScrollView  extraScrollHeight={Platform.OS ==='ios' ? 100: 0} >
                    <ScrollView style={Styles.ScrollContainer}>
                    <View style={styles.container}>
                        <View style={{marginTop:40}}>
                            <Text style={styles.fontSize16}>Your registered id is</Text>
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={styles.fontSize20}>
                                {this.state.resultId?.data?.mb_id === undefined ? "" : this.state.resultId.data.mb_id}
                            </Text>
                        </View>

                        <View style={{marginTop:58,}}>
                            <RectangleButton style={{height:53}} title={"Go back to Login"} onPress={()=>{this.props.navigation.navigate("GmcLoginScreen")}}></RectangleButton>
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
    fontSize16:{
        fontSize:16,
        lineHeight:20,
        fontWeight:'400'
    },
    fontSize20 : {
        fontSize:20,
        fontWeight:'500',
        lineHeight:24,
    }
});


export default FindUserIdComplet;
