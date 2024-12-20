import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images} from '../../assets/images';
import {fonts} from '../../assets/fonts';
import {Colors} from '../../assets/color';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {DocumentPickerResponse} from 'react-native-document-picker';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoadingScreen'
>;

type Param = {
  LoadingScreen: {
    percent: number;
    video: DocumentPickerResponse;
  };
};

const LoadingScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<RouteProp<Param, 'LoadingScreen'>>();
  const {percent, video} = route.params;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (percent === 100) {
      navigation.navigate('VideoPreview', {video});
    }
  }, [percent]);

  useEffect(() => {
    const dimensions = Dimensions.get('window');
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }, [height, width]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
      }}>
      <images.ImageBackgroundLoading
        width={width}
        height={height}
        style={{flex: 1, position: 'absolute'}}
      />
      <images.ImageEmpty />
      <Text
        style={{
          fontFamily: fonts.BeVietnamProMedium500,
          fontSize: 16,
          textAlign: 'center',
          lineHeight: 24,
          color: Colors.TextTilte,
          marginTop: 20,
        }}>
        Loading {percent}%{'\n'}Please wait a moment !
      </Text>
    </SafeAreaView>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
