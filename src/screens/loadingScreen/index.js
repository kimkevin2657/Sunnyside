import React from 'react';
import {View, StatusBar, ActivityIndicator, StyleSheet} from 'react-native';
import {Color} from '@common';

export default class LoadingScreen extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={Color.grayIcon} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
