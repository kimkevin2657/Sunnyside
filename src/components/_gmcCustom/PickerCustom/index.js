import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Color, FontSize, Images } from '@common';

class PickerCustom extends React.PureComponent {

    constructor(props) {
        super(props);
    };

    render() {

        let { selected, onPress, style , pickerTextStyle , pickerStyle ,disabled } = this.props;

        let styleData = style || styles;

        return (
            <TouchableOpacity
                disabled={disabled}
                style={[styles.pickerBtn,pickerStyle]}
                onPress={onPress}
            >
                <View style={styles.pickerContainer}>
                    <Text style={pickerTextStyle}>{selected}</Text>
                </View>
                <View style={{
                    marginLeft: 5,
                }}>
                    <Image style={styleData.arrowImg} source={Images.ArrowDown} />
                </View>
            </TouchableOpacity>
        );
    };
};

const styles = StyleSheet.create({
    pickerBtn: {
        position: 'relative',
        // backgroundColor:'red',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 3,
        paddingRight: 2,
        
    },
    pickerContainer: {
        width: 74,
    },
    pickerText: {
        fontSize: 15,
        color: Color.black,
    },
    arrowImg: {
        width: 10,
        height: 9,
        resizeMode: "contain",
        opacity: 1
    },
});

export default PickerCustom;