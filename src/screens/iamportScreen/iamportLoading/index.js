import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function iamportLoading() {
  const { container } = styles;
  return (
    <View style={container}>
      <Text></Text>
    </View>  
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default iamportLoading;