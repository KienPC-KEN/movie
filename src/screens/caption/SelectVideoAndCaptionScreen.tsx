import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Colors} from '../../assets/color';
import {icons} from '../../assets/icons';
import {fonts} from '../../assets/fonts';
import {images} from '../../assets/images';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {DocumentPickerResponse} from 'react-native-document-picker';
import Video, {OnLoadData} from 'react-native-video';
import {formatTime} from '../../utils';
import DocumentPicker from 'react-native-document-picker';
import {setPlay, setSubtitleId} from '../../redux/slices/SubtitleSlice';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SelectVideoAndCaptionScreen'
>;

type Param = {
  SelectVideoAndCaptionScreen: {
    video?: DocumentPickerResponse | undefined;
    isChangeCaption?: boolean | false;
  };
};

const SelectVideoAndCaptionScreen = () => {
  const route = useRoute<RouteProp<Param, 'SelectVideoAndCaptionScreen'>>();
  const {video, isChangeCaption} = route.params;
  const navigation = useNavigation<ScreenNavigationProp>();
  const file = useSelector((state: RootState) => state.subtitle.dataSelectFile);
  const [videoDuration, setVideoDuration] = useState(0);
  const dispatch = useDispatch();

  const createProject = async () => {
    try {
      if (!file.file_name || !video) {
        Alert.alert('Fail', 'Select complete information!');
        return;
      }

      if (video) {
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const percent = ((elapsed / 3000) * 100).toFixed(0);
          const simulatedProgress = Math.min(parseInt(percent), 100);
          navigation.navigate('LoadingScreen', {
            percent: simulatedProgress,
            video: video,
          });
          dispatch(setSubtitleId(0));
          if (simulatedProgress >= 100) {
            clearInterval(interval);
          }
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoad = (data: OnLoadData) => {
    setVideoDuration(data.duration);
  };

  const handleChangeVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      const result = res[0];

      navigation.navigate('SelectVideoAndCaptionScreen', {
        video: result,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  return (
    <>
      <images.ImageBackground style={{position: 'absolute'}} />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{
            alignSelf: 'flex-start',
            marginTop: 24,
            marginLeft: 16,
          }}
          onPress={() => {
            dispatch(setPlay(true));
            dispatch(setSubtitleId(0));
            navigation.goBack();
          }}>
          <icons.IconBack stroke={Colors.MenuItem} />
        </TouchableOpacity>
        {video ? (
          video?.uri && (
            <View
              style={{
                width: Dimensions.get('window').width - 32,
                flexDirection: 'row',
                alignSelf: 'flex-start',
                marginTop: 32,
                paddingHorizontal: 16,
              }}>
              <View style={styles.videoContainer}>
                <TouchableOpacity
                  onPress={handleChangeVideo}
                  activeOpacity={0.7}
                  style={styles.iconBackDrop}>
                  <icons.IconChange />
                </TouchableOpacity>
                <Video
                  paused={true}
                  source={{uri: video?.uri}}
                  style={{
                    width: 160,
                    height: 95,
                  }}
                  onLoad={handleLoad}
                />
              </View>
              <View
                style={{
                  width: '60%',
                  marginLeft: 8,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.BeVietnamProMedium500,
                    color: Colors.Text,
                  }}>
                  {video.name}
                </Text>
                <Text
                  style={{
                    marginTop: 8,
                    fontFamily: fonts.BeVietnamProRegular400,
                    color: Colors.MenuItem,
                    fontSize: 14,
                  }}>
                  {formatTime(videoDuration)}
                </Text>
              </View>
            </View>
          )
        ) : (
          <TouchableOpacity onPress={handleChangeVideo}>
            <Text style={styles.text_title}>Video imported</Text>
            <View style={styles.border}>
              <icons.IconAdd />
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.text_title}>Select subtitle</Text>
        <TouchableOpacity
          style={styles.border}
          onPress={() =>
            isChangeCaption ? null : navigation.navigate('SelectSubtitleScreen')
          }>
          {file && file.file_name ? (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontFamily: fonts.BeVietnamProRegular400,
                lineHeight: 24,
                color: Colors.TextTilte,
              }}>
              {file.file_name}
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontFamily: fonts.BeVietnamProLight300,
                lineHeight: 24,
                color: Colors.MenuItem,
              }}>
              ---No selected ---
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={createProject}>
          <View
            style={{
              width: 187,
              height: 56,
              marginTop: 24,
              justifyContent: 'center',
            }}>
            <images.ImageBackgroundButton style={styles.button_create_video} />
            <Text style={styles.icon_add}>Create</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default SelectVideoAndCaptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  text_title: {
    marginTop: 32,
    marginBottom: 12,
    fontSize: 18,
    marginLeft: 16,
    fontFamily: fonts.BeVietnamProMedium500,
    alignSelf: 'flex-start',
    color: Colors.Text,
  },
  border: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    gap: 10,
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    borderColor: Colors.BorderColor,
    zIndex: 1,
    backgroundColor: Colors.Background,
  },
  button_create_video: {
    position: 'absolute',
  },

  icon_add: {
    zIndex: 100,
    alignSelf: 'center',
    fontSize: 18,
    color: Colors.TextTilte,
    lineHeight: 27,
    fontFamily: fonts.BeVietnamProMedium500,
  },
  videoContainer: {
    position: 'relative',
    width: 160,
    height: 95,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  iconBackDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.BackDropColor,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
