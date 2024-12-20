import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {icons} from '../../assets/icons';
import {fonts} from '../../assets/fonts';
import {Colors} from '../../assets/color';
import Slider from 'react-native-slider-x';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SampleTextPopup from '../../components/popup/SampleTextPopup';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';
import RNFS from 'react-native-fs';
import SrtParser from 'srt-parser-2';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {formatTime} from '../../utils';
import SubtitleComponent from '../../components/SubtitleComponent';
import Tts from 'react-native-tts';
import {setOneLanguage} from '../../redux/slices/LanguageSlice';
import {setPlay} from '../../redux/slices/SubtitleSlice';
import { parsedSubtitles } from '../../model';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlaySubtitleScreen'
>;


type Param = {
  PlaySubtitleScreen: {
    language_code: string;
  };
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PlaySubtitleScreen = () => {
  const file = useSelector((state: RootState) => state.subtitle.dataSelectFile);
  const route = useRoute<RouteProp<Param, 'PlaySubtitleScreen'>>();
  const {language_code} = route.params;
  const navigation = useNavigation<ScreenNavigationProp>();
  const [currentTime, setCurrentTime] = useState(0);
  const [isOpenSampleTextPopup, setOpenSampleTextPopup] = useState(false);
  const [popupLocation, setPopupLocation] = useState(0);
  const [fontSize, setFontSize] = useState(20);
  const [subtitles, setSubtitles] = useState<parsedSubtitles[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<parsedSubtitles>();
  const [nextSubtitles, setNextSubtitles] = useState<parsedSubtitles[]>([]);
  const [isShowTextNext, setShowTextNext] = useState(false);
  const [isVolume, setVolume] = useState<boolean>(true);
  const languages = useSelector((state: RootState) => state.language.languages);
  const isPlay = useSelector((state: RootState) => state.subtitle.isPlay);
  const dispatch = useDispatch();

  const filterLanguage = useCallback(() => {
    const result = languages.find(
      language => language.language_code === language_code,
    );
    dispatch(setOneLanguage(result!));
  }, []);

  const bottomPopup = useMemo(
    () => Dimensions.get('window').height - popupLocation - 5,
    [popupLocation],
  );
  const handleIncreasedFontSize = () => {
    if (fontSize > 40) {
      return;
    }
    setFontSize(fontSize + 2);
  };
  const handleReducedFontSize = () => {
    if (fontSize < 14) {
      return;
    }
    setFontSize(fontSize - 2);
  };
  const maxWidth = useMemo(() => Dimensions.get('window').width, [Dimensions]);

  const toggleSampleTextPopup = () => {
    setOpenSampleTextPopup(!isOpenSampleTextPopup);
  };

  const onSliderValueChange = (value: number) => {
    const clampedValue = Math.max(startTime, Math.min(value, endTime));
    setCurrentTime(clampedValue);
  };

  const handleSelectVideoAndCaption = () => {
    dispatch(setPlay(false));
    Tts.stop();
    filterLanguage();
    navigation.navigate('SelectVideoAndCaptionScreen', {
      video: undefined,
      isChangeCaption: true,
    });
  };

  useEffect(() => {
    Tts.resume();
    if (currentSubtitle) {
      const currentIndex = subtitles.findIndex(sub => sub === currentSubtitle);

      setCurrentTime(subtitles[currentIndex].startSeconds);
      const textToSpeak = removeHtmlTags(currentSubtitle.text || '');
      Tts.speak(textToSpeak);
    }
  }, [isPlay]);

  useEffect(() => {
    const loadSubtitles = async () => {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.file_name}.srt`;

      try {
        const fileContent = await RNFS.readFile(filePath);
        const parser = new SrtParser();
        const parsedSubtitles = parser.fromSrt(fileContent);
        if (parsedSubtitles.length > 0) {
          const firstSubtitle = parsedSubtitles[0];
          const lastSubtitle = parsedSubtitles[parsedSubtitles.length - 1];

          setStartTime(firstSubtitle.startSeconds);
          setEndTime(lastSubtitle.endSeconds);

          setSubtitles(parsedSubtitles);
        }
      } catch (error) {
        console.log('Error', `Failed to read SRT file: ${error}`);
      }
    };
    loadSubtitles();
  }, [file.file_name]);

  const removeHtmlTags = (text: string): string => {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const setLanguageTts = () => {
    if (language_code) {
      Tts.setDefaultLanguage(language_code)
        .then(() => {})
        .catch(error => {
          Tts.stop();
          Alert.alert('Error', `${error}. Speech will not be played.`, [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
          setCurrentTime(0);
          return;
        });
    }
    Tts.setDefaultPitch(1.0);
  };

  useEffect(() => {
    setLanguageTts();
  }, []);

  useEffect(() => {
    if (isPlay) {
      const intervalId = setInterval(() => {
        setCurrentTime(prevTime => {
          let newTime = prevTime + 0.25;
          if (newTime > endTime) {
            clearInterval(intervalId);
            newTime = endTime;
          }

          const subtitle = subtitles.find(
            sub => sub.startSeconds <= newTime && sub.endSeconds >= newTime,
          );

          if (subtitle) {
            const textToSpeak = subtitle.text || '';
            const cleanText = removeHtmlTags(textToSpeak);

            if (subtitle !== currentSubtitle) {
              Tts.stop();
              if (isVolume) {
                Tts.speak(cleanText);
                if (subtitle) {
                  setCurrentSubtitle(subtitle);
                }
              }
            }
          }

          updateCurrentSubtitle(newTime);
          return newTime;
        });
      }, 350);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      Tts.stop();
    }
  }, [subtitles, endTime, currentSubtitle, currentTime, isPlay]);

  const updateCurrentSubtitle = (time: number) => {
    const current = subtitles.find(
      subtitle => subtitle.startSeconds <= time && subtitle.endSeconds >= time,
    );
    const next = subtitles
      .filter(subtitle => subtitle.startSeconds > time)
      .slice(0, 15);

    if (current) {
      setCurrentSubtitle(current);
    }
    setNextSubtitles(next);
  };

  const handleNextSubtitle = () => {
    const currentIndex = subtitles.findIndex(sub => sub === currentSubtitle);

    const nextIndex = currentIndex + 1;
    if (nextIndex < subtitles.length) {
      const nextSubtitle = subtitles[nextIndex];

      setStartTime(nextSubtitle.startSeconds);

      setCurrentTime(nextSubtitle.startSeconds);
      setCurrentSubtitle(nextSubtitle);
      setNextSubtitles(subtitles.slice(nextIndex + 1, nextIndex + 16));

      Tts.stop();
      const textToSpeak = nextSubtitle.text || '';
      const cleanText = removeHtmlTags(textToSpeak);
      if (isVolume) {
        Tts.speak(cleanText);
      }
    }
  };

  const handlePrevSubtitle = () => {
    const currentIndex = subtitles.findIndex(sub => sub === currentSubtitle);

    const prevIndex = currentIndex - 1;
    if (prevIndex > -1) {
      const nextSubtitle = subtitles[prevIndex];

      setStartTime(nextSubtitle.startSeconds);

      setCurrentTime(nextSubtitle.startSeconds);
      setCurrentSubtitle(nextSubtitle);
      setNextSubtitles(subtitles.slice(prevIndex + 1, prevIndex + 16));

      Tts.stop();
      const textToSpeak = nextSubtitle.text || '';
      const cleanText = removeHtmlTags(textToSpeak);
      if (isVolume) {
        Tts.speak(cleanText);
      }
    }
  };

  const toggleVolume = () => {
    if (!isVolume) {
      Tts.stop();
    }
    setVolume(!isVolume);
  };

  const togglePlayOrPause = () => {
    if (isPlay) {
      Tts.stop();
    } else {
      Tts.resume();
      if (currentSubtitle) {
        const currentIndex = subtitles.findIndex(
          sub => sub === currentSubtitle,
        );

        setCurrentTime(subtitles[currentIndex].startSeconds);
      }
    }
    dispatch(setPlay(!isPlay));
  };
  useEffect(() => {
    Tts.addEventListener('tts-progress', event => event);
  }, [Tts]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={styles.container}
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          setPopupLocation(height);
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: Dimensions.get('window').width - 32,
            marginTop: 24,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <icons.IconBack stroke={Colors.MenuItem} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectVideoAndCaption}>
            <icons.IconCaption stroke={Colors.MenuItem} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View
            style={[
              styles.subtitleContainer,
              {
                flex: isShowTextNext ? 1 : 0,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            {currentSubtitle && (
              <SubtitleComponent
                fontSize={fontSize}
                subtitle={currentSubtitle.text}
                isNextSubtitle={false}
                opacity={0.7}
              />
            )}
          </View>

          {!isShowTextNext ? (
            <FlatList
              scrollEnabled={false}
              data={nextSubtitles}
              keyExtractor={item => item.id}
              renderItem={subtitle => (
                <Animated.View
                  entering={SlideInUp.duration(300)}
                  exiting={SlideOutDown.duration(300)}
                  layout={Layout.springify()}
                  style={styles.nextSubtitlesContainer}>
                  <SubtitleComponent
                    fontSize={fontSize}
                    subtitle={subtitle.item.text}
                    isNextSubtitle={true}
                    opacity={0.7}
                  />
                </Animated.View>
              )}
            />
          ) : null}
          {currentTime < endTime ? (
            <Text
              style={{
                fontSize: fontSize,
                color: Colors.Text,
                fontFamily: fonts.BeVietnamProRegular400,
                marginHorizontal: 16,
                opacity: 0.7,
                textAlign: 'center',
              }}>
              ...
            </Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>

      {isOpenSampleTextPopup && (
        <>
          <AnimatedPressable
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
            onPress={() => toggleSampleTextPopup()}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: bottomPopup,
              width: Dimensions.get('window').width,
              zIndex: 10,
            }}
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown}>
            <SampleTextPopup
              handleIncreasedFontSize={handleIncreasedFontSize}
              handleReducedFontSize={handleReducedFontSize}
              setShowTextNext={setShowTextNext}
              isShowTextNext={isShowTextNext}
              isShowSpeedPlay={false}
            />
          </Animated.View>
        </>
      )}
      <View
        style={{
          width: maxWidth,
          paddingHorizontal: 16,
          paddingBottom: 32,
          backgroundColor: Colors.Background,
        }}>
        <Slider
          value={currentTime}
          minimumValue={0}
          maximumValue={endTime}
          step={1}
          thumbTintColor={Colors.Text}
          minimumTrackTintColor={Colors.Text}
          maximumTrackTintColor={Colors.BorderColor}
          onValueChange={onSliderValueChange}
          thumbStyle={{width: 10, height: 10}}
          trackStyle={{height: 4}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.text_duration}>{formatTime(currentTime)}</Text>

          <Text style={styles.text_duration}>{formatTime(endTime)}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <TouchableOpacity onPress={toggleVolume}>
            {isVolume ? <icons.IconVolumeOn /> : <icons.IconVolumeOff />}
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePrevSubtitle}>
            <icons.IconPrev />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button_play}
            onPress={togglePlayOrPause}>
            {isPlay ? (
              <icons.IconPause fill={'#1C1717'} />
            ) : (
              <icons.IconPlay fill={'#1C1717'} stroke={'#1C1717'} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextSubtitle}>
            <icons.IconNext />
          </TouchableOpacity>

          <TouchableOpacity>
            <icons.IconSetting
              stroke={Colors.Text}
              onPress={toggleSampleTextPopup}
            />
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default PlaySubtitleScreen;

const styles = StyleSheet.create({
  subtitleContainer: {
    paddingTop: 60,
  },

  nextSubtitlesContainer: {
    alignItems: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },
  style_text_fake: {
    color: Colors.TextTitleContent,
    marginHorizontal: 16,
    fontFamily: fonts.BeVietnamProRegular400,
    marginTop: 24,
    alignSelf: 'center',
  },
  text_duration: {
    color: Colors.TextDurationColor,
    fontSize: 14,
    fontFamily: fonts.BeVietnamProRegular400,
    lineHeight: 21,
  },
  button_play: {
    padding: 12,
    backgroundColor: Colors.Text,
    borderRadius: 50,
    gap: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.BackDropColor,
    zIndex: 1,
  },
});
