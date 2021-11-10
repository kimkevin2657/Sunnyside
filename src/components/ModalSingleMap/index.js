import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import {Color, Device} from '@common';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/AntDesign';

export default class ModalSingleMap extends React.PureComponent {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      coordinates: navigation.getParam('coordinates'),
      loadMap: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loadMap: true});
    }, 500);
  }

  render() {
    return (
      <View style={styles.wrap}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => this.props.navigation.goBack(null)}>
            <Icon name="close" style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentWrap}>
          {this.state.loadMap && (
            <MapView
              style={styles.mapContainer}
              provider={PROVIDER_GOOGLE}
              initialRegion={this.state.coordinates}>
              <Marker
                coordinate={{
                  latitude: this.state.coordinates.latitude,
                  longitude: this.state.coordinates.longitude,
                }}
                title={this.state.coordinates.title}
                description={this.state.coordinates.address}
              />
            </MapView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    padding: 10,
    zIndex: 2,
    ...Platform.select({
      ios: {
        paddingTop: Device.isIphoneX ? 48 : 25,
        height: Device.isIphoneX ? 100 : 80,
      },
      android: {
        top: 0,
        height: 80,
      },
    }),
  },
  closeIconContainer: {
    backgroundColor: Color.text,
    width: 40,
    height: 40,
    opacity: 0.5,
    borderRadius: 50,
    paddingTop: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 22,
    color: Color.background,
  },
  contentWrap: {
    zIndex: 1,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
