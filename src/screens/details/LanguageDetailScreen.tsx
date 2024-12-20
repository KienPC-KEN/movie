import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {IFiles, ILanguage, ISubtitle} from '../../model';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {icons} from '../../assets/icons';
import {fonts} from '../../assets/fonts';
import {Colors} from '../../assets/color';
import LinearGradient from 'react-native-linear-gradient';
import LineLanguageDetailComponent from '../../components/LineLanguageDetailComponent';
import { downloadAndSaveFile, formattedDate} from '../../utils';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {setDataSelectFile} from '../../redux/slices/SubtitleSlice';
import {downloadFileApi} from '../../constants/api/axios';
import {
  addFileDownload,
  fetchFileDownloadByFileId,
} from '../../constants/database/services/FileDownloadService';

type Param = {
  LanguageDetailScreen: {
    file_id: number;
  };
};

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LanguageDetailScreen'
>;

const LanguageDetailScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<RouteProp<Param, 'LanguageDetailScreen'>>();
  const {file_id} = route.params;
  const subtitles = useSelector(
    (state: RootState) => state.subtitle.dataSubtitleMovie,
  );
  const languages = useSelector((state: RootState) => state.language.languages);
  const [dataSubtitle, setDataSubtitle] = useState<ISubtitle>();
  const [dataFile, setDateFile] = useState<IFiles>();
  const [image_url, setimage_url] = useState<string>('');
  const [lang, setLang] = useState<ILanguage>();
  const dispatch = useDispatch<AppDispatch>();
  const [isDownload, setCheckDownload] = useState(false);

  const fetchDataSubtitle = useCallback(() => {
    const result = subtitles.find(subtitle =>
      subtitle.attributes.files.find(file => file.file_id === file_id),
    );

    if (result) {
      setDataSubtitle(result);
      const relatedLink = result.attributes.related_links?.map(
        link => link.img_url,
      );
      setimage_url(relatedLink.toString());
    }
  }, [subtitles, file_id]);

  const filterDataFile = useCallback(() => {
    const result = dataSubtitle?.attributes.files.find(
      file => file.file_id === file_id,
    );
    setDateFile(result);
  }, [dataSubtitle, file_id]);

  const filterLanguageName = useCallback(() => {
    const result = languages.find(
      language => language.language_code === dataSubtitle?.attributes.language,
    );

    setLang(result);
  }, [languages, dataSubtitle]);

  const handlePlay = async () => {
    try {
      if (dataFile) {
        if (!isDownload) {
          const download = await downloadFileApi(dataFile.file_id);
          if (!download || !download.link) {
            Alert.alert(
              'Error',
              'Failed to download the file. Please try again.',
            );
          }
          await addFileDownload(
            {...download, is_download: false},
            file_id,
            dataSubtitle?.attributes?.feature_details?.imdb_id!,
          );
          await downloadAndSaveFile(download.link);
        }
        dispatch(setDataSelectFile(dataFile));

        navigation.navigate('PlaySubtitleScreen', {
          language_code: lang?.language_code,
        });
      }
    } catch (error) {
      console.error('Error download data:', error);
      Alert.alert('Error', 'Failed to download the file. Please try again.');
    }
  };



  const checkDownload = async () => {
    try {
      const data = await fetchFileDownloadByFileId(file_id);

      if (data && data.is_download) {
        setCheckDownload(true);
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  useEffect(() => {
    checkDownload();
  }, [file_id]);

  useEffect(() => {
    fetchDataSubtitle();
    filterDataFile();
    filterLanguageName();
  }, [fetchDataSubtitle, filterDataFile]);

  return (
    <>
      {image_url === '' || image_url.includes('assets/') ? null : (
        <SafeAreaView style={{flexDirection: 'column'}}>
          <ScrollView>
            <Image
              style={{
                height: 412,
              }}
              source={{uri: image_url}}
              resizeMode="stretch"
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 24,
                backgroundColor: Colors.BackgroundIcon,
                borderRadius: 50,
                width: 32,
                height: 32,
                left: 16,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
              onPress={() => navigation.goBack()}>
              <icons.IconBack stroke={'white'} />
            </TouchableOpacity>

            <View>
              <LinearGradient
                colors={[
                  'rgba(25, 23, 28, 0.5)',
                  'rgba(25, 23, 28, 0)',
                  Colors.Background,
                  Colors.Background,
                ]}
                locations={[0, 0.4067, 0.7976, 1]}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 0.85}}
                style={styles.background}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: 20,
                  }}>
                  <Text style={styles.text_title_item}>
                    {dataSubtitle?.attributes.feature_details.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 12,
                    }}>
                    <Text style={styles.text_content_item}>
                      {dataSubtitle?.attributes.feature_details.feature_type}
                    </Text>
                    <icons.IconDot fill={Colors.MenuItem} />
                    <Text style={styles.text_content_item}>
                      {dataSubtitle?.attributes.feature_details.year}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 28}}>
                    <TouchableOpacity
                      onPress={() => handlePlay()}
                      style={[
                        {backgroundColor: Colors.Text},
                        styles.button_item,
                      ]}>
                      <icons.IconPlay fill={'#1C1717'} stroke={'#1C1717'} />
                      <Text
                        style={[
                          {color: Colors.Background},
                          styles.text_button_item,
                        ]}>
                        Play
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={{marginTop: 16, marginHorizontal: 16}}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: fonts.BeVietnamProSemiBold600,
                  lineHeight: 30,
                  color: Colors.TextTitleContent,
                  marginBottom: 20,
                }}>
                Information
              </Text>
              <LineLanguageDetailComponent
                title="Language"
                content={lang?.language_name}
              />
              <LineLanguageDetailComponent
                title="Downloads"
                content={dataSubtitle?.attributes.new_download_count.toString()}
              />
              <LineLanguageDetailComponent
                title="Upload date"
                content={formattedDate(dataSubtitle?.attributes.upload_date)}
              />
              <LineLanguageDetailComponent
                title="Uploader"
                content={dataSubtitle?.attributes.uploader.name}
              />
              <LineLanguageDetailComponent
                title="FPS"
                content={dataSubtitle?.attributes.fps.toString()}
              />
              <LineLanguageDetailComponent
                title="Release name"
                content={dataSubtitle?.attributes.release}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default LanguageDetailScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 420,
    position: 'absolute',
    bottom: 0,
  },
  text_title_item: {
    fontFamily: fonts.BeVietnamProSemiBold600,
    fontSize: 32,
    color: Colors.Text,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  text_content_item: {
    color: Colors.MenuItem,
    fontSize: 16,
    fontFamily: fonts.BeVietnamProRegular400,
    marginHorizontal: 10,
  },
  button_item: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1,
    gap: 4,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderColor: Colors.Text,
  },
  text_button_item: {
    fontFamily: fonts.BeVietnamProMedium500,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1,
  },
});
