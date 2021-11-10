import React from 'react';
import { Image, View, Text, StyleSheet, Platform, Alert } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import messaging from '@react-native-firebase/messaging';
import { Images } from '@common';
import { connect } from 'react-redux';
import { setConfigParameter } from '@redux/actions/config';

//introSliderScreen (인트로)

const slides = [
    {
        title: '인트로',
        description:
            '샘플',
        img: Images.IllustAircraft,
        backgroundColor: '#0097ef',
        fontColor: '#fff',
        level: 20,
    },
    {
        title: "인트로 1",
        description: '샘플',
        img: Images.IllustSettings,
        backgroundColor: '#7dd7a5',
        fontColor: '#fff',
        level: 20,
    },
    {
        title: '인트로 2',
        description: '샘플 String',
        img: Images.IllustCoder,
        backgroundColor: '#ffbb61',
        fontColor: '#fff',
        level: 20,
    },
    {
        title: '인트로 3',
        description: '샘플 String',
        img: Images.IllustTeam,
        backgroundColor: '#9ed0f4',
        fontColor: '#fff',
        level: 20,
    },
];

class IntroSliderScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { permissionRequested: false };
    }

    handleNotificationPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            const fcmToken = await messaging().getToken();
            console.log('Your Firebase Token is:', fcmToken);
            // Handling new messages with the app active
            messaging().onMessage(async (remoteMessage) => {
                const data =
                    Object.keys(remoteMessage.data).length !== 0
                        ? remoteMessage.data
                        : remoteMessage;
                Alert.alert(data.notification.title, data.notification.body);
            });
        }
    };

    _renderItem = ({ item }) => {
        return (
            <View style={[styles.wrap, { backgroundColor: item.backgroundColor }]}>
                <Image source={item.img} style={styles.imageStyle} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    _onSlideChange = (number) => {
        if (number === 5) {
            this.setState({ permissionRequested: true }, () => {
                (async () => {
                    await this.handleNotificationPermission();
                })();
            });
        }
    };

    _onDone = () => {
        if (!this.state.permissionRequested) {
            (async () => {
                await this.handleNotificationPermission();
            })();
        }
        // Update Intro Slider status as "seen" and navigate to Login page
        this.props.setConfigParameter('introSlider', 'seen');
        this.props.navigation.navigate('Main');
    };

    render() {
        return (
            <AppIntroSlider
                renderItem={this._renderItem}
                showSkipButton={true}
                showNextButton={true}
                showDoneButton={true}
                buttonTextStyle={styles.buttonText}
                data={slides}
                onDone={this._onDone}
                onSkip={this._onDone}
                onSlideChange={this._onSlideChange}
            />
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: Platform.isPad ? null : 25,
    },
    imageStyle: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },
    textContainer: {
        marginTop: 30,
    },
    title: {
        color: '#ffffff',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    description: {
        marginTop: 10,
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 22,
    },
});

const mapDispatchToProps = {
    setConfigParameter,
};

export default connect(null, mapDispatchToProps)(IntroSliderScreen);
