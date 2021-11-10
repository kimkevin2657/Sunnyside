import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { Color, Styles } from '@common';
import ProductTabs from '../ProductTabs';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';

class ProductMain extends React.PureComponent {
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
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar noLeftBtn={this.state.firstPage} iconOnPress={()=>{this.props.navigation.replace('ProductMain')}} title="Product"></HeaderBar>
                <View style={styles.productTab}>
                    <ProductTabs screenProps = {{goFirstPage: this.goFirstPage, goOtherPage: this.goOtherPage}}/>
                </View>
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    productTab: {
        flex:1,
    }
});


export default ProductMain;
