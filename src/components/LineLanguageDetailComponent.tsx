import {Text, View} from 'react-native';
import React from 'react';
import {fonts} from '../assets/fonts';
import {Colors} from '../assets/color';

type LineLanguageDetailComponentProp = {
  title: string;
  content?: string;
};

const LineLanguageDetailComponent: React.FC<
  LineLanguageDetailComponentProp
> = ({content, title}) => {
  return (
    <View style={{marginBottom: 16}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: fonts.BeVietnamProMedium500,
            fontSize: 16,
            color: Colors.Text,
          }}>
          {title}
        </Text>
        <Text
          style={{
            fontFamily: fonts.BeVietnamProRegular400,
            fontSize: 16,
            color: Colors.MenuItem,
            textAlign: 'right',
            width: 230,
          }}>
          {content}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          borderBottomWidth: 1,
          borderColor: Colors.BorderColor,
          paddingTop: 8,
        }}></View>
    </View>
  );
};

export default LineLanguageDetailComponent;
