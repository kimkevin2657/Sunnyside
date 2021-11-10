import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, ImageBackground } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Color } from '@common';

class RoundButton extends React.PureComponent {
    
    render() {
        const {title,onPress,style,fontSize,icon,fontWeight} = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.btnView,style]}>
                    {icon&&
                    <Image style={{width:14,height:14,marginBottom:4}} source={icon}></Image>
                    }
                    <View><Text style={{fontSize:fontSize? fontSize : 13,color:Color.white,fontWeight:fontWeight}}>{title}</Text></View>
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({ 
    btnView:{
        width:70,
        height:70,
        borderRadius:50,
        backgroundColor:'#1B2937',
        alignItems:'center',
        justifyContent:'center'
    },
});
export default RoundButton;
