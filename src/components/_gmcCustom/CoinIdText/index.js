import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Image} from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import SimpleToast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
class CoinIdText extends React.PureComponent {
    
    textCopy=(coinId)=>{
        Clipboard.setString(coinId)
        SimpleToast.show("copy clipboard.", SimpleToast.SHORT)
    }

    render() {
        const { coinId ,onPress} = this.props;
        return (
            <>
            <View style={{flex:1,paddingRight:20}}>
                <Text style={{fontSize:10,lineHeight:16,fontWeight:'400'}}>{coinId}</Text>
            </View>
            {/* <View style={{width:18,height:18,backgroundColor:'red'}}></View> */}
            <TouchableOpacity onPress={()=>{this.textCopy(coinId)}}><Image source={Images.clarity_copy_line} style={{width:18,height:18}}></Image></TouchableOpacity>
            </>
        );
    }
}


const styles = StyleSheet.create({ 
    AccordionContent:{
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#D7D6D6',
        flexDirection: 'row',
    },
    AccordionKey: {
        flex: 3,
        borderRightWidth: 1,
        borderColor: '#D7D6D6',
        justifyContent:'center',
        alignItems:'center'
    },
    AccordionValue: {
        flex: 7,
        justifyContent:'center',
        paddingLeft: 10,
    },
});
export default CoinIdText;
