import React from 'react';
import {
    View,
    Text,
    StatusBar,
    Platform,
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import {
    TextBoxEditable,
    ButtonGradient,
    ButtonSecundary,
    ButtonToggle,
    ModalDates,
    ModalImageViewer,
    ModalSearch,
    Spinner,
    TextBox,
} from '@components';
import { Styles, Color } from '@common';
import { connect } from 'react-redux';
import { clearUser, setUser } from '@redux/actions/user';
import { clearBookmarks } from '@redux/actions/bookmarks';
import { clearBookings } from '@redux/actions/bookings';
import { resetExplore } from '@redux/actions/explore';
import { clearSearchHistory } from '@redux/actions/searchHistory';

const { height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.25;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 85 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class ProfileScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.categoryItem = {
            img: 'https://t1.daumcdn.net/cfile/tistory/2412A64C54BC645C36'
        }
        this.images = ['https://t1.daumcdn.net/cfile/tistory/2412A64C54BC645C36', 'http://1.bp.blogspot.com/-k5vhkq3gWl4/VemnYxz39wI/AAAAAAAACXI/KadHYj6Ndsk/s1600/r6-14.gif']
        this.state = {
            modalDatesShow: false,
            modalImageViewShow: false,
            ModalSearchShow: false

        }
    }


    _renderScrollViewContent() {
        const { modalDatesShow, modalImageViewShow, ModalSearchShow } = this.state;
        return (
            <>

                <ModalDates show={modalDatesShow} onClose={() => this.setState({ modalDatesShow: !modalDatesShow })} />
                <ModalImageViewer show={modalImageViewShow} onClose={() => this.setState({ modalImageViewShow: !modalImageViewShow })} images={this.images} />
                <ModalSearch show={ModalSearchShow} onClose={() => this.setState({ ModalSearchShow: !ModalSearchShow })} />

                <View style={styles.scrollViewContent}>

                    <View style={styles.containerInfo}>
                        <View style={styles.fieldContainer}>
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextBoxEditable
                                text={this.props.user.email}
                                description="TextBoxEditable"
                                readonly
                            />
                        </View>

                        {/* sign Out button */}
                        <View style={styles.actionButtons}>
                            <ButtonGradient text="ButtonGradient" onPress={this.signOut} />
                        </View>
                        <View style={styles.actionButtons}>
                            <ButtonSecundary text="ButtonSecundary" onPress={() => console.log('ButtonSecundary press')} textStyle={{ color: 'red' }} containerStyle={{ borderWidth: 1 }} />
                        </View>
                        <View style={styles.actionButtons}>
                            <ButtonToggle text="ButtonToggle" onPress={() => console.log('ButtonToggle press')} icon={'search1'} />
                        </View>
                        <View style={styles.actionButtons}>
                            <ButtonSecundary text="ModalDates" onPress={() => this.setState({ modalDatesShow: !modalDatesShow })} containerStyle={{ borderWidth: 1 }} />
                        </View>
                        <View style={styles.actionButtons}>
                            <ButtonSecundary text="ModalImageViewer" onPress={() => this.setState({ modalImageViewShow: !modalImageViewShow })} containerStyle={{ borderWidth: 1 }} />
                        </View>
                        <View style={styles.actionButtons}>
                            <ButtonSecundary text="ModalSearch" onPress={() => this.setState({ ModalSearchShow: !ModalSearchShow })} containerStyle={{ borderWidth: 1 }} />
                        </View>
                        <View>
                            <Spinner />
                        </View>
                        <View style={styles.actionButtons}>
                            <TextBox value='' placeholder='TextBox' />
                        </View>
                        <View style={styles.actionButtons}>
                            <ButtonGradient
                                text="Apple로 로그인"
                                textStyle={{ fontSize: 16, fontWeight: 'normal', }}
                                fullWidth
                                textColor={Color.white}
                                apple
                                backgroundColor={'#000000'}
                                containerStyle={styles.appleLoginButton}
                            />
                        </View>
                        <View style={styles.actionButtons}>
                            <ButtonGradient
                                text="카카오 로그인"
                                textStyle={{ fontSize: 16, fontWeight: 'normal' }}
                                backgroundColor={Color.kakaoColor}
                                fullWidth
                                kakao
                                textColor={Color.kakaoTextColor}
                                containerStyle={styles.loginButton}
                            />
                        </View>
                    </View>
                    {/* Final space */}
                    <View style={styles.whiteSpace} />
                </View>
            </>
        );
    }

    signOut = () => {
        Alert.alert(
            'Alert',
            '내용',
            [
                { text: '승인', style: 'destructive' },
                {
                    text: '취소',

                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );
    };

    // closeSession = () => {
    //     auth()
    //         .signOut()
    //         .then(() => {
    //             RealtimeDatabase.stopListening();
    //             this.props.clearUser();
    //             this.props.clearBookmarks();
    //             this.props.clearBookings();
    //             this.props.resetExplore();
    //             this.props.clearSearchHistory();
    //             const resetAction = StackActions.reset({
    //                 index: 0,
    //                 actions: [NavigationActions.navigate({ routeName: 'SplashScreen' })],
    //             });
    //             this.props.navigation.dispatch(resetAction);
    //         });
    // };

    render() {
        return (
            <View style={styles.fill}>
                <StatusBar
                    translucent
                    barStyle={'dark-content'}
                    backgroundColor="rgba(0, 0, 0, 0.251)"
                />
                <ScrollView
                    style={styles.fill}
                    scrollEventThrottle={1}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag">
                    {this._renderScrollViewContent()}
                </ScrollView>
                <View
                    pointerEvents={'none'}
                    style={[styles.header]}
                >
                </View>
                {/* Top bar */}
                <View style={styles.titleContainer}>
                    <View
                        style={[
                            styles.bar,
                            Styles.row,
                            { useNativeDriver: true }

                        ]}>
                        <Text style={[styles.title, Styles.h1]}> 컴포넌트 </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    closeIconContainer: {
        paddingHorizontal: 20,
        marginTop: 0,
    },
    closeIcon: {
        fontSize: 25,
    },
    titleContainer: {
        flexDirection: 'row',
        flex: 1,
        position: 'absolute',
        marginTop: Platform.OS === 'ios' ? 48 : 38,
        width: '100%',
        justifyContent: 'space-between',
    },
    bar: {
        backgroundColor: 'transparent',
        height: 32,
    },
    title: {
        color: 'white',
        fontSize: 28,
    },
    headerContent: {
        height: '100%',
        width: '50%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-end',
        padding: 10,
    },
    headerTextContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    titleNumber: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#fff',
        fontSize: 16,
    },
    scrollViewContent: {
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
        marginLeft: 20,
        marginRight: 20,
    },
    containerInfo: {
        backgroundColor: Color.background,
        marginTop: 20,
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 8,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    actionButtons: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: 20,
    },
    whiteSpace: {
        height: 380,
    },
    loginButton: {
        height: 50,
    },
    appleLoginButton: {
        height: 50,
        backgroundColor: '#000000'
    },
});

const mapStateToProps = (state) => {
    return {
        user: state.user,
        bookingNumber: state.bookings.length,
        savedNumber: state.bookmarks.length,
    };
};

const mapDispatchToProps = {
    clearUser,
    setUser,
    clearBookmarks,
    clearBookings,
    resetExplore,
    clearSearchHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
