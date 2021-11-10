import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';

import HeaderBar from '../../../components/_gmcCustom/HeaderBar'
import BottomTab from '../../../components/_gmcCustom/BottomTab';

class AddCoin extends React.PureComponent {
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
            <View style={[Styles.Wrap, {}]}>
                <HeaderBar iconOnPress={() => { this.props.navigation.goBack() }} title="Add Coin"></HeaderBar>
                <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingHorizontal:64}}>
                    <Image source={Images.loading} style={{width:67,height:67}}></Image>
                    <View style={{marginTop:25,marginBottom:20}}>
                        <Text style={styles.titleText}>
                            <Text>currently</Text>
                            <Text style={{ fontWeight: 'bold' }}> preparing for the service </Text>
                            <Text>is</Text>
                        </Text>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.contentText}>We apologize for the inconvenience,</Text>
                        <Text style={styles.contentText}>but we are preparing the page for better service.</Text>
                        <Text style={styles.contentText}>I'll get ready and come to you as soon as possible.</Text>
                    </View>
                </View>
                <BottomTab navigation={this.props.navigation}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
   titleText : {
    fontSize:18,
    color:"#4A4A4A"
   },
   contentText : {
    fontSize:11,
       color:"#858585"
   }
});


export default AddCoin;
