import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Color} from '@common';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <View style={styles.company}>
        <Text style={styles.bottomText}>
          By SUNNYSIDE INC.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  company: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: Color.graySubtitle
  },
});
