import React from 'react';
import { WebView} from 'react-native-webview';
import { SafeAreaView, BackHandler } from 'react-native';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';


class TermsOfDeposit extends React.PureComponent {
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
        return (
            <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="terms"></HeaderBar>
                <WebView
                    source={{ uri: 'http://221.168.38.145:3000/termsAndConditions/Deposit_m' }}
                />
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

export default TermsOfDeposit;
