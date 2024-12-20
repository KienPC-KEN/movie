import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {images} from '../../assets/images';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import DocumentPicker from 'react-native-document-picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {setDataSelectFile} from '../../redux/slices/SubtitleSlice';
import {fetchProject} from '../../constants/database/services/ProjectService';
import {IProject} from '../../model';
import {FlatList} from 'react-native-gesture-handler';
import ItemProjectCaption from '../../components/item/ItemProjectCaption';
import {sortByDate} from '../../utils';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BottomTab'
>;

const CaptionScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [projects, setProjects] = useState<IProject[]>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleDocumentPickVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      const result = res[0];

      navigation.navigate('SelectVideoAndCaptionScreen', {
        video: result,
      });
      dispatch(setDataSelectFile({file_id: 0, cd_number: 0, file_name: ''}));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  const loadDataCaption = useCallback(() => {
    fetchProject(project => {
      const sortProjects = sortByDate(project);
      setProjects(sortProjects);
    });
  }, [fetchProject]);

  useFocusEffect(
    useCallback(() => {
      loadDataCaption();
    }, [loadDataCaption]),
  );

  useEffect(() => {
    const dimensions = Dimensions.get('window');
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }, [height, width]);

  return (
    <SafeAreaView style={[styles.container, {width: width, height: height}]}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center', paddingBottom: 32}}>
        <images.ImageBackground style={{position: 'absolute', left: 0}} />
        <Text style={styles.text_title}>Video Caption</Text>
        <images.ImageEmpty />

        <TouchableOpacity
          onPress={handleDocumentPickVideo}
          style={{
            width: 187,
            height: 56,
            marginTop: 24,
            justifyContent: 'center',
          }}>
          <images.ImageBackgroundButton style={styles.button_create_video} />
          <icons.IconAdd style={styles.icon_add} />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.TextTilte,
            fontSize: 18,
            lineHeight: 27,
            fontFamily: fonts.BeVietnamProMedium500,
            textAlign: 'center',
            marginTop: 12,
          }}>
          Import video
        </Text>
        <View
          style={{
            width: Dimensions.get('window').width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 32,
            paddingHorizontal: 16,
          }}>
          <Text
            style={{
              color: Colors.TextTitleContent,
              fontFamily: fonts.BeVietnamProSemiBold600,
              fontSize: 20,
              lineHeight: 30,
            }}>
            My project
          </Text>
        </View>

        {projects?.length === 0 ? (
          <Text
            style={{
              color: Colors.TextTitleContent,
              fontSize: 18,
              textAlign: 'center',
              marginTop: 32,
            }}>
            The list is empty.{'\n'} No project have been saved yet.
          </Text>
        ) : (
          <FlatList
            style={{marginLeft: 16, marginTop: 12, width: width - 32}}
            horizontal
            data={projects}
            keyExtractor={item => item.id.toString()}
            renderItem={item => (
              <ItemProjectCaption project={item.item} navigation={navigation} />
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CaptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text_title: {
    color: Colors.TextTilte,
    fontSize: 32,
    letterSpacing: -1,
    fontFamily: fonts.BeVietnamProSemiBold600,
    lineHeight: 38.4,
    marginVertical: 42,
  },
  button_create_video: {
    position: 'absolute',
  },

  icon_add: {
    zIndex: 100,
    alignSelf: 'center',
  },
});
