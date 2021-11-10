import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import { Color, Images } from '@common';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();

class TermsAndPolicyMain extends React.PureComponent {
    constructor(props) {
        super(props);
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
        const itemsList = [
            {
                navOptionName: 'Terms of Service',
                screenToNavigate: 'TermsOfService',
            },
            {
                navOptionName: 'Privacy Processing',
                screenToNavigate: 'PrivacyPolicy',
            },
            {
                navOptionName: 'Terms of Deposit',
                screenToNavigate: 'TermsOfDeposit',
            },
        ];

        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={() => { this.props.navigation.goBack() }} title="terms and Policies"></HeaderBar>
                <FlatList
                    data={itemsList}
                    renderItem={({item})=> 
                        <TouchableOpacity onPress = {() => this.props.navigation.navigate(item.screenToNavigate)}>
                            <View style={styles.elementContainer}>
                                <Text style={styles.elementTitle}>{item.navOptionName}</Text>
                                <Icon name="chevron-forward" style={styles.icon}/>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => `${index}`}
                />
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        height: 52,
        marginHorizontal: 20,
    },
    bodyContainer: {
        flex: 1,
        marginHorizontal: 15,
        marginTop: 40,
        marginBottom: 60
    },
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#BEBEBE',
        paddingBottom: 20,
    },
    contentContainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    inquiryTitle: {
        fontSize: 16,
        color: '#4A4A4A',
        fontWeight: 'bold'
    },
    noContents: {
        fontSize: 16,
        color: '#4A4A4A',
    },
    walletIcon: {
        height: 70,
        width: 90,
        marginBottom: 25
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


export default TermsAndPolicyMain;
