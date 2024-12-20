import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {IProject, parsedSubtitles} from '../../model';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {fonts} from '../../assets/fonts';
import Video, {Orientation, VideoRef} from 'react-native-video';
import ProjectMorePopup from '../../components/popup/ProjectMorePopup';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import RenameProjectPopup from '../../components/popup/RenameProjectPopup';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import Slider from 'react-native-slider-x';
import SampleTextPopup from '../../components/popup/SampleTextPopup';
import RNFS from 'react-native-fs';
import SrtParser from 'srt-parser-2';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayCaptionScreen'
>;

type Param = {
  PlayCaptionScreen: {
    project: IProject;
  };
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const {width, height} = Dimensions.get('window');
const PlayCaptionScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<RouteProp<Param, 'PlayCaptionScreen'>>();
  const {project} = route.params;
  const [isPopupMore, setshowPopupMore] = useState(false);
  const [isRenamePopup, setRenamePopup] = useState(false);
  const offset = useSharedValue<number>(0);
  const [isOpenSampleTextPopup, setOpenSampleTextPopup] = useState(false);
  const [heightPopup, setHeightPopup] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoRef = useRef<VideoRef>(null);
  const [subtitles, setSubtitles] = useState<parsedSubtitles[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<parsedSubtitles>();

  const handleShowMorePopup = () => {
    setshowPopupMore(!isPopupMore);
  };

  const handleShowRenamePopup = () => {
    setRenamePopup(!isRenamePopup);
    setshowPopupMore(!isPopupMore);
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };
  const onSliderSpeedValueChange = (value: number) => {
    setPlaybackRate(value);
  };

  const onSliderTimeValueChange = (value: number) => {
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.seek(value);
      setIsPaused(false);
    }
  };

  const toggleSampleTextPopup = () => {
    setOpenSampleTextPopup(!isOpenSampleTextPopup);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      Orientation.LANDSCAPE;
      setIsFullscreen(false);
    } else {
      Orientation.PORTRAIT;
      setIsFullscreen(true);
    }
  };

  const handleLoad = (data: {duration: number}) => {
    setDuration(data.duration);
  };

  const handleProgress = (data: {currentTime: number}) => {
    setCurrentTime(data.currentTime);

    const subtitle = subtitles.find(
      sub =>
        sub.startSeconds <= data.currentTime &&
        sub.endSeconds >= data.currentTime,
    );

    if (subtitle) {
      if (subtitle !== currentSubtitle) {
        setCurrentSubtitle(subtitle);
      }
    } else {
      setCurrentSubtitle(undefined);
    }
  };

  const pan = Gesture.Pan()
    .onChange(event => {
      offset.value = event.translationY;
    })
    .onFinalize(() => {
      if (offset.value > heightPopup / 2) {
        runOnJS(setshowPopupMore)(false);
        runOnJS(setRenamePopup)(false);
      }

      offset.value = withTiming(0);
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
  }));

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsPaused(true);
      };
    }, []),
  );

  useEffect(() => {
    const loadSubtitles = async () => {
      const filePath = `${RNFS.DocumentDirectoryPath}/${project.uri_subtitle}`;

      try {
        const fileContent = await RNFS.readFile(filePath);
        const parser = new SrtParser();
        const parsedSubtitles = parser.fromSrt(fileContent);
        if (parsedSubtitles.length > 0) {
          setSubtitles(parsedSubtitles);
        }
      } catch (error) {
        console.log('Error', `Failed to read SRT file: ${error}`);
      }
    };
    loadSubtitles();
  }, [project.uri_subtitle]);

  const removeHtmlTags = (text: string): string => {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
  };

  return (
    <SafeAreaView style={styles.container_item}>
      <View
        style={{
          position: 'relative',
          top: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width - 32,
        }}>
        <TouchableOpacity
          onPress={async () => {
            await setIsPaused(true);
            navigation.goBack();
          }}>
          <icons.IconBack stroke={Colors.MenuItem} />
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{
            width: 250,
            textAlign: 'center',
            fontSize: 16,
            fontFamily: fonts.BeVietnamProRegular400,
            color: Colors.TextTitleContent,
          }}>
          {project.name}
        </Text>
        <TouchableOpacity onPress={handleShowMorePopup}>
          <icons.IconMore />
        </TouchableOpacity>
      </View>
      <View
        style={[
          {justifyContent: 'center'},
          isFullscreen ? styles.fullscreen : {},
        ]}>
        <Video
          source={{
            uri: `file://${project.uri_video}`,
          }}
          style={[styles.video, isFullscreen ? styles.fullscreenVideo : {}]}
          controls={false}
          resizeMode={'contain'}
          rate={playbackRate}
          paused={isPaused}
          onLoad={handleLoad}
          onProgress={handleProgress}
          ref={videoRef}
          onError={error => console.log('Video Error:', error)}
        />
      </View>
      <View style={styles.controlAndSubtitleContainer}>
        <View style={[styles.subtitleContainer]}>
          {currentSubtitle && (
            <Text style={styles.subtitleText}>
              {removeHtmlTags(currentSubtitle.text)}
            </Text>
          )}
        </View>
        <View style={styles.container_control_video}>
          <TouchableOpacity
            onPress={togglePlayPause}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 9,
              backgroundColor: Colors.BackgroundPopup,
              gap: 10,
              borderRadius: 4,
            }}>
            {!isPaused ? (
              <icons.IconPause fill={Colors.Text} />
            ) : (
              <icons.IconPlay fill={Colors.Text} stroke={Colors.Text} />
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 14,
              paddingVertical: 9,
              backgroundColor: Colors.BackgroundPopup,
              gap: 10,
              borderRadius: 4,
            }}>
            <Slider
              style={{
                width: 187,
                height: 22,
              }}
              value={currentTime}
              minimumValue={0}
              maximumValue={duration}
              step={1}
              thumbTintColor={Colors.TextTilte}
              minimumTrackTintColor={Colors.TextTilte}
              maximumTrackTintColor={Colors.BorderColor}
              onValueChange={onSliderTimeValueChange}
              thumbStyle={{width: 0, height: 0}}
              trackStyle={{height: 22}}
            />

            <TouchableOpacity onPress={toggleFullscreen}>
              <icons.IconFullScreen style={{marginHorizontal: 6}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSampleTextPopup}>
              <icons.IconSetting stroke={Colors.MenuItem} />
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
      </View>

      {isPopupMore ? (
        <>
          <AnimatedPressable
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
            onPress={() => handleShowMorePopup()}
          />
          <GestureDetector gesture={pan}>
            <Animated.View
              onLayout={event => {
                const {height} = event.nativeEvent.layout;
                setHeightPopup(height);
              }}
              style={[
                {
                  position: 'absolute',
                  bottom: 0,
                  alignItems: 'center',
                  width: width,
                  zIndex: 10,
                },
                animatedStyles,
              ]}
              entering={SlideInDown.springify().damping(15)}
              exiting={SlideOutDown}>
              <ProjectMorePopup
                id={project.id}
                onShowRenamePopup={handleShowRenamePopup}
                navigation={navigation}
                setIsPaused={async () => await setIsPaused(true)}
              />
            </Animated.View>
          </GestureDetector>
        </>
      ) : null}
      {isRenamePopup ? (
        <>
          <AnimatedPressable
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: '40%',
              alignItems: 'center',
              width: width,
              zIndex: 10,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: -2},
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 10,
            }}
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown}>
            <RenameProjectPopup
              project={project}
              onShowRenamePopup={handleShowRenamePopup}
              navigation={navigation}
              setIsPaused={async () => await setIsPaused(true)}
            />
          </Animated.View>
        </>
      ) : null}
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
              bottom: 0,
              width: width,
              zIndex: 10,
            }}
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown}>
            <SampleTextPopup
              isShowSpeedPlay={true}
              onSpeedChange={onSliderSpeedValueChange}
              playbackRate={playbackRate}
            />
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default PlayCaptionScreen;

const styles = StyleSheet.create({
  container_item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  video: {
    width: width,
    height: height * 0.55,
    backgroundColor: Colors.Background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.BackDropColor,
    zIndex: 1,
  },
  fullscreen: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fullscreenVideo: {
    width: width,
    height: height,
  },
  container_control_video: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 16,
    marginBottom: 32,
    gap: 4,
    justifyContent: 'center',
  },
  controlAndSubtitleContainer: {
    position: 'relative',
    width: width,
    alignItems: 'center',
  },
  subtitleContainer: {
    justifyContent: 'center',
    width: width,
    height: height * 0.1,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  subtitleText: {
    color: 'white',
    fontSize: width * 0.045,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
});
