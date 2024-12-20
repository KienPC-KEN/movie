import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {images} from '../../assets/images';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {IFileDownload, IFiles, ISubtitle} from '../../model';
import ItemSubtitle from '../../components/item/ItemSubtitle';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  fetchFileDownload,
  removeFileDownload,
} from '../../constants/database/services/FileDownloadService';
import {fetchSearchSubtitleApi} from '../../constants/api/axios';
import {useDispatch} from 'react-redux';
import {setDataSelectFile} from '../../redux/slices/SubtitleSlice';

const SubtitleScreen = () => {
  const dispatch = useDispatch();
  const [subtitleDownload, setSubtitleDownload] = useState<ISubtitle[]>();
  const navigation = useNavigation();
  const widthScreen = useMemo(
    () => Dimensions.get('window').width - 32,
    [Dimensions.get('window').width],
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [fileDownloads, setfileDownloads] = useState<IFileDownload[]>();
  const [file, setFile] = useState<(IFiles | undefined)[]>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchDataFileDownload();
    }, 1000);
  }, []);

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

  const findDataSelectFile = (item: ISubtitle) => {
    const result = file?.find(file =>
      item.attributes.files.find(item => item.file_id === file?.file_id),
    );

    if (result) {
      dispatch(setDataSelectFile(result));
    }
  };
  const handleDeleteSubtitle = (item: ISubtitle) => {
    const result = item.attributes.files.find(item_file =>
      fileDownloads?.find(file => file.id_file === item_file.file_id),
    );
    removeFileDownload(result?.file_id!);
    fetchDataFileDownload();
  };
  useFocusEffect(
    useCallback(() => {
      fetchDataFileDownload();
    }, [fetchDataFileDownload]),
  );

  useEffect(() => {
    filterDataFileDownload();
  }, [filterDataFileDownload]);

  useEffect(() => {
    const dimensions = Dimensions.get('window');
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }, [height, width]);

  return (
    <SafeAreaView style={[styles.container, {width: width, height: height}]}>
      <images.ImageBackground style={{position: 'absolute', left: 0}} />

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}>
          {subtitleDownload && subtitleDownload.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={{marginTop: 33, width: widthScreen}}
              data={subtitleDownload}
              keyExtractor={item => item.id.toString()}
              renderItem={item => (
                <ItemSubtitle
                  item={item.item}
                  navigation={navigation}
                  findDataSelectFile={() => findDataSelectFile(item.item)}
                  handleDeleteSubtitle={() => {
                    handleDeleteSubtitle(item.item);
                  }}
                />
              )}
            />
          ) : (
            <>
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
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubtitleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
