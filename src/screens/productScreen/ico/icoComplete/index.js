import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    ScrollView,
    BackHandler
} from 'react-native';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';

class IcoComplete extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.navigation.getParam('title', ''),
            amount: this.props.navigation.getParam('amount', ''),
            period: this.props.navigation.getParam('period', ''),
            type: this.props.navigation.getParam('type', ''),
        };
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }

    handleBackPress = () => {
        this.props.screenProps.goFirstPage()
        this.props.navigation.navigate('IcoMain');
        return true;
    }

    render() {
        return(
            <ScrollView style={{backgroundColor:'white'}} contentContainerStyle={{flexGrow:1}}>
                <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>The {this.state.type} purchase has been completed.</Text>
                    <Text style={styles.completeDesc}>Payment completion detail</Text>
                    <View style={styles.resultContainer}>
                        <Text style={styles.statusTitle}>{this.state.title}</Text>
                        <View style={styles.resultDescContainer}>
                            <Text style={{fontSize: 15, color: '#858585'}}>{this.state.type} amount</Text>
                            <Text style={{fontSize: 15, color: '#858585'}}>{this.state.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {this.state.type}</Text>
                        </View>
                        <View style={styles.resultDescContainer}>
                            <Text style={{fontSize: 15, color: '#858585'}}>Lock-up period</Text>
                            <Text style={{fontSize: 15, color: '#858585'}}>{this.state.period} days</Text>
                        </View>
                    </View>
                    <RectangleButton
                        title='Confirm'
                        fontSize={16}
                        style={{height:54, borderRadius:10}}
                        onPress={() => {
                            this.props.screenProps.goFirstPage()
                            this.props.navigation.navigate('IcoMain')
                        }}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    completeContainer: {
        marginHorizontal: 16
    },
    completeTitle: {
        textAlign: 'left',
        paddingTop: 30,
        marginBottom: 40,
        fontSize: 20,
        color: '#292929',
        lineHeight: 20,
        fontWeight: '700'
    },
    completeDesc: {
        fontSize: 15,
        marginBottom: 20
    },
    statusTitle: {
        color: '#292929',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    resultContainer: {
        padding:20,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        position:'relative',
        marginBottom: 40,
    },
    resultDescContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default IcoComplete;