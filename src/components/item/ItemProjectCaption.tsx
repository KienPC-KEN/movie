import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IProject} from '../../model';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {formattedDate} from '../../utils';

type ItemProjectCaptionProp = {
  project: IProject;
  navigation: any;
};

const ItemProjectCaption: React.FC<ItemProjectCaptionProp> = ({
  project,
  navigation,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('PlayCaptionScreen', {project})}
      style={styles.item_container}>
      <View style={{padding: 12}}>
        <Image
          style={{width: 213, height: 148, borderRadius: 8}}
          source={{uri: project.image_project}}
        />
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            fontFamily: fonts.BeVietnamProSemiBold600,
            color: Colors.TextTitleContent,
            marginTop: 8,
          }}>
          {project.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.BeVietnamProRegular400,
            color: Colors.MenuItem,
          }}>
          {formattedDate(project.date_upload)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemProjectCaption;

const styles = StyleSheet.create({
  item_container: {
    width: 237,
    height: 225,
    backgroundColor: Colors.BackgroundPopup,
    alignItems: 'center',
    borderRadius: 16,
    gap: 8,
    marginRight: 12,
  },
});
