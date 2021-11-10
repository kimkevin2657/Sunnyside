import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { Color, Styles } from '@common';
import HistoryTabs from '../HistoryTabs';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';

class HistoryMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            leftBtnDisable: true,
            firstPage: true
        }
    }

    goFirstPage = () => {
        this.setState({
            firstPage: true
        })
    }

    goOtherPage = () => {
        this.setState({
            firstPage: false
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <HeaderBar noLeftBtn={this.state.firstPage} iconOnPress={() => { this.props.navigation.replace('HistoryMain') }} title="My Saving"></HeaderBar>
                <View style={styles.productTab}>
                    <HistoryTabs screenProps={{ goFirstPage: this.goFirstPage, goOtherPage: this.goOtherPage }} />
                </View>
                <BottomTab navigation={this.props.navigation} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    productTab: {
        flex: 1,
    }
});


export default HistoryMain;