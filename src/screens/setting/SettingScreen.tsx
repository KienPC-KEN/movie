import {
  Dimensions,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images} from '../../assets/images';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {icons} from '../../assets/icons';
import {SvgProps} from 'react-native-svg';
import {RootStackParamList} from '../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import InAppReview from 'react-native-in-app-review';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BottomTab'
>;

type ItemSettingProp = {
  title: string;
  IconComponent: React.FC<SvgProps> | null;
  onPressItem: () => void;
};

const ItemSetting: React.FC<ItemSettingProp> = ({
  title,
  IconComponent,
  onPressItem,
}) => {
  return (
    <TouchableOpacity style={styles.item_setting} onPress={onPressItem}>
      <Text style={styles.item_setting_text}>{title}</Text>
      {IconComponent === null ? null : (
        <View>
          <IconComponent />
        </View>
      )}
    </TouchableOpacity>
  );
};

const SettingScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const onPressItemSetting = (name?: string) => {
    navigation.navigate('SettingLanguageScreen');
  };

  const handleReview = () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then(hasFlowFinishedSuccessfully => {
          if (hasFlowFinishedSuccessfully) {
            redirectToStore();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const redirectToStore = () => {
    const appStoreUrl = 'itms-apps://itunes.apple.com/app/id618783545';
    const playStoreUrl = 'market://details?id=com.mv22';

    if (Platform.OS === 'ios') {
      Linking.openURL(appStoreUrl).catch(err =>
        console.error('Error opening App Store', err),
      );
    } else {
      Linking.openURL(playStoreUrl).catch(err =>
        console.error('Error opening Google Play Store', err),
      );
    }
  };

  useEffect(() => {
    const dimensions = Dimensions.get('window');
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }, [height, width]);

  return (
    <SafeAreaView style={[styles.container, {width: width, height: height}]}>
      <images.ImageBackground style={{position: 'absolute', left: 0}} />
      <Text style={styles.text_title}>Setting</Text>
      <ItemSetting
        onPressItem={() => onPressItemSetting('SettingLanguageScreen')}
        title="Language:"
        IconComponent={icons.IconLanguage}
      />
      <ItemSetting
        onPressItem={handleReview}
        title="Rate our application"
        IconComponent={icons.IconStar}
      />
      <ItemSetting
        onPressItem={() => Linking.openURL('https://www.google.co.uk/')}
        title="Privacy Policy"
        IconComponent={icons.IconPolicy}
      />
      <ItemSetting
        onPressItem={() => Linking.openURL('mailto:')}
        title="FeedBack and Report"
        IconComponent={icons.IconMesssage}
      />
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text_title: {
    color: Colors.TextTitleContent,
    fontSize: 32,
    fontFamily: fonts.BeVietnamProBold700,
    lineHeight: 38.4,
    marginVertical: 32,
    alignSelf: 'flex-start',
    marginTop: 60,
    marginLeft: 16,
  },
  item_setting: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 40,
    gap: 12,
    width: '90%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderColor: Colors.BorderColor,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  item_setting_text: {
    color: Colors.Text,
    fontSize: 16,
    fontFamily: fonts.BeVietnamProMedium500,
    lineHeight: 24,
  },
});
