import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {icons} from '../assets/icons';
import {Colors} from '../assets/color';
import {fonts} from '../assets/fonts';
import {IFiles, IFileSubTitleAndUploadDate, ISubtitle} from '../model';
import ItemFileSubtitle from './item/ItemFileSubtitle';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

type BottomSheetFileSubtitleProp = {
  data_subtitle: ISubtitle[];
  toggleSheet: () => void;
  navigation: any;
};

const BottomSheetFileSubtitle: React.FC<BottomSheetFileSubtitleProp> = ({
  data_subtitle,
  toggleSheet,
  navigation,
}) => {
  const [fileSubtitle, setFileSubtitle] =
    useState<IFileSubTitleAndUploadDate[]>();
  const languages = useSelector((state: RootState) => state.language.languages);
  const [languageName, setLanguageName] = useState('');

  useEffect(() => {
    const name = languages
      .filter(language =>
        data_subtitle.find(
          item => item.attributes.language === language.language_code,
        ),
      )
      .map(language => language.language_name);
    setLanguageName(name.toString());
  }, [languages]);

  const countFileSubtitle = () => {
    let count = 0;
    data_subtitle.forEach(item => {
      count += item.attributes.files.length;
    });
    return count;
  };

  useEffect(() => {
    const files = data_subtitle.flatMap(item =>
      item.attributes.files.map((file: IFiles) => {
        return {file_subtile: file, upload_date: item.attributes.upload_date};
      }),
    );
    setFileSubtitle(files);
  }, [data_subtitle]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={toggleSheet}>
          <icons.IconBack stroke={Colors.MenuItem} />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.Text,
            fontSize: 16,
            backgroundColor: Colors.BackgroundIcon,
            padding: 10,
            borderRadius: 50,
          }}>
          {languageName}
        </Text>
      </View>

      <Text style={styles.text_count_file_subtitle}>
        {countFileSubtitle()} file subtitles
      </Text>
      <FlatList
        style={{marginTop: 4}}
        data={fileSubtitle}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (
          <ItemFileSubtitle file_subtitle={item.item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default BottomSheetFileSubtitle;

const styles = StyleSheet.create({
  container: {
    height: 318,
    backgroundColor: Colors.BackgroundPopup,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    width: Dimensions.get('window').width,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  text_count_file_subtitle: {
    fontSize: 14,
    fontFamily: fonts.BeVietnamProSemiBold600,
    color: Colors.MenuItem,
    marginTop: 24,
  },
});
