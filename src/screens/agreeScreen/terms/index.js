import React from 'react';
import { BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';


class Terms extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: this.props.navigation.getParam('page', '')
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.navigation.navigate(`${this.state.page}`);
        return true;
    }

    onNavigationStateChange(webViewState){
        console.log(webViewState.url)
    }

    render() {
        console.log(this.state.type);
        return (
            <WebView
                source={{ uri: 'http://221.168.38.145:3000/termsAndConditions/Deposit_m' }}
                onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            />
        );
    }
}

export default Terms;
