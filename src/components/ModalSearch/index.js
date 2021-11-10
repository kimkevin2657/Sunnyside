import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ScrollView,
    StatusBar,
    StyleSheet,
    Platform,
    Modal,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import { GOOGLE_API_KEY } from '@env';
import SearchBar from '../SearchBar';
import { Color, Device } from '@common';
import { connect } from 'react-redux';
import { updateExplore } from '@redux/actions/explore';
import { addSearchHistoryItem } from '@redux/actions/searchHistory';

class ModalSearch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchText: this.props.search.places,
            searchResult: [],
            errorMsg: '',
        };
    }

    handleSearchTextChange = async (searchText) => {
        this.setState({ searchText });
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}&input=${searchText}&types=(regions)`;
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            if (json.error_message) {
                this.setState({ errorMsg: json.error_message });
            } else {
                this.setState({ searchResult: json.predictions });
            }
        } catch (err) {
            console.log(err);
        }
    };

    handleClearSearch = () => {
        if (this.state.searchText !== '') {
            this.setState(
                {
                    searchText: '',
                    searchResult: [],
                },
                () => {
                    this.props.updateExplore({
                        search: {
                            ...this.props.search,
                            places: '',
                        },
                    });
                },
            );
        }
    };

    handleSearchEnter = () => {
        if (this.state.searchResult.length > 0) {
            this.setState(
                { searchText: this.state.searchResult[0].description },
                () => {
                    // Add to History
                    this.props.addSearchHistoryItem({
                        date: moment(),
                        search: this.state.searchResult[0].description,
                        selectedDate: this.props.search.selectedDate,
                        adults: this.props.search.adults,
                        children: this.props.search.children,
                    });
                },
            );

            this.props.updateExplore({
                search: {
                    ...this.props.search,
                    places: this.state.searchResult[0].description,
                },
            });

            this.props.onClose();
        }
    };

    handleUpdateSearch = (item) => {
        this.setState({ searchText: item.description }, () => {
            // Add to History
            this.props.addSearchHistoryItem({
                date: moment(),
                search: item.description,
                selectedDate: this.props.search.selectedDate,
                adults: this.props.search.adults,
                children: this.props.search.children,
            });
        });

        this.props.updateExplore({
            search: {
                ...this.props.search,
                places: item.description,
            },
        });

        this.props.onClose();
    };

    handleNearByPress = () => {
        Alert.alert(
            'Enable Adventure to access your current location',
            'Locate the user to show nearby adventures',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => console.log('OK'), style: 'default' },
            ],
            { cancelable: true },
        );
    };

    handleUpdateSearchFromHistory = (date) => {
        const historyItem = this.props.searchHistory.find(
            (item) => item.date === date,
        );
        this.props.updateExplore({
            search: {
                ...this.props.search,
                places: historyItem.search,
            },
        });
        this.setState({ searchText: historyItem.search });
        this.props.onClose();
    };

    render() {
        return (
            <Modal
                animationType="fade"
                presentationStyle="fullScreen"
                transparent={false}
                visible={this.props.show}>
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" />
                    {/* Main content */}
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        scrollEventThrottle={16}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag">
                        {/* Error result */}
                        {this.state.errorMsg !== '' && (
                            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                        )}
                        {/* Search Result */}
                        {this.state.searchResult.length > 0 ? (
                            <>
                                {this.state.searchResult.map((item, key) => (
                                    <SearchItem
                                        key={key}
                                        icon="enviromento"
                                        item={item}
                                        onPress={this.handleUpdateSearch}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.itemContainer}
                                    onPress={this.handleNearByPress}>
                                    <Icon name="enviroment" style={styles.itemIcon} />
                                    <Text style={styles.itemText}>NearBy</Text>
                                </TouchableOpacity>
                                {/* Search History */}
                                {this.props.searchHistory.length > 0 && (
                                    <>
                                        <Text style={styles.subTitle}>RECENT SEARCHES</Text>
                                        {this.props.searchHistory
                                            .slice(Math.max(this.props.searchHistory.length - 10, 0))
                                            .reverse()
                                            .map((item, key) => (
                                                <HistoryItem
                                                    key={key}
                                                    item={item}
                                                    onPress={this.handleUpdateSearchFromHistory}
                                                />
                                            ))}
                                    </>
                                )}
                            </>
                        )}
                    </ScrollView>
                    {/* Search bar */}
                    <View style={styles.searchBar}>
                        <SearchBar
                            searchText={this.state.searchText}
                            placeholder="Search places"
                            actionIcon="left"
                            onActionPress={() => {
                                this.props.onClose();
                            }}
                            onTextChange={this.handleSearchTextChange}
                            onSubmitEditing={this.handleSearchEnter}
                            canClear={true}
                            onClearSearch={this.handleClearSearch}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

class SearchItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.onPress(this.props.item);
    };

    render() {
        return (
            <TouchableOpacity onPress={this.onPress} style={styles.itemContainer}>
                {this.props.icon && (
                    <Icon name={this.props.icon} style={styles.itemIcon} />
                )}
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemText}>{this.props.item.terms[0].value}</Text>
                    <Text style={styles.itemSubTextPlace}>
                        {this.props.item.terms[1] ? this.props.item.terms[1].value : ''}{' '}
                        {this.props.item.terms[2]
                            ? `, ${this.props.item.terms[2].value}`
                            : ''}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class HistoryItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.onPress(this.props.item.date);
    };

    render() {
        const selectedDate = this.props.item.selectedDate
            ? moment(this.props.item.selectedDate)
            : null;
        let subtitle = selectedDate != null ? selectedDate.format('MMM DD') : '';
        let totalGuests = this.props.item.adults + this.props.item.children;
        if (totalGuests > 0) {
            if (subtitle !== '') {
                subtitle += ' • ';
            }
            subtitle += totalGuests === 1 ? '1 Guest' : `${totalGuests} Guests`;
        }

        return (
            <TouchableOpacity onPress={this.onPress} style={styles.itemContainer}>
                <Icon name="clockcircleo" style={styles.itemIcon} />
                <View>
                    <Text style={styles.itemText}>{this.props.item.search}</Text>
                    {subtitle !== '' && (
                        <Text style={styles.itemSubText}>{subtitle}</Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    }
}

ModalSearch.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        marginTop: Platform.OS === 'ios' ? (Device.isIphoneX ? 30 : 20) : 10,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    scrollContainer: {
        paddingTop: 60,
    },
    subTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        margin: 15,
        paddingHorizontal: 20,
    },
    searchBar: {
        height: 40,
        backgroundColor: Color.background,
        position: 'absolute',
        paddingTop: Platform.OS === 'ios' ? 20 : 10,
        left: 0,
        right: 0,
        justifyContent: 'flex-start',
    },
    itemContainer: {
        //backgroundColor: "pink",
        flexDirection: 'row',
        margin: 8,
        height: 45,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    itemTextContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12,
    },
    itemText: {
        color: 'black',
        fontSize: 16,
    },
    itemSubText: {
        color: Color.text,
        fontSize: 11,
        fontWeight: '200',
        marginTop: 2,
    },
    itemSubTextPlace: {
        color: Color.text,
        fontSize: 13,
        fontWeight: '200',
        marginTop: 2,
        marginLeft: 10,
    },
    itemIcon: {
        color: Color.text,
        fontSize: 15,
        padding: 10,
    },
    errorMsg: {
        color: Color.error,
        fontSize: 15,
        padding: 10,
        marginLeft: 10,
    },
});

const mapStateToProps = (state) => {
    return {
        search: state.explore.search,
        searchHistory: state.searchHistory.searches,
    };
};

const mapDispatchToProps = {
    updateExplore,
    addSearchHistoryItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalSearch);
