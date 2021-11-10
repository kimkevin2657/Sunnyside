import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    ScrollView,
    BackHandler,
    Alert,
    Platform
} from 'react-native';
import { commonApi } from '@common/ApiConnector';
import NavigationService from '@app/navigation/NavigationService';
import EventCard from '../../../../components/EventCard';

class IcoMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            icoList: [],
            nowTime: '',
        };
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    getIcoInfoList() {
        const response = commonApi('post', `/ieo/open/getIeoInfoList`);
        response.then( ({data}) => {
            this.setState({
                icoList: data.ieoList
            })
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        let parentNavigation = this.props.navigation.dangerouslyGetParent();
        let prevRoute = parentNavigation.state.routes[parentNavigation.state.index];
        console.log(prevRoute.routeName, 'IcoMain')
        let date = parseInt(new Date().getTime() / 1000 + 60 * 60 * 9)
        this.setState({
            nowTime: date
        })
        setInterval(() => {
            date = parseInt(new Date().getTime() / 1000 + 60*60*9)
            this.setState({
                nowTime: date
            })
        }, 1000)
        this.getIcoInfoList();
    }

    render() {

        let proceedingList = [];
        let completeList = [];
        this.state.icoList.length != 0 && this.state.icoList.map( (value) => {
            let endTime = parseInt(new Date(value.ieo_end_date.split('.')[0]).getTime() / 1000);
            if(Platform.OS == 'ios') endTime += 60*60*9;
            if(value.ieo_state == 1 && this.state.nowTime <= endTime) proceedingList.push(value);
            else if(value.ieo_state == 2 && this.state.nowTime <= endTime) completeList.push(value);
        })

        return(
            <ScrollView style={{ backgroundColor: 'white' }} contentContainerStyle={{ flexGrow: 1 }}>
                <FlatList
                    data={proceedingList}
                    contentContainerStyle={{paddingBottom:50}}
                    ListHeaderComponent={() =>
                        <Text style={styles.mainTitle}>Ongoing ICO Events</Text>
                    }
                    
                    keyExtractor={(item, index) => `${item.ieo_title}${index}`}
                    renderItem = { ({item}) => 
                        item.ieo_state == 1 &&
                        <EventCard
                            proceeding
                            cardTitle = {item.ieo_title}
                            btnTitle = {item.ieo_buy_title}
                            nowTime = {this.state.nowTime}
                            endDate = {item.ieo_end_date}
                            onPress = {() => {
                                this.props.screenProps.goOtherPage()
                                this.props.navigation.navigate('IconRegister', {
                                    seq: item.seq,
                                    coinType: item.coin_type
                                })
                            }}
                        />
                    }
                    ListEmptyComponent = {
                        <View style={{flex:1, alignItems:'center', paddingTop: 50}}>
                            <Text style={{color: 'grey'}}>no ICO Events.</Text>
                        </View>
                    }
                />
                <Text style={styles.mainTitle}>UPCOMING EVENTS</Text>
                <FlatList
                    data={completeList}
                    keyExtractor={(item, index) => `${item.ieo_buy_title}${index}`}

                    renderItem = { ({item}) => 
                        item.ieo_state == 2 &&
                        <EventCard
                            cardTitle = {item.ieo_title}
                            btnTitle = {item.ieo_buy_title}
                            nowTime = {this.state.nowTime}
                            endDate = {item.ieo_end_date}
                        />
                    }
                    ListEmptyComponent = {
                        <View style={{flex:1, alignItems:'center', paddingTop: 50}}>
                            <Text style={{color: 'grey'}}>no UPCOMING EVENT</Text>
                        </View>
                    }
                />
                <View style={{height:50}}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainTitle: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4A4A'
    }
});

export default IcoMain;