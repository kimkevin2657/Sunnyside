import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import { CalendarList } from 'react-native-calendars';
import ButtonGradient from '../ButtonGradient';
import ButtonSecundary from '../ButtonSecundary';
import { Color, Styles } from '@common';
import { connect } from 'react-redux';
import { updateExplore } from '@redux/actions/explore';
const { height } = Dimensions.get('window');

class ModalDates extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //   selectedDate: this.props.search.selectedDate,
            selectDate: null
        };
    }

    onDateChange = (date) => {
        this.setState({ selectedDate: date.dateString });
    };

    selectDates = () => {
        this.props.updateExplore({
            search: {
                ...this.props.search,
                selectedDate: this.state.selectedDate
                    ? moment(this.state.selectedDate)
                    : null,
            },
        });
        this.props.onClose();
    };

    clearDates = () => {
        this.setState({ selectedDate: null }, () => {
            this.props.updateExplore({
                search: {
                    ...this.props.search,
                    selectedDate: null,
                },
            });
        });
    };

    render() {
        const minDate = new Date();
        const selectedDate = this.state.selectedDate
            ? moment(this.state.selectedDate)
            : null;

        const selected =
            selectedDate !== null
                ? {
                    [`${selectedDate.format('YYYY-MM-DD')}`]: {
                        selected: true,
                        customStyles: {
                            container: {
                                backgroundColor: Color.primary,
                            },
                            text: {
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        },
                    },
                }
                : null;

        return (
            <Modal
                animationType="slide"
                presentationStyle="formSheet"
                transparent={true}
                visible={this.props.show}>
                <View style={styles.modalContainer}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={this.props.onClose}
                                style={styles.closeContainer}>
                                <Icon name="close" style={styles.iconClose} />
                            </TouchableOpacity>
                            <View style={styles.textHeaderContainer}>
                                <Text style={styles.textHeader}>
                                    {selectedDate != null
                                        ? selectedDate.format('MMM DD, YYYY')
                                        : 'Select a date'}
                                </Text>
                            </View>
                            <View style={styles.rigthSpace} />
                        </View>
                        <CalendarList
                            current={this.state.selectedDate || minDate}
                            minDate={minDate}
                            onDayPress={this.onDateChange}
                            monthFormat={'MMM, yyyy'}
                            pastScrollRange={0}
                            firstDay={1}
                            markedDates={selected}
                            markingType={'custom'}
                            style={styles.calendarContainer}
                            calendarWidth={Platform.isPad ? Styles.width * 0.65 : null}
                        />
                        <View style={styles.actionButtons}>
                            <ButtonSecundary
                                text="Clear"
                                disabled={!this.state.selectedDate}
                                onPress={this.clearDates}
                            />
                            <ButtonGradient text="Select" onPress={this.selectDates} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

ModalDates.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Platform.isPad ? Color.background : 'transparent',
    },
    container: {
        backgroundColor: Color.background,
        width: '100%',
        height: Platform.OS === 'ios' ? height * 0.8 : '100%',
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    calendarContainer: {
        height: Platform.isPad ? '100%' : '77%',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    textHeaderContainer: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 18,
        color: Color.text,
    },
    rigthSpace: {
        width: 45,
    },
    closeContainer: {
        alignSelf: 'center',
    },
    iconClose: {
        color: Color.text,
        fontSize: 25,
        padding: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
});

const mapStateToProps = (state) => {
    return {
        search: state.explore.search,
    };
};

const mapDispatchToProps = {
    updateExplore,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDates);
