import React from 'react';
import { View, Text, StyleSheet, Platform,} from 'react-native';
import RectangleButton from '../../components/_gmcCustom/RectangleButton';

class EventCard extends React.PureComponent {

 calcDays = function(days,addday) {
    var date = new Date(days.split('.')[0]);
    date.setDate(date.getDate() + addday);
    return date;
}
    render() {
        const { onPress, proceeding, endDate, cardTitle, btnTitle, nowTime} = this.props;
        let endTime = parseInt(this.calcDays(endDate,1).getTime() / 1000)
        if(Platform.OS == 'ios') endTime += 60*60*9
        let leftDays = parseInt((endTime - nowTime) / 86400)
        let leftHours = parseInt((endTime - nowTime) % 86400 / 3600)
        if(leftHours / 10 < 1) leftHours = '0'+leftHours.toString()
        let leftMinutes = parseInt((endTime - nowTime) % 86400 % 3600 / 60)
        if(leftMinutes / 10 < 1) leftMinutes = '0'+leftMinutes.toString()
        let leftSeconds = parseInt((endTime - nowTime) % 86400 % 3600 % 60)
        if(leftSeconds / 10 < 1) leftSeconds = '0'+leftSeconds.toString()

        return (
            <View>
                {nowTime <= endTime &&
                <View style={[styles.productBox, !proceeding && {backgroundColor: '#CCCBCB'}]}>
                    <Text style={styles.productTitle}>
                        {cardTitle}
                    </Text>
                    <View style={styles.productContainer}>
                        {proceeding ?
                        <>
                            <View style={styles.textContainer}>
                            <Text style={styles.timeStyle}>{leftDays / 10 < 1 ? '0'+leftDays.toString() : leftDays}</Text>
                                <Text style={styles.textStyle}>DAYS</Text>
                            </View>
                            <View style={styles.textContainer}>
                            <Text style={styles.timeStyle}>{leftHours}</Text>
                                <Text style={styles.textStyle}>HOURS</Text>
                            </View>
                            <View style={styles.textContainer}>
                            <Text style={styles.timeStyle}>{leftMinutes}</Text>
                                <Text style={styles.textStyle}>MINUTES</Text>
                            </View>
                            <View style={styles.textContainer}>
                            <Text style={styles.timeStyle}>{leftSeconds}</Text>
                                <Text style={styles.textStyle}>SECONDS</Text>
                            </View>
                        </>
                        :
                        <View>
                            <Text style={styles.dDayStyle}>D-{leftDays < 0 ? 0 : leftDays}</Text>
                        </View>
                        }
                    </View>
                    {proceeding && <Text style={styles.endEventText}> Event Ends: {endDate.split('T')[0].replace(/-/gi, '.')}</Text>}
                    {proceeding ? 
                        <RectangleButton
                            title = {btnTitle}
                            onPress = {onPress}
                            style = {{height: 52, borderRadius:10}}
                        />
                        :
                        <RectangleButton
                            disable
                            title = {btnTitle}
                            style = {{height: 52, borderRadius:10}}
                        />
                    }
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    productBox:{
        marginTop: 40,
        marginHorizontal: 16,
        padding:30,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#BEBEBE",
        position: 'relative',
    },
    productContainer:{
        marginTop: 20,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
    },
    productTitle:{
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textContainer:{
        width: 75
    },
    timeStyle:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4A4A4A'
    },
    textStyle:{
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#4A4A4A'
    },
    dDayStyle:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4A4A4A',
        marginBottom: 30,
    },
    endEventText:{
        textAlign: 'center',
        marginBottom: 20,
        color: '#4A4A4A',
        marginTop: 30,
        marginBottom: 30,
    }
});
export default EventCard;