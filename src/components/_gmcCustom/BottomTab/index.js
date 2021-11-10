import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Images from '@common/Images'
import { store } from '@redux/store';

class BottomTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: store.getState().user.accessToken != "" ? true : false
        }
    }
    
    render() {
        const { navigation } = this.props;
        const { isAuth } = this.state;
        return (
            <View style={{ position:'relative'}}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={styles.tabItem} onPress={() => navigation.push('WalletMain')}>
                        <Image source={Images.m_wallet} style={styles.tabImage}/>
                        <Text style={styles.tabText}>Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ProductMain')}>
                        <Image source={Images.m_goods} style={styles.tabImage}/>
                        <Text style={styles.tabText}>Product</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.tabItem} onPress={() => isAuth ? navigation.navigate('HistoryMain') : navigation.navigate('GmcLoginScreen')}>
                        <Image source={Images.m_my} style={styles.tabImage}/>
                        <Text style={styles.tabText}>List</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({ 
    tabContainer: {
        height: 60,
        backgroundColor:'#F4F4F4',
        flexDirection: 'row',
        // position: 'absolute',
        // bottom: 0,
        // zIndex: 999999,
        width: "100%",
       
    },
    tabItem: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    tabImage: {
        height: 20,
        width: 20,
        marginVertical: 5
    },
    tabText: {
        fontSize: 11,
        color: '#B5B5B5'
    }
});
export default BottomTab;
