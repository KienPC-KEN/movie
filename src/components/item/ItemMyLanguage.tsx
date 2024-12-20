import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {ILanguage} from '../../model';

type languageProp = {
  language: ILanguage;
  countFileSubtitle: {[key: string]: number} | undefined;
  toggleSheet: () => void;
};

const ItemMyLanguage: React.FC<languageProp> = ({
  language,
  countFileSubtitle,
  toggleSheet,
}) => {
  return (
    <TouchableOpacity onPress={toggleSheet} style={styles.container_item}>
      <View style={{flexDirection: 'row', padding: 16}}>
        <Text
          style={{
            color: Colors.MenuItem,
            fontSize: 14,
            fontFamily: fonts.BeVietnamProRegular400,
          }}>
          {language.language_name}
        </Text>
        <icons.IconArrowRight
          style={{position: 'absolute', right: 16, top: 16}}
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: fonts.BeVietnamProSemiBold600,
          color: Colors.TextTitleContent,
          position: 'absolute',
          bottom: 16,
          marginHorizontal: 16,
        }}>
        {countFileSubtitle && countFileSubtitle[language.language_code]
          ? `${countFileSubtitle[language.language_code]} file subtitles`
          : '0 file subtitles'}
      </Text>
    </TouchableOpacity>
  );
};

export default ItemMyLanguage;

const styles = StyleSheet.create({
  container_item: {
    width: 142,
    height: 122,
    backgroundColor: Colors.BackgroundPopup,
    marginLeft: 16,
    borderRadius: 16,
    justifyContent: 'flex-start',
  },
});
