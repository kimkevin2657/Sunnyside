import React, {Component} from 'react';
import {View, StyleSheet, Text, Dimensions, Platform, Image, BackHandler} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Color, Images } from '@common';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-navigation';
import { store } from '@redux/store';
import SimpleToast from 'react-native-simple-toast';

export default class CustomDrawerMenu extends Component {
  constructor(props) {
      super(props);
    this.state = {
        isFocused: false,
        accessToken :store.getState().user.accessToken,
    }
  }

componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
        console.log('1123123')
        this.setState({
            isFocused: true,
            accessToken :store.getState().user.accessToken,
        })
    });

    this.focusListenerblur = this.props.navigation.addListener("didBlur", () => {
        this.setState({
            isFocused: false,
            accessToken :store.getState().user.accessToken,
        })
    });
    console.log(this.state.isFocused)
}

   
componentWillUnmount() {
    this.focusListener.remove()
    this.focusListenerblur.remove()
}   
  
  logOut=()=>{
      let user = {
        accessToken: '',
        refreshToken : '',
        useLock: "N",
        pinPassword : "",
        lockType : "pin",
        moneyType: "SGD",
      }
      store.dispatch({
          type: 'SET_USER',
          payload: user,
      });

      this.setState({
            accessToken :"",
      })

      SimpleToast.show('logout finish', SimpleToast.SHORT)
      this.props.navigation.navigate('GmcLoginScreen')
  }
   
  render() {
      const itemsList = [
        {
            navOptionName: 'Deposit',
          screenToNavigate: 'ProductMain',
        },
        {
          navOptionName: 'Wallet',
          screenToNavigate: 'WalletMain',
        },
        {
          navOptionName: 'Notice',
          screenToNavigate: 'NoticeMain',
        }
      ];
    
    return (
        <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', horizontal: 'never'}}
      >            
        <View style={{flex:1,paddingHorizontal:25}}>
            <View style={{height:60,paddingTop:Platform.OS == "ios" ? 20 :10}}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.closeDrawer(), store.dispatch({
                            type: 'CLOSE',
                        })
                    }}>
                  <Image style={styles.closeImg} source={Images.close}/>
                </TouchableOpacity>
            </View>
            <View style={{borderBottomWidth:1,borderColor:"#EAEAEA",marginBottom:20,paddingBottom:20}}>
                <FlatList
                    scrollEnabled={false}
                    data={itemsList}
                    renderItem={({item})=>
                        <>
                        <View style={{flexDirection:'row',paddingVertical:20}}>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate(item.screenToNavigate),this.props.navigation.closeDrawer()}}>
                               {/* <View><Text style={{fontSize:16,fontWeight:'bold'}}>{item.navOptionName}</Text></View>  */}
                               <View><Text style={{fontSize:16,fontWeight:'bold'}}>{item.navOptionName}</Text></View>
                            </TouchableOpacity>
                        </View>
                        </>
                    }
                    keyExtractor={(item, index) => `${index}`}
                />
            </View>
            <View>
                {store.getState().user.accessToken == "" 
                  ?
                  <>
                    <View style={{flexDirection:'row',paddingVertical:20}}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("GmcLoginScreen")}}>
                            <View><Text style={{fontSize:16,fontWeight:'bold'}}>Login</Text></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',paddingVertical:20}}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("GmcSingUpScreen")}}>
                            <View><Text style={{fontSize:16,fontWeight:'bold'}}>SignUp</Text></View>
                        </TouchableOpacity>
                    </View>
                  </>
                  :
                  <>
                  <View style={{flexDirection:'row',paddingVertical:20}}>
                    <TouchableOpacity onPress={() =>{this.props.navigation.navigate("MyPageMain")}}>
                        <View><Text style={{fontSize:16,fontWeight:'bold'}}>Mypage</Text></View>
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection:'row',paddingVertical:20}}>
                        <TouchableOpacity onPress={()=>{this.logOut()}}>
                            <View><Text style={{fontSize:16,fontWeight:'bold'}}>Logout</Text></View>
                        </TouchableOpacity>
                    </View>
                  </>
                }
            </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
  },
  drawerProfileIcon: {
    resizeMode: 'center',
    width: 150,
    height: 150,
    marginTop: 20,
  },
  closeImg: {
    height: 20,
    width: 20,
    marginTop: 10
  }
});