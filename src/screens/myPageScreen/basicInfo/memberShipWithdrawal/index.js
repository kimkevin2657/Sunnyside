import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    BackHandler,
    FlatList,
    Linking
} from 'react-native';
import { Color } from '@common';
import { commonApi } from '@common/ApiConnector';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton'
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import AwesomeAlert from 'react-native-awesome-alerts';
import SimpleToast from 'react-native-simple-toast';
import { store } from '@redux/store';

class MemberShipWithdrawal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            historyList: []
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
        return false;
    }

    logOut = () => {
 
        store.dispatch({
            type: 'CLEAR_USER',
        });
    }

    componentDidMount() {
        this.logOut()
    }

    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <View style={{flex:1}}>
                    <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="Delete Account"></HeaderBar>
                    <View style={styles.bodyContainer}>
                        
                        <Text style={styles.textContent}>If you want to withdraw please check the following.</Text>
                        <Text style={styles.textContent_one}>*You have a current balance. If you have coins in the Defiance Wallet, you cannot withdraw.</Text>
                        <Text style={styles.textContent_two}>*If you want to opt out, you can do so through </Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:service@gmc-labs.com')}>
                                            <Text style={{color: '#000000',marginLeft:30,marginRight:5}}>service@gmc-labs.com </Text>
                            </TouchableOpacity>
                            <Text style={styles.textContent_two_mid}>or </Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CustomerCenter')}>
                                            <Text style={{color: '#000000', marginRight:30,marginLeft:5, marginBottom:20}}>contact us.</Text>
                            </TouchableOpacity>
                        </View>
                        
                        
                        <Text style={styles.textContent_three}>*If you leave, all transaction details and usage information will be deleted and cannot be restored.</Text>
                        
                        <RectangleButton
                            onPress = {() => this.props.navigation.navigate('GmcLoginScreen')}
                            title = {'Go to Login'}
                            fontSize = {13}
                            style = {styles.btnStyle}
                        />
                    </View>
                </View>
                <View style={{height:50}}/>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        height: 45,
        marginHorizontal: 25,
        marginBottom: 10,
        marginTop: 20,
        borderRadius:10, 
    },
    bodyContainer: {
        flex:1,
        marginTop: 25,
        marginHorizontal: 15,
    },
    textContent: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4A4A',
        marginBottom: 30,
        marginHorizontal:30
    },
    textContent_one: {
        fontSize: 14,
        color: '#4A4A4A',
        marginBottom: 30,
        marginHorizontal:30
    },
    textContent_two: {
        fontSize: 14,
        color: '#4A4A4A',
        marginHorizontal:30
    },
    textContent_two_mid: {
        fontSize: 14,
        color: '#4A4A4A',
        
    },
    textContent_three: {
        fontSize: 14,
        color: '#ff0000',
        marginBottom: 30,
        marginHorizontal:30
    },
    tableContainer: {
        flex:1,
        borderColor: '#D7D6D6',
        borderWidth: 0.5,
        marginTop: 20
    },
    attributeContainer: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
    },
    tupleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tableText: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 12,
        color: '#4A4A4A'
    },
    timeText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#4A4A4A'
    }
});


export default MemberShipWithdrawal;
