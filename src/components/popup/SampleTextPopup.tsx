import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../assets/color';
import {icons} from '../../assets/icons';
import {fonts} from '../../assets/fonts';
import {Switch} from 'react-native-switch';
import Slider from 'react-native-slider-x';
import {useFocusEffect} from '@react-navigation/native';

type SampleTextPopupProp = {
  handleIncreasedFontSize?: () => void;
  handleReducedFontSize?: () => void;
  setShowTextNext?: (val: boolean) => void;
  isShowTextNext?: boolean;
  isShowSpeedPlay?: boolean;
  onSpeedChange?: (value: number) => void;
  playbackRate?: number;
};

const SampleTextPopup: React.FC<SampleTextPopupProp> = ({
  handleIncreasedFontSize,
  handleReducedFontSize,
  setShowTextNext,
  isShowTextNext,
  isShowSpeedPlay,
  onSpeedChange,
  playbackRate,
}) => {
  const [speed, setSpeed] = useState<number>(1);
  const [lastPress, setLastPress] = useState<number>(0);

  useEffect(() => {
    setSpeed(playbackRate! * 100);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (onSpeedChange) {
        onSpeedChange(speed / 100);
      }
    }, [speed]),
  );

  const handlePress = (action: 'increase' | 'decrease') => {
    const now = Date.now();
    if (now - lastPress < 350) return;

    setLastPress(now);

    if (action === 'increase') {
      handleIncreasedFontSize!();
    } else if (action === 'decrease') {
      handleReducedFontSize!();
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>
        {!isShowSpeedPlay ? 'Sample text' : 'Settings'}
      </Text>

      {!isShowSpeedPlay ? (
        <>
          <View style={styles.container_line}>
            <Text style={styles.text_content}>Font size</Text>
            <View style={{flexDirection: 'row'}}>
              <icons.iconSizeIncreased
                style={{marginRight: 8}}
                onPress={() => handlePress('increase')}
              />
              <icons.iconSizeReduced onPress={() => handlePress('decrease')} />
            </View>
          </View>
          <View style={styles.container_line}>
            <Text style={styles.text_content}>Show next and previous line</Text>
            <Switch
              value={isShowTextNext}
              onValueChange={val => setShowTextNext?.(val)}
              backgroundActive={Colors.TextTilte}
              backgroundInactive={Colors.BackgroundInactive}
              circleActiveColor={Colors.Text}
              circleInActiveColor={Colors.MenuItem}
              circleSize={22}
              renderActiveText={false}
              renderInActiveText={false}
              innerCircleStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              barHeight={26}
              switchWidthMultiplier={2.2}
            />
          </View>
        </>
      ) : null}

      {isShowSpeedPlay ? (
        <View style={styles.container_line}>
          <Text style={styles.text_content}>Speed</Text>
          <Slider
            style={{
              width: 282,
            }}
            value={speed}
            minimumValue={0}
            maximumValue={200}
            step={1}
            thumbTintColor={Colors.TextTilte}
            minimumTrackTintColor={Colors.TextTilte}
            maximumTrackTintColor={Colors.BorderColor}
            onValueChange={value => setSpeed(value)}
            thumbStyle={{width: 10, height: 10}}
            trackStyle={{height: 4}}
          />
        </View>
      ) : null}
    </View>
  );
};

export default SampleTextPopup;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Colors.BackgroundPopup,
    width: Dimensions.get('window').width,
  },
  text_title: {
    textAlign: 'center',
    color: Colors.TextTilte,
    fontSize: 18,
    fontFamily: fonts.BeVietnamProSemiBold600,
    lineHeight: 27,
  },
  text_content: {
    fontFamily: fonts.BeVietnamProMedium500,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.Text,
  },
  container_line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
