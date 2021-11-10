import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    BackHandler,
    Image
} from 'react-native';
import { Color, Images } from '@common';
import { commonApi } from '@common/ApiConnector';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton'
import { store } from '@redux/store';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';

class BasicInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            phone: ''
        };
    }

    logOut = () => {
 
        store.dispatch({
            type: 'CLEAR_USER',
        });

        SimpleToast.show('logout finish', SimpleToast.SHORT)
        this.props.navigation.navigate('GmcLoginScreen')
    }


    getBasicInfo() {
        const response = commonApi('post', `/mypage/myInfo`);
        response.then( ({data}) => {
            console.log('info data ::: ',data)
            this.setState({
                email: data.member.mb_id,
                name: data.member.mb_full_name,
                phone: data.member.mb_phone_no
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    updateInfo(){
        let params = {
            process : "updateInfo"
        } 

        // let resultId = "test@test.kr"
        // console.log("params :: ",params)

        this.props.navigation.navigate("IamportMain",{certData : params})
    }

    componentDidMount() {
        this.getBasicInfo();
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <View style={{flex:1}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="My info"></HeaderBar>
                    <View style={styles.contentsContainer}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.title}>Name</Text>
                                <Text style={styles.contents}>{this.state.name}</Text>
                        </View>
                    </View>
                    <View style={[styles.contentsContainer, {borderBottomWidth: 1, borderBottomColor: '#F0EFEF'}]}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.title}>Phone</Text>
                            <View style={styles.multiContents}>
                                <TouchableOpacity onPress = {()=>this.updateInfo()}>
                                    <Text style={styles.contentsPhone}>{this.state.phone}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentsContainer}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.title}>Your DFians Wallet ID</Text>
                            <Text style={styles.contents}>{this.state.email}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.contentsContainer, {borderBottomWidth: 1, borderBottomColor: '#F0EFEF'}]} onPress = {() => this.props.navigation.navigate('ManagementLogin')}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.title}>Manage your sign in</Text>
                            <Image source={Images.rightArrow} style={styles.arrowIcon}></Image>
                        </View>
                    </TouchableOpacity>
                    <RectangleButton
                        onPress = {() => this.logOut()}
                        title = {'Logout'}
                        style = {styles.btnStyle}
                    />
                </View>
                <BottomTab navigation = {this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    contentsContainer: {
        paddingHorizontal: 15
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        alignItems:'center',
    },
    title: {
        fontSize: 14,
        color: '#4A4A4A'
    },
    contents: {
        fontSize: 14,
        color: '#9A9A9A',
        marginRight: 10
    },
    contentsPhone: {
        fontSize: 14,
        color: '#333333',
        marginRight: 10
    },
    arrowRight: {
        backgroundColor:'grey',
        width:14,
        height:14,
        borderRadius:50,
    },
    multiContents: {
        flexDirection: 'row',
        alignItems:'center'
    },
    btnStyle: {
        height: 52,
        marginTop: 40,
        marginHorizontal: 40,
    },
    arrowIcon : {
        width:10,
        height:14,
        marginRight: 10
    },
});


export default BasicInfo;
