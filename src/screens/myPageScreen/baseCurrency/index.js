import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    BackHandler,
    Image
} from 'react-native';
import { Color, Images } from '@common';
import BottomTab from '../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../components/_gmcCustom/HeaderBar';
import { store } from '@redux/store';

class BaseCurrency extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedIdx: 0,
            moneyType : store.getState().user.moneyType || "moneyType",
        };
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

    onChangBaseCurrencye=(index,item)=>{
        let user = {
            moneyType : item.value
        }
        store.dispatch({
            type: 'SET_USER',
            payload: user,
        });
        this.setState({ 
            moneyType : item.value
        })
    }

    render() {
        const itemList = [
            {
                name: 'KRW - SouthKorea Won',
                value : 'KRW'
            },
            // {
            //     name: 'CAD - Canadian Dollar'
            // },
            // {
            //     name: 'AUD - Australian Dollar'
            // },
            // {
            //     name: 'CNY - Chinese Yuan Renminbi'
            // },
            // {
            //     name: 'HKD - Hong Kong dollar'
            // },
            // {
            //     name: 'EUR - Euro'
            // },
            // {
            //     name: 'GBP - British Pound'
            // },
            // {
            //     name: 'THB - Thai Baht'
            // },
            {
                name: 'USD - US Dollar',
                value : 'USD'
            },
            // {
            //     name: 'ZAR - South African Rand'
            // },
            // {
            //     name: 'JPY - Japanese Yen'
            // },
            // {
            //     name: 'SGD - Singapore dollar'
            // },
            
        ];

        return (
            <SafeAreaView style={{flex:1, backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="Exchange currency"></HeaderBar>
                <FlatList 
                    data={itemList}
                    renderItem={({item, index})=>
                    {
                        return(
                        <TouchableOpacity onPress = {() =>this.onChangBaseCurrencye(index,item)} disabled={item.value !== "KRW" && item.value !=="SGD"}>
                            <View style={[styles.contentBox, this.state.selectedIdx == index && {backgroundColor:'#FAFAFA'}]}>
                                <Text style={{color: '#4A4A4A'}}>{item.name}</Text>
                                {this.state.selectedIdx == index && <Image source={Images.check} style={styles.img}/>}
                            </View>
                        </TouchableOpacity>
                        )
                    }
                    }
                    keyExtractor={(item, index) => `${index}`}
                />
                <BottomTab navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    img:{
        width:12,
        height:10,
    },
    contentBox: {
        height: 47,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    }
});


export default BaseCurrency;
