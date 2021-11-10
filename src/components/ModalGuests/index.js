import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ButtonToggle from '../ButtonToggle';
import ButtonGradient from '../ButtonGradient';
import ButtonSecundary from '../ButtonSecundary';
import {Color} from '@common';
import {connect} from 'react-redux';
import {updateExplore} from '@redux/actions/explore';
const {height} = Dimensions.get('window');

class ModalGuests extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      adults: this.props.search.adults,
      children: this.props.search.children,
    };
  }

  selectCounts = () => {
    this.props.updateExplore({
      search: {
        ...this.props.search,
        adults: this.state.adults,
        children: this.state.children,
      },
    });
    this.props.onClose();
  };

  clearCounts = () => {
    this.setState(
      {
        adults: 0,
        children: 0,
      },
      () => {
        this.props.updateExplore({
          search: {
            ...this.props.search,
            adults: 0,
            children: 0,
          },
        });
      },
    );
  };

  render() {
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
                <Text style={styles.textHeader}>Guests</Text>
              </View>
              <View style={styles.rigthSpace} />
            </View>
            <View style={styles.guestsContainer}>
              <View style={styles.guestsRow}>
                <Text style={styles.guestsText}> Adults</Text>
                <View style={styles.countBtns}>
                  <ButtonToggle
                    disabled={
                      this.state.adults === 0 || this.state.adults === 1
                    }
                    icon="minus"
                    onPress={() => {
                      this.setState({adults: this.state.adults - 1});
                    }}
                  />
                  <Text style={styles.countText}>{this.state.adults}</Text>
                  <ButtonToggle
                    icon="plus"
                    onPress={() => {
                      this.setState({adults: this.state.adults + 1});
                    }}
                  />
                </View>
              </View>
              <View style={styles.guestsRow}>
                <Text style={styles.guestsText}>Children</Text>
                <View style={styles.countBtns}>
                  <ButtonToggle
                    disabled={this.state.children === 0}
                    icon="minus"
                    onPress={() => {
                      this.setState({children: this.state.children - 1});
                    }}
                  />
                  <Text style={styles.countText}>{this.state.children}</Text>
                  <ButtonToggle
                    icon="plus"
                    onPress={() => {
                      this.setState({
                        children: this.state.children + 1,
                        adults: this.state.adults === 0 ? 1 : this.state.adults,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <ButtonSecundary
                text="Clear"
                disabled={this.state.adults === 0 && this.state.children === 0}
                onPress={this.clearCounts}
              />
              <ButtonGradient text="Select" onPress={this.selectCounts} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

ModalGuests.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  container: {
    flex: Platform.isPad ? 1 : null,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: Color.background,
    height: Platform.OS === 'ios' ? height * 0.4 : '100%',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
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
  guestsContainer: {
    flexDirection: 'column',
    padding: 50,
  },
  guestsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    alignItems: 'center',
  },
  guestsText: {
    fontSize: 16,
    color: Color.text,
  },
  countBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    marginHorizontal: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalGuests);
