import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    BackHandler,
    Alert
} from 'react-native';
import { Color } from '@common';
import BottomTab from '../../../components/_gmcCustom/BottomTab'
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();

class MyPageMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = ()=>{
        // let parentNavigation = this.props.navigation.dangerouslyGetParent();
        // let prevRoute = parentNavigation.state.routes[parentNavigation.state.index];
        // console.log(prevRoute)
        // if(prevRoute.routeName === 'MyPageMain'){
        //     Alert.alert('',"exit app?", [
        //         {
        //             text: "cancel",
        //             onPress: () => false,
        //             style: "cancel"
        //         },
        //         { text: "confirm", onPress: () => BackHandler.exitApp() }
        //     ]);
        //     return true;
        // }else{
        //     return false;
        // }
        this.props.navigation.pop()
    }
    componentDidMount() {
        console.log(this.props.navigation, '47')

    }

    render() {
        const itemsList = [
            {
                navOptionName: 'My info',
                screenToNavigate: 'BasicInfoMain',
            },
            {
                navOptionName: 'My password',
                screenToNavigate: 'SetPassword',
            },
            {
                navOptionName: 'Google OTP',
                screenToNavigate: 'OtpStep1',
            },
            {
                navOptionName: 'Wallet address',
                screenToNavigate: 'ManagementWalletAddr',
            },
            {
                navOptionName: 'Referral',
                screenToNavigate: 'Recommender',
            },
            // {
            //     navOptionName: 'Exchange currency',
            //     screenToNavigate: 'BaseCurrency',
            // },
            {
                navOptionName: 'App lock password',
                screenToNavigate: 'AppLockMain',
            },
            {
                navOptionName: 'Notification settings',
                screenToNavigate: 'PushSetting',
            },
            // {
            //     navOptionName: 'Push List',
            //     screenToNavigate: 'PushMain',
            // },
            {
                navOptionName: 'My Inquiry',
                screenToNavigate: 'InquireMain',
            },
            {
                navOptionName: 'Terms and policy',
                screenToNavigate: 'TermsAndPolicyMain',
            },
            {
                navOptionName: 'app version',
                screenToNavigate: '',
            },
        ];

        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <View style={styles.headerContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.bannerText}>My page</Text>
                    </View>
                </View>
                <FlatList
                    data={itemsList}
                    renderItem={({item})=> 
                        !(item.navOptionName == 'app version') ?
                        <TouchableOpacity onPress = {() => this.props.navigation.navigate(item.screenToNavigate)}>
                            <View style={styles.elementContainer}>
                                <Text style={styles.elementTitle}>{item.navOptionName}</Text>
                                <Icon name="chevron-forward" style={styles.icon}/>
                            </View>
                        </TouchableOpacity> : 
                        <View style={styles.elementContainer}>
                            <Text style={styles.elementTitle}>{item.navOptionName}</Text>
                            <Text style={[styles.elementTitle, {marginRight: 10}]}>{'1.0.0'}</Text>
                        </View>
                    }
                    keyExtractor={(item, index) => `${index}`}
                />
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor:'#D7D6D6'
    },
    productTab: {
        flex:1,
    },
    textContainer: {
        flex:1
    },
    bannerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop:18,
        paddingBottom: 15,
    },
    elementContainer: {
        height: 50,
        backgroundColor: '#FaF9F9',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    elementTitle: {
        fontSize: 17,
        color: '#4A4A4A'
    },
    icon: {
        fontSize: 25,
        color: '#9A9A9A'
    }
});


export default MyPageMain;
