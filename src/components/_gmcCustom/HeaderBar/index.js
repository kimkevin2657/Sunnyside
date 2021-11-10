import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, ImageBackground } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Color, Images, FontSize,width } from '@common';
import { back } from 'react-native/Libraries/Animated/Easing';
// import { Color } from '@common';

class HeaderBar extends React.PureComponent {
    
    render() {
        const {title,border,style,fontSize,noLeftBtn,iconOnPress} = this.props;
        return (
            <View style={[styles.headerView,{borderBottomWidth:border? 1 : 0}]}>
                {!noLeftBtn &&
                <TouchableOpacity onPress={iconOnPress} style={{justifyContent:'center', position:'relative'}}>
                    <Image source={Images.backArrow} style={styles.headerIcon}></Image>
                </TouchableOpacity>
                }
                <View style={[styles.headerTextView, style, noLeftBtn ? { justifyContent: 'center' } : null]}><Text style={[styles.headerText, { fontSize: fontSize ? fontSize : 18 }, !noLeftBtn ? {paddingRight:24} : null]}>{title}</Text></View>
            </View>
        )
    }
}


const styles = StyleSheet.create({ 
    headerView:{
        height: 60,
        zIndex:999,
        flexDirection:'row',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems:'center',
        borderBottomColor: '#D7D6D6',
        // backgroundColor:'red'
    },
    headerIcon: {
        width:10,
        height: 14,
        resizeMode:'contain',
        // backgroundColor:'blue',
        marginLeft:16
    },
    headerTextView :{
        flex:1,
        // alignItems: 'center',

    },
    headerText: {
        top:-2,
        textAlign:'center',
        // lineHeight:30,
        fontSize:18,
        fontWeight:'bold'
    },
});
export default HeaderBar;
