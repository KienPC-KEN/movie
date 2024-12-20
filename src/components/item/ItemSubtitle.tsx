import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {ILanguage, ISubtitle} from '../../model';
import {fonts} from '../../assets/fonts';
import {Colors} from '../../assets/color';
import {icons} from '../../assets/icons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {formattedDate} from '../../utils';
import {Swipeable} from 'react-native-gesture-handler';
import Animated, {FadeInRight, FadeOutLeft} from 'react-native-reanimated';
import {setOneLanguage} from '../../redux/slices/LanguageSlice';
import {setSubtitleId} from '../../redux/slices/SubtitleSlice';

type ItemSubtitleProp = {
  item: ISubtitle;
  navigation: any;
  routeName?: string;
  onSelectSubtitle?: (item: ISubtitle) => void;
  handleDeleteSubtitle?: () => void;
  findDataSelectFile?: () => void;
};

const ItemSubtitle: React.FC<ItemSubtitleProp> = ({
  item,
  navigation,
  routeName,
  onSelectSubtitle,
  handleDeleteSubtitle,
  findDataSelectFile,
}) => {
  const languages = useSelector((state: RootState) => state.language.languages);
  const subtitleId = useSelector(
    (state: RootState) => state.subtitle.subtitle_id,
  );
  const [lang, setLang] = useState<ILanguage>();
  const [isSelectSubtitle, setSelectSubtitle] = useState(false);
  const dispatch = useDispatch();

  const getImageUrl = () => {
    const result = item.attributes.related_links.find(
      related_links => related_links.img_url,
    );
    return result?.img_url;
  };

  const filterLanguageName = useCallback(() => {
    const result = languages.find(
      language => language.language_code === item?.attributes.language,
    );

    setLang(result);
  }, []);

  const selectItemSubtitle = () => {
    onSelectSubtitle?.(item);
    dispatch(setOneLanguage(lang!));
    dispatch(setSubtitleId(item.attributes.subtitle_id));
    setSelectSubtitle(!isSelectSubtitle);
    navigation.goBack();
  };
  const renderRightActions = () => (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={styles.deleteButton}>
      <TouchableOpacity onPress={handleDeleteSubtitle}>
        <icons.IconDelete />
      </TouchableOpacity>
    </Animated.View>
  );
  useEffect(() => {
    filterLanguageName();
  }, []);

  return (
    <View
      style={{
        marginBottom: 24,
      }}>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          onPress={() => {
            routeName !== 'SelectSubtitleScreen'
              ? (findDataSelectFile!(),
                dispatch(setSubtitleId(item.attributes.subtitle_id)),
                navigation.navigate('PlaySubtitleScreen', {
                  language_code: item.attributes.language,
                }))
              : selectItemSubtitle();
          }}
          activeOpacity={routeName === 'SelectSubtitleScreen' ? 1 : 0.5}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 12,
          }}>
          {routeName === 'SelectSubtitleScreen' ? (
            <TouchableOpacity
              onPress={selectItemSubtitle}
              style={{marginRight: 8}}>
              {subtitleId === item.attributes.subtitle_id ? (
                <icons.IconTickTrue />
              ) : (
                <icons.IconTickFalse />
              )}
            </TouchableOpacity>
          ) : null}
          {getImageUrl() === '' || getImageUrl()?.includes('assets/') ? null : (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {routeName !== 'SelectSubtitleScreen' ? (
                <icons.IconPlaySubtitle
                  style={{position: 'absolute', zIndex: 10}}
                />
              ) : null}

              <Image
                source={{uri: getImageUrl()}}
                style={{width: 112, height: 162, borderRadius: 12}}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: 'column',
              marginLeft: 12,
              marginRight: 8,
              width: Dimensions.get('window').width - 180,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 20,
                fontFamily: fonts.BeVietnamProSemiBold600,
                lineHeight: 30,
                color: Colors.Text,
              }}>
              {item.attributes.feature_details.title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 2,
              }}>
              <Text style={styles.text_content_item}>{item.type}</Text>
              <icons.IconDot style={{marginRight: 10}} fill={Colors.MenuItem} />
              <Text style={styles.text_content_item}>
                {item.attributes.feature_details.year}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.BeVietnamProRegular400,
                color: Colors.Text,
                marginTop: 14,
              }}>
              {lang?.language_name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontFamily: fonts.BeVietnamProRegular400,
                color: Colors.TextTilte,
                marginTop: 8,
              }}>
              {item.attributes.release}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.BeVietnamProRegular400,
                color: Colors.TextTitleContent,
                marginTop: 2,
              }}>
              {formattedDate(item.attributes.upload_date)}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
      <View
        style={{
          height: 1,
          borderBottomWidth: 1,
          borderColor: Colors.BorderColor,
        }}></View>
    </View>
  );
};

export default ItemSubtitle;

const styles = StyleSheet.create({
  text_content_item: {
    color: Colors.MenuItem,
    fontSize: 14,
    fontFamily: fonts.BeVietnamProRegular400,
    textAlign: 'left',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: Colors.BorderColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});
