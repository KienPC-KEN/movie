import React, {useMemo} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import HTML, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import {Colors} from '../assets/color';
import {fonts} from '../assets/fonts';

type SubtitleComponentProp = {
  subtitle: string;
  fontSize: number;
  isNextSubtitle: boolean;
  opacity: number;
};

const SubtitleComponent: React.FC<SubtitleComponentProp> = React.memo(
  ({subtitle, fontSize, isNextSubtitle, opacity}) => {
    const htmlSource = useMemo(
      () => ({
        html: `<div style="font-size: ${fontSize}px; color: ${
          Colors.Text
        }; opacity: ${isNextSubtitle ? opacity : 1}">${subtitle}</div>`,
      }),
      [subtitle, fontSize],
    );
    return (
      <View style={styles.subtitleContainer}>
        <HTML
          source={htmlSource}
          contentWidth={Dimensions.get('window').width}
          tagsStyles={{
            div: {
              fontSize: fontSize,
              color: Colors.Text,
              fontFamily: fonts.BeVietnamProRegular400,
              marginHorizontal: 16,
              textAlign: 'left',
            },
            i: {
              fontStyle: 'italic',
            },
          }}
          customHTMLElementModels={{
            font: HTMLElementModel.fromCustomModel({
              tagName: 'font',
              contentModel: HTMLContentModel.textual,
              mixedUAStyles: {
                color: Colors.Text,
                fontFamily: fonts.BeVietnamProRegular400,
              },
            }),
          }}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  subtitleContainer: {
    marginBottom: 10,
    marginTop: 24,
  },
});

export default SubtitleComponent;
