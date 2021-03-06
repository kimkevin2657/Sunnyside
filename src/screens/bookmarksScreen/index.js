import React from 'react';
import {
    View,
    Animated,
    Dimensions,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
} from 'react-native';
import { CardExperienceResultLarge } from '@components';
import { Styles, Color, Images } from '@common';
import { connect } from 'react-redux';

const { height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.12;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 25 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class BookmarksScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.scrollY = new Animated.Value(
            Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
        );
    }

    _renderScrollViewContent() {
        return (
            <View style={[styles.scrollViewContent, Styles.row]}>
                {this.props.bookmarks.length === 0 ? (
                    <View style={[Styles.row, styles.centered]}>
                        <Image
                            resizeMode="contain"
                            style={styles.illustration}
                            source={Images.IllustNoSaved}
                        />
                        <Text style={[Styles.h2, styles.noResultText]}>
                        </Text>
                        <Text style={Styles.subtitle}>
                        </Text>
                    </View>
                ) : (
                    this.props.bookmarks.map((item, index) => {
                        return (
                            <CardExperienceResultLarge
                                key={index}
                                experience={item}
                                bookmarkConfirm={true}
                                navigation={this.props.navigation}
                            />
                        );
                    })
                )}
                {/* Final space */}
                <View style={styles.whiteSpace} />
            </View>
        );
    }

    render() {
        const scrollY = Animated.add(
            this.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        const titleScale = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 0.9, 0.7],
            extrapolate: 'clamp',
        });
        const titleColor = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 10, HEADER_SCROLL_DISTANCE],
            outputRange: [Color.text, Color.text, Color.black],
        });

        return (
            <View style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" />
                <Animated.ScrollView
                    scrollEventThrottle={1}
                    onScroll={Animated.event([
                        { nativeEvent: { contentOffset: { y: this.scrollY } } },
                        { useNativeDriver: true }
                    ])}
                    contentInset={{ top: HEADER_MAX_HEIGHT }}
                    contentOffset={{ y: -HEADER_MAX_HEIGHT }}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag">
                    {this._renderScrollViewContent()}
                </Animated.ScrollView>
                {/* Top bar */}
                <View style={styles.titleContainer}>
                    <Animated.View
                        style={[Styles.row, { transform: [{ scale: titleScale }] }]}>
                        <Animated.Text style={[Styles.h1, { color: titleColor }]}>
                            ??????
            </Animated.Text>
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Color.background,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        paddingTop: Platform.OS === 'ios' ? 48 : 38,
        paddingBottom: 10,
        backgroundColor: Color.background,
        width: '100%',
        justifyContent: 'space-between',
    },
    scrollViewContent: {
        flex: 1,
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
        paddingHorizontal: Platform.isPad ? Styles.width * 0.1 : 0,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustration: {
        width: Styles.width * 0.8,
        height: 400,
    },
    noResultText: {
        marginBottom: 10,
    },
    whiteSpace: {
        height: 100,
    },
});

const mapStateToProps = (state) => {
    return {
        bookmarks: state.bookmarks,
    };
};

export default connect(mapStateToProps)(BookmarksScreen);
