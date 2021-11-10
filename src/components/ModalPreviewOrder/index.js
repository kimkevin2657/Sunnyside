import React from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
  Text,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {CacheImage, TextBoxForm, ButtonGradient, Spinner} from '@components';
import {Color, Styles, Util} from '@common';
import {LiteCreditCardInput} from 'react-native-credit-card-input';
import Icon from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import {addBooking} from '@redux/actions/bookings';
const {height} = Dimensions.get('window');
const letters = /^[A-Za-z ]+$/;

class ModalPreviewOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.experience = navigation.getParam('experience');
    this.params = navigation.getParam('params');
    this.state = {
      rate_per_person: this.experience.rate_per_person,
      guests: this.params.adults + this.params.children,
      total_to_pay:
        this.experience.rate_per_person *
        (this.params.adults + this.params.children),
      card: {
        firstName: '',
        lastName: '',
        number: '',
        expiry: '',
        cvc: '',
        valid: false,
      },
      errorFirstName: false,
      errorLastName: false,
      errorCC: false,
      isLoading: false,
    };
  }

  handleFirstNameChange = (firstName) => {
    this.setState({
      card: {...this.state.card, firstName},
    });
    if (this.state.errorFirstName && firstName.match(letters)) {
      this.setState({errorFirstName: false});
    }
  };

  handleLastNameChange = (lastName) => {
    this.setState({card: {...this.state.card, lastName}});
    if (this.state.errorLastName && lastName.match(letters)) {
      this.setState({errorLastName: false});
    }
  };

  handleCardChange = (form) => {
    if (form.valid) {
      this.setState({
        card: {
          ...this.state.card,
          number: form.values.number,
          expiry: form.values.expiry,
          cvc: form.values.cvc,
          valid: form.valid,
        },
        errorCC: false,
      });
    } else if (this.state.card.valid) {
      this.setState({
        card: {
          ...this.state.card,
          valid: form.valid,
        },
      });
    }
  };

  createBooking = () => {
    this.setState({isLoading: true}, () => {
      this.props.addBooking({
        id: Math.random().toString(36).substr(2, 9),
        date: this.params.selectedDate,
        guests: this.state.guests,
        paid: this.state.total_to_pay,
        experience: this.experience,
      });
      this.setState({
        isLoading: false,
      });
      this.props.navigation.navigate('MyTrips');
    });
  };

  summitForm = () => {
    if (
      !this.state.card.firstName.match(letters) ||
      !this.state.card.lastName.match(letters) ||
      !this.state.card.valid
    ) {
      this.setState({
        errorFirstName: !this.state.card.firstName.match(letters),
        errorLastName: !this.state.card.lastName.match(letters),
        errorCC: !this.state.card.valid,
      });
      return false;
    }

    Alert.alert(
      'Confirm',
      'Payment will be processed',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.createBooking(), style: 'destructive'},
      ],
      {cancelable: true},
    );
  };

  render() {
    return (
      <View style={styles.fill}>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          style={styles.keyboardContent}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.titleContainer}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => this.props.navigation.goBack(null)}>
              <Icon name="left" style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentWrap}>
            <Text style={[Styles.h1, styles.title]}>Review your order</Text>
            {/* Order details */}
            <View style={styles.contentOrder}>
              <View style={styles.descOrder}>
                <Text style={styles.orderTitle}>{this.experience.name}</Text>
                <Text style={styles.orderDate}>
                  {moment(this.params.selectedDate).format('MMM DD, YYYY')}
                </Text>
              </View>
              <View style={styles.contentImageOrder}>
                <CacheImage
                  source={{uri: this.experience.img}}
                  style={styles.imageOrder}
                />
              </View>
            </View>
            {/* Payment details */}
            <View style={styles.paymentContainer}>
              <Text style={styles.paymentDesc}>
                {`$${Util.currencyValue(this.state.rate_per_person)} x ${
                  this.state.guests
                } guest${this.state.guests > 1 ? 's' : ''}`}
              </Text>
              <Text style={styles.paymentAmount}>
                {`$${Util.currencyValue(this.state.total_to_pay)}`}
              </Text>
            </View>
            <View style={styles.paymentContainer}>
              <Text style={[styles.paymentDesc, styles.totals]}>
                Total (USD)
              </Text>
              <Text style={[styles.paymentAmount, styles.totals]}>
                {`$${Util.currencyValue(this.state.total_to_pay)}`}
              </Text>
            </View>
            {/* Credit Card */}
            <View style={styles.creditCardContainer}>
              <Text style={[Styles.h2, styles.creditCardTitle]}>
                Credit Card Information
              </Text>
              <View style={styles.input}>
                <TextBoxForm
                  value={this.state.card.firstName}
                  placeholder="First Name"
                  error={this.state.errorFirstName}
                  onChangeText={this.handleFirstNameChange}
                />
              </View>
              <View style={styles.input}>
                <TextBoxForm
                  value={this.state.card.lastName}
                  placeholder="Last Name"
                  error={this.state.errorLastName}
                  onChangeText={this.handleLastNameChange}
                />
              </View>
              <Text
                style={[
                  styles.creditCardLabel,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    color: this.state.errorCC ? 'red' : Color.textBorderColor,
                  },
                ]}>
                Card Number
              </Text>
              <LiteCreditCardInput
                inputStyle={[
                  styles.creditCardInput,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    borderBottomColor: this.state.errorCC
                      ? 'red'
                      : Color.textUnderLine,
                  },
                ]}
                placeholderColor={Color.textUnderLine}
                placeholders={{
                  number: 'CCN',
                  expiry: 'MM/YY',
                  cvc: 'CVC',
                }}
                invalidColor={'red'}
                onChange={this.handleCardChange}
              />
            </View>
          </View>
          {/* Buy button */}
          <View style={styles.actionButtons}>
            <ButtonGradient
              text={`Confirm booking • $${Util.currencyValue(
                this.state.total_to_pay,
              )}`}
              disabled={this.state.isLoading}
              fullWidth
              onPress={this.summitForm}
            />
          </View>
        </KeyboardAwareScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: Color.background,
  },
  keyboardContent: {
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 48 : 38,
    width: '100%',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  closeIconContainer: {
    paddingHorizontal: 20,
    marginTop: 0,
  },
  closeIcon: {
    fontSize: 25,
  },
  contentOrder: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  descOrder: {
    flex: 3,
  },
  orderTitle: {
    fontWeight: '500',
    fontSize: 16,
  },
  orderDate: {
    color: Color.text,
    fontWeight: '300',
    fontSize: 16,
    marginTop: 8,
  },
  title: {
    marginBottom: 40,
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: height * 0.1,
    marginHorizontal: 20,
  },
  contentImageOrder: {
    flex: 1,
    alignItems: 'flex-end',
  },
  imageOrder: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  paymentContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderTopColor: Color.separator,
    borderTopWidth: 1,
  },
  paymentDesc: {
    flex: 3,
    color: Color.black,
    fontWeight: '300',
    fontSize: 18,
  },
  paymentAmount: {
    flex: 1,
    color: Color.black,
    fontWeight: '300',
    fontSize: 18,
  },
  totals: {
    fontWeight: '500',
  },
  creditCardContainer: {
    marginTop: 20,
  },
  creditCardTitle: {
    marginBottom: 30,
    marginLeft: 8,
  },
  creditCardLabel: {
    marginLeft: 10,
  },
  creditCardInput: {
    color: Color.text,
    borderColor: '#9B9B9B',
    paddingVertical: 5,
    fontSize: 18,
    borderBottomWidth: 2.5,
    alignItems: 'flex-start',
  },
  input: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 30,
    width: '100%',
  },
  actionButtons: {
    flex: 1,
    backgroundColor: Color.background,
    marginTop: Platform.isPad ? height * 0.26 : height * 0.1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5.84,
    elevation: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    search: state.explore.search,
  };
};

const mapDispatchToProps = {
  addBooking,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalPreviewOrder);
