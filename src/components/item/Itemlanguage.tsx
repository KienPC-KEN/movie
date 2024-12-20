import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../assets/color';
import {Switch} from 'react-native-switch';
import {fonts} from '../../assets/fonts';
import {ILanguage} from '../../model';
import {modifyLanguage} from '../../constants/database/services/LanguageService';

type languageProp = {
  language: ILanguage;
};

const ItemLanguage: React.FC<languageProp> = ({language}) => {
  const [isEnabled, setIsEnabled] = useState(language.status);

  useEffect(() => {
    setIsEnabled(language.status);
  }, [language.status]);

  const handleToggleSwitch = useCallback(
    async (value: boolean) => {
      setIsEnabled(value);
      await modifyLanguage({...language, status: value});
    },

    [language],
  );
  return (
    <View style={styles.container_item}>
      <View
        style={{
          marginVertical: 13,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.item_name}>{language.language_name}</Text>
        <Switch
          value={isEnabled}
          onValueChange={handleToggleSwitch}
          backgroundActive={Colors.TextTilte}
          backgroundInactive={Colors.BackgroundInactive}
          circleActiveColor={Colors.Text}
          circleInActiveColor={Colors.MenuItem}
          circleSize={22}
          renderActiveText={false}
          renderInActiveText={false}
          innerCircleStyle={{alignItems: 'center', justifyContent: 'center'}}
          barHeight={26}
          switchWidthMultiplier={2.2}
        />
      </View>

      <View
        style={{
          height: 1,
          borderBottomWidth: 1,
          borderColor: Colors.BorderColor,
        }}></View>
    </View>
  );
};

export default ItemLanguage;

const styles = StyleSheet.create({
  container_item: {
    marginBottom: 12,
  },
  item_name: {
    fontFamily: fonts.BeVietnamProMedium500,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.Text,
  },
});
