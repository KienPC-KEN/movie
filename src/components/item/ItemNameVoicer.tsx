import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {fonts} from '../../assets/fonts';
import {Colors} from '../../assets/color';
type ItemNameVoicerProp = {
  voicer_name: string;
  handleSelectVoicer: () => void;
  isSelectVoicer: string;
};
const ItemNameVoicer: React.FC<ItemNameVoicerProp> = ({
  voicer_name,
  handleSelectVoicer,
  isSelectVoicer,
}) => {
  return (
    <TouchableOpacity
      onPress={handleSelectVoicer}
      style={
        isSelectVoicer.includes(voicer_name)
          ? styles.container_voice_select
          : styles.container_voice
      }>
      <Text style={styles.text_voice_name}>{voicer_name}</Text>
    </TouchableOpacity>
  );
};

export default ItemNameVoicer;

const styles = StyleSheet.create({
  container_voice: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#F2F2F20D',
    marginRight: 8,
  },
  container_voice_select: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#F2F2F20D',
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.TextTilte,
  },
  text_voice_name: {
    fontFamily: fonts.BeVietnamProRegular400,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.MenuItem,
  },
});
