import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {StackActions} from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import {Color, Device} from '@common';
import {connect} from 'react-redux';
import {updateExplore} from '@redux/actions/explore';

class TabBar extends React.PureComponent {
  onPress = (index, route) => {
    // eslint-disable-next-line react/no-string-refs
    this.refs[`tabItem${index}`].pulse();
    if (route.routes && route.routes.length > 1 && index !== 0) {
      this.props.navigation.dispatch(
        StackActions.popToTop({key: route.key, immediate: true}),
      );
    } else {
      if (this.props.navigation.state.index === index) {
        if (this.props.search.places !== '') {
          this.handleClearSearch();
        }
      }
      this.props.navigation.navigate(route.key);
    }
  };

  handleClearSearch = () => {
    this.props.updateExplore({
      search: {
        ...this.props.search,
        places: '',
      },
    });
  };

  render() {
    const {
      navigation,
      renderIcon,
      activeTintColor,
      inactiveTintColor,
    } = this.props;
    const {routes} = navigation.state;

    return (
      <View
        style={[
          styles.tabbar,
          {backgroundColor: Color.tabbar, borderTopColor: Color.tabbar},
        ]}>
        {routes &&
          routes.map((route, index) => {
            const focused = index === navigation.state.index;
            const tintColor = focused ? activeTintColor : inactiveTintColor;

            return (
              <TouchableWithoutFeedback
                key={route.key}
                style={styles.tab}
                onPress={() => this.onPress(index, route)}>
                <Animatable.View ref={`tabItem${index}`} style={styles.tab}>
                  {renderIcon({
                    route,
                    index,
                    focused,
                    tintColor,
                  })}
                </Animatable.View>
              </TouchableWithoutFeedback>
            );
          })}
      </View>
    );
  }
}

TabBar.propTypes = {
  navigation: PropTypes.object,
  renderIcon: PropTypes.any,
  activeTintColor: PropTypes.string,
  inactiveTintColor: PropTypes.string,
  jumpTo: PropTypes.func,
};

const styles = StyleSheet.create({
  tabbar: {
    height: Device.isIphoneX ? 95 : 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        justifyContent: Device.isIphoneX ? 'flex-start' : 'center',
        paddingTop: Device.isIphoneX ? 12 : 0,
      },
      android: {
        justifyContent: 'center',
      },
    }),
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

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
