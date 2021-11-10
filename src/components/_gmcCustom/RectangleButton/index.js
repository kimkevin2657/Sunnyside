import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, ImageBackground } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Color } from '@common';

class RectangleButton extends React.PureComponent {
    
    render() {
        const { center , title, onPress, style, fontSize, disable, textColor,fontWeight} = this.props;
        return (
            !disable ? 
            <TouchableOpacity onPress={onPress} style={[styles.coinPlus,style]}>
                    <Text style={[{ color: textColor ? textColor : "#fff",fontWeight:fontWeight?fontWeight:null, fontSize: fontSize ? fontSize : 16 },center ? { textAlign: 'center' } : null]}>{title}</Text>
            </TouchableOpacity>
            :
            <View style={[styles.disable,style]}>
                    <Text style={[{ color: textColor ? textColor : "#fff", fontSize: fontSize ? fontSize : 16 }, center ? { textAlign: 'center' } : null]}>{title}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({ 
    coinPlus:{
        // flex:1,
        // width:"100%",
        // height:50,
        backgroundColor:"#1B2937",
        color: "#fff",
        justifyContent:'center',
        alignItems:'center'
        // marginTop:"40px"
    },
    disable:{
        backgroundColor:"#bebebe",
        color: "#fff",
        justifyContent:'center',
        alignItems:'center'
        // marginTop:"40px"
    },
});
export default RectangleButton;
