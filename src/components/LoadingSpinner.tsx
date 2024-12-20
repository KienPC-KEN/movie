import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {Colors} from '../assets/color';

const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.TextTilte} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
