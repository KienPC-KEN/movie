import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {icons} from '../../assets/icons';
import {ILanguage} from '../../model';

type languageProp = {
  language: ILanguage;
  countFileSubtitle: {[key: string]: number} | undefined;
  toggleSheet: () => void;
};

const ItemLanguageOther: React.FC<languageProp> = ({
  language,
  countFileSubtitle,
  toggleSheet
}) => {
  return (
    <TouchableOpacity onPress={toggleSheet} style={styles.container_item}>
      <View
        style={{
          marginVertical: 13,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.item_name}>{language.language_name}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.BeVietnamProSemiBold600,
              color: Colors.TextTitleContent,
              marginRight: 4,
            }}>
            {countFileSubtitle && countFileSubtitle[language.language_code]
              ? `${countFileSubtitle[language.language_code]} file subtitles`
              : '0 file subtitles'}
          </Text>
          <icons.IconArrowRight style={{marginRight: 16}} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemLanguageOther;

const styles = StyleSheet.create({
  container_item: {
    marginBottom: 12,
    backgroundColor: Colors.BackgroundPopup,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  item_name: {
    fontFamily: fonts.BeVietnamProMedium500,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.Text,
    marginLeft: 16,
  },
});
