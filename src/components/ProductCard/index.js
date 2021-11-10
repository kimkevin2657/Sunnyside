import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, } from 'react-native';
import { Util , Images} from '@common'
import NavigationService from '@app/navigation/NavigationService';
import RectangleButton from '../_gmcCustom/RectangleButton';

class ProductCard extends React.PureComponent {
    
    render() {
        const { currency } = Util
        const { data, onPress } = this.props;
        return (
            <View>
                <View style={[styles.productBox]}>
                    <ImageBackground source={Images.depositGoodBack} resizeMode="contain" style={styles.backImage} ></ImageBackground>
                    <View style={styles.productTitle}>
                        <Image style={styles.img} source={{uri: data.file_url}}/>
                        <Text style={{fontWeight:'bold'}} numberOfLines={2}>{data.stake_title}</Text>
                    </View>
                    <View style={styles.productContainer}>
                        <View style={styles.productDetail}>
                            <View style={styles.titleContainer}>
                                <Text>Staking Amount</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text>{currency(data.stake_amount)} DFSD</Text>
                            </View>
                        </View>
                        <View style={styles.productDetail}>
                            <View style={styles.titleContainer}>
                                <Text>Annual interest rate </Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text>{data.stake_profit} %</Text>
                            </View>
                        </View>
                        <View style={styles.productDetail}>
                            <View style={styles.titleContainer}>
                                <Text>Deposit period</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text>{data.stake_period} months</Text>
                            </View>
                        </View>
                    </View>
                    <RectangleButton
                        title = 'Apply'
                        onPress = {onPress}
                        style = {{height: 47, borderRadius:10}}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    productBox: {
        borderTopRightRadius:41,
        marginTop: 40,
        marginHorizontal: 16,
        textAlign:'left',
        padding:25,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        position:'relative',
    },
    productTitle:{
        flexDirection: 'row',
    },
    productContainer:{
        marginTop: 20,
        marginBottom: 20,
    },
    productDetail: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    titleContainer: {
        flexGrow: 2,
        flexBasis:2
    },
    valueContainer: {
        justifyContent: 'flex-start',
        flexGrow: 2,
        flexBasis: 2
    },
    backImage: {
        position: 'absolute',
        width: 80,
        height: 80,
        right:0
    },
    img:{
        marginRight :10,
        width:20,
        height:20,
    },
});
export default ProductCard;