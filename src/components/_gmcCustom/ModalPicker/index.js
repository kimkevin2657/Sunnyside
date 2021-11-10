import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Color, FontSize, Styles, Images } from '@common';
import Modal from 'react-native-modal';
import { getStatusBarHeight } from 'react-native-status-bar-height';
class ModalPicker extends React.PureComponent {

    constructor(props) {
        super(props);
    };

    render() {

        let { show, onClose, callback, dataList } = this.props;

        return (
            <Modal
                style={
                    styles.container}
                isVisible={show}
                onBackdropPress={onClose}
                onBackButtonPress={onClose}

                backdropOpacity={0}
                animationInTiming={0.1}
                animationOutTiming={0.1}

            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[styles.ModalContainer]} >
                    <View style={styles.pickerList}>
                        {dataList && dataList.length > 0 && dataList.map((v, i) => {
                            return (
                                <TouchableOpacity onPress={() => { callback(v.value) }} style={styles.pickerItem}><Text style={styles.pickerItemText}>{v.label}</Text></TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>

            </Modal>
        );
    };
};
const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: Color.lineBackgound,
        borderRightColor: Color.lineBackgound,
        borderBottomColor: Color.lineBackgound,
        position: 'absolute',
        top: 149 + getStatusBarHeight(true),
        // width: 95,
        // padding: 0,
        // margin: 0,
        // right: -2,
        // height: 250,
    },
    ModalContainer: {

        backgroundColor: Color.white,
    },
    pickerList: {
        width: 80,
        paddingHorizontal: 18
    },
    pickerItem: {
        paddingVertical: 5,
        borderBottomColor: '#e2e4ec'
    },
    pickerItemText: {
        fontSize: 15,
        color: Color.black,
    }
});

export default ModalPicker;