import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {formattedDate} from '../../utils';
import {IFileSubTitleAndUploadDate} from '../../model';

type ItemFileSubtitleProp = {
  file_subtitle: IFileSubTitleAndUploadDate;
  navigation: any;
};

const ItemFileSubtitle: React.FC<ItemFileSubtitleProp> = ({
  file_subtitle,
  navigation,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('LanguageDetailScreen', {
          file_id: file_subtitle.file_subtile.file_id,
        })
      }
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.BorderColor,
        paddingVertical: 8,
        marginTop: 12,
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'column', width: 325}}>
        <Text
          numberOfLines={1}
          style={{
            color: Colors.TextTilte,
            fontSize: 16,
            fontFamily: fonts.BeVietnamProRegular400,
            lineHeight: 24,
          }}>
          {file_subtitle.file_subtile?.file_name}
        </Text>
        <Text
          style={{
            color: Colors.TextTitleContent,
            fontSize: 14,
            fontFamily: fonts.BeVietnamProRegular400,
            lineHeight: 21,
            marginTop: 4,
          }}>
          {formattedDate(file_subtitle.upload_date)}
        </Text>
      </View>

      <icons.IconEye style={{position: 'relative'}} />
    </TouchableOpacity>
  );
};

export default ItemFileSubtitle;

const styles = StyleSheet.create({});
