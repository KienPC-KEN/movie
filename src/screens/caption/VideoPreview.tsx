import {
  Alert,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Video, {Orientation, VideoRef} from 'react-native-video';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {IProject, parsedSubtitles} from '../../model';
import RNFS from 'react-native-fs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {downloadAndSaveFile, generateUniqueId} from '../../utils';
import {addProject} from '../../constants/database/services/ProjectService';
import {createThumbnail} from 'react-native-create-thumbnail';
import Slider from 'react-native-slider-x';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import SampleTextPopup from '../../components/popup/SampleTextPopup';
import LoadingSpinner from '../../components/LoadingSpinner';
import SrtParser from 'srt-parser-2';
import {
  addFileDownload,
  fetchFileDownloadByFileId,
  modifyFileDownload,
} from '../../constants/database/services/FileDownloadService';
import {downloadFileApi} from '../../constants/api/axios';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VideoPreview'
>;

type Param = {
  VideoPreview: {
    video: DocumentPickerResponse;
  };
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const {width, height} = Dimensions.get('window');

const VideoPreview = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<RouteProp<Param, 'VideoPreview'>>();
  const {video} = route.params;
  const language = useSelector((state: RootState) => state.language.language);
  const file = useSelector((state: RootState) => state.subtitle.dataSelectFile);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isOpenSampleTextPopup, setOpenSampleTextPopup] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<VideoRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [subtitles, setSubtitles] = useState<parsedSubtitles[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<parsedSubtitles>();

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

  const handleDownloadFile = async () => {
    try {
      if (file) {
        const data = await fetchFileDownloadByFileId(file.file_id);

        const download = await downloadFileApi(file.file_id);
        if (!download || !download.link) {
          Alert.alert(
            'Error',
            'Failed to download the file. Please try again.',
          );
        }
        if (data) {
          modifyFileDownload({...download, is_download: true}, file.file_id);
          await downloadAndSaveFile(download.link);
        }
      }
    } catch (error) {
      console.error('Error download data:', error);
      Alert.alert('Error', 'Failed to download the file. Please try again.');
    }
  };

  const saveProject = async () => {
    try {
      setLoading(true);
      const sourcePath = video.uri;
      const randomId = generateUniqueId();

      const destPath = `${RNFS.DocumentDirectoryPath}/${randomId}_${video.name}`;
      await RNFS.copyFile(sourcePath, destPath);

      const thumbnail = await createThumbnail({
        url: video.uri,
        timeStamp: 10000,
      });

      const now = new Date();

      let project: IProject = {
        id: randomId,
        name: file.file_name + `_${randomId}`,
        uri_video: destPath,
        uri_subtitle: file.file_name + '.srt',
        date_upload: now.toISOString(),
        image_project: thumbnail.path,
        language: language,
      };
      handleDownloadFile();
      navigation.navigate('BottomTab', {screen: 'Caption'});

      await addProject(project);
    } catch (error) {
      console.log('Error save project: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSubtitles = async () => {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.file_name}.srt`;

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
  }, [file.file_name]);

  const removeHtmlTags = (text: string): string => {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <View
            style={{
              position: 'relative',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              marginTop: 24,
            }}>
            <TouchableOpacity
              onPress={async () => {
                if (isFullscreen) {
                  Orientation.LANDSCAPE;
                  setIsFullscreen(false);
                }
                await setIsPaused(true);
                navigation.navigate('BottomTab');
              }}>
              <icons.IconBack stroke={Colors.MenuItem} />
            </TouchableOpacity>

            <TouchableOpacity onPress={saveProject}>
              <icons.IconSaveProject />
            </TouchableOpacity>
          </View>

          <View
            style={[
              {justifyContent: 'center'},
              isFullscreen ? styles.fullscreen : {},
            ]}>
            <Video
              source={{
                uri: video.uri,
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
            <View></View>

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
        </>
      )}
    </SafeAreaView>
  );
};

export default VideoPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height,
  },
  video: {
    width: width,
    height: height * 0.55,
    backgroundColor: Colors.Background,
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
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.BackDropColor,
    zIndex: 1,
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
