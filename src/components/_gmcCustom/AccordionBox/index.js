import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class AccordionBox extends React.PureComponent {
    
    render() {
        const { keyText, valueText, divValueText, borderRadius } = this.props;
        return (
            <View style={[styles.AccordionContent, borderRadius && { borderBottomLeftRadius:20, borderBottomRightRadius:20}]}>
                <View style={styles.AccordionKey}>
                    <Text>{keyText}</Text>
                </View>
                <View style={styles.AccordionValue}>
                    <Text style={{fontWeight:'bold'}}>{valueText} </Text><Text>{divValueText}</Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({ 
    AccordionContent:{
        flex: 1,
        minHeight: 50,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#D7D6D6',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    AccordionKey: {
        flex: 4,
        borderRightWidth: 1,
        borderColor: '#D7D6D6',
        minHeight: 50,
        justifyContent:'center',
        alignItems:'center',

    },
    AccordionValue: {
        flex: 6,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection:'row',
        flexWrap:'wrap',
        marginRight: 10
    },
});
export default AccordionBox;
