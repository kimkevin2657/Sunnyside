import React from 'react';
import {View, StatusBar, ActivityIndicator, StyleSheet, Image, Text} from 'react-native';
import {Color} from '@common';
import Images from '../../common/Images';
import Footer from '../../components/Footer';

export default class LoadingScreen extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* <ActivityIndicator size="large" color={Color.grayIcon} /> */}
        <Image source={Images.sunnysideLogo} />
        <Footer />
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
  company: {
    position: 'absolute',
    bottom: 20
  },
  bottomText: {
    color: Color.graySubtitle
  },
});
