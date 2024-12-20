import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {IFileDownload, IFiles, ISubtitle} from '../../model';
import ItemSubtitle from '../../components/item/ItemSubtitle';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {setDataSelectFile} from '../../redux/slices/SubtitleSlice';
import {images} from '../../assets/images';
import {fetchFileDownload} from '../../constants/database/services/FileDownloadService';
import {fetchSearchSubtitleApi} from '../../constants/api/axios';

const SelectSubtitleScreen = () => {
  const [subtitleDownload, setSubtitleDownload] = useState<ISubtitle[]>();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<(IFiles | undefined)[]>();
  const [fileDownloads, setfileDownloads] = useState<IFileDownload[]>();

  const fetchDataFileDownload = useCallback(() => {
    fetchFileDownload(async file_downloads => {
      const file = file_downloads.filter(item => item.is_download === true);
      setfileDownloads(file);
      let allSubtitles: ISubtitle[] = [];
      for (const item of file) {
        const subtitles: ISubtitle[] = await fetchSearchSubtitleApi(
          item.imdb_id,
        );
        const result = subtitles.filter(subtitle =>
          subtitle.attributes.files.find(file => file.file_id === item.id_file),
        );
        allSubtitles = allSubtitles.concat(result);
      }
      setSubtitleDownload(allSubtitles);
    });
  }, []);

  const filterDataFileDownload = useCallback(() => {
    if (subtitleDownload && fileDownloads) {
      const result = subtitleDownload.map(item =>
        item.attributes.files.find(item_file =>
          fileDownloads.find(file => file.id_file === item_file.file_id),
        ),
      );
      setFile(result);
    }
  }, [subtitleDownload]);

  useFocusEffect(
    useCallback(() => {
      fetchDataFileDownload();
    }, [fetchDataFileDownload]),
  );

  useEffect(() => {
    filterDataFileDownload();
  }, [filterDataFileDownload]);

  const handleSelectSubtitle = (item: ISubtitle) => {
    const result = file?.find(file =>
      item.attributes.files.find(item => item.file_id === file?.file_id),
    );
    if (result) {
      dispatch(setDataSelectFile(result));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: Dimensions.get('window').width,
          paddingHorizontal: 16,
          marginTop: 24,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <icons.IconBack stroke={Colors.MenuItem} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.BeVietnamProRegular400,
            color: Colors.Text,
          }}>
          Select subtitles
        </Text>
        <View style={{width: 24, height: 24}}></View>
      </View>

      {subtitleDownload && subtitleDownload.length > 0 ? (
        <FlatList
          style={{marginTop: 24}}
          data={subtitleDownload}
          keyExtractor={item => item.id.toString()}
          renderItem={item => (
            <ItemSubtitle
              item={item.item}
              navigation={navigation}
              routeName={route.name}
              onSelectSubtitle={handleSelectSubtitle}
            />
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}>
          <images.ImageEmpty />
          <Text
            style={{
              color: Colors.Text,
              fontFamily: fonts.BeVietnamProMedium500,
              fontSize: 16,
              lineHeight: 24,
              textAlign: 'center',
              marginTop: 32,
            }}>
            The list is empty. No movie subtitles have been saved yet.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SelectSubtitleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
