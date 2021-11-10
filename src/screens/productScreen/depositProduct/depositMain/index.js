import React from 'react';``
import { commonApi } from '@common/ApiConnector';
import ProductCard from '../../../../components/ProductCard';
import NavigationService from '@app/navigation/NavigationService';
import { SafeAreaView, View, StatusBar, StyleSheet, Image, Alert, Linking, TouchableOpacity, BackHandler,Text, ScrollView } from 'react-native';
import { Color, FontSize, Styles, Images, Util } from '@common';
import { color } from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';

import HeaderBar from '@components/_gmcCustom/HeaderBar'
import BottomTab from '@components/_gmcCustom/BottomTab';

class DepositMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            depositList: [],
        }
    }



    componentWillUnmount(){
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    getDepositInfoList() {
        const response = commonApi('post', `/staking/open/getStakingInfoList`);
        response.then( ({data}) => {
            this.setState({
                depositList: data.stakingList
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.getDepositInfoList()
    }

    render() {
        // 스테이킹 수정중 임시
        // return (
        //     <SafeAreaView style={[Styles.Wrap, {}]}>
        //         {/* <HeaderBar iconOnPress={()=>{this.props.navigation.goBack()}} title="코인 추가하기"></HeaderBar> */}
        //         <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        //             <Image source={Images.loading} style={{width:86,height:86}}></Image>
        //             <View style={{marginTop:40,marginBottom:20}}>
        //                 <Text style={styles.titleText}>
        //                     <Text>현재</Text>
        //                     <Text style={{fontWeight:'bold'}}> 서비스 준비중 </Text>
        //                     <Text>입니다.</Text>
        //                 </Text>
        //             </View>
        //             <View style={{alignItems:'center'}}>
        //                 <Text style={styles.contentText}>이용에 불편을 드려 죄송합니다.</Text>
        //                 <Text style={styles.contentText}>보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다.</Text>
        //                 <Text style={styles.contentText}>빠른 시일내에 준비하여 찾아뵙겠습니다.</Text>                        
        //             </View>
        //         </View>
        //         {/* <BottomTab navigation={this.props.navigation}/> */}
        //     </SafeAreaView>
        // );

        //이전
        return(
            <View style={{backgroundColor:'white'}} contentContainerStyle={{flexGrow:1}}>
            {this.state.depositList.length != 0 ?
                    <FlatList
                        contentContainerStyle={{paddingBottom:40}}
                data={this.state.depositList}
                keyExtractor={(item, index) => `${item.stakeIdx}${index}`}
                renderItem = { ({item}) => 
                    <ProductCard
                        data={item}
                        onPress={() => this.props.navigation.navigate('DepositRegister',{
                            stakeIdx: item.stake_idx,
                            coinType: item.coin_type
                        })}
                    />
                }
                // ListEmptyComponent = {
                //     <View style={{flex:1, alignItems:'center', marginTop: 30}}>
                //         <Text style={{color: 'grey'}}>예치상품이 없습니다.</Text>
                //     </View>
                // }
            /> :
            <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
                <Text style={{color: 'grey'}}>no deposit product item</Text>
            </View>
            }
            <View style={{paddingBottom:50}}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
   titleText : {
    fontSize:20,
    color:"#4A4A4A"
   },
   contentText : {
    fontSize:15,
    color:"#4A4A4A"
   }
});

export default DepositMain;