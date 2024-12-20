import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {icons} from '../../assets/icons';
import {fonts} from '../../assets/fonts';
import {Colors} from '../../assets/color';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {fetchSearchSubtitleApi} from '../../constants/api/axios';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {ILanguage, IMovie, ISubtitle} from '../../model';
import ItemMyLanguage from '../../components/item/ItemMyLanguage';
import ItemLanguageOther from '../../components/item/ItemLanguageOther';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheetFileSubtitle from '../../components/BottomSheetFileSubtitle';
import {setDataSubtitleMovie} from '../../redux/slices/SubtitleSlice';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {
  addMovieFovirte,
  fetchMovieById,
  updateMovieFavorite,
} from '../../constants/database/services/MovieService';
import LoadingSpinner from '../../components/LoadingSpinner';
import {fetchAllLanguages} from '../../constants/database/services/LanguageService';
import {setDataLanguage} from '../../redux/slices/LanguageSlice';

type Param = {
  DetailMovieSearchScreen: {
    item: IMovie;
  };
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DetailMovieSearchScreen = () => {
  const route = useRoute<RouteProp<Param, 'DetailMovieSearchScreen'>>();
  const {item} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [myLanguages, setMyLanguages] = useState<ILanguage[]>();
  const [subtitles, setSubtitles] = useState<ISubtitle[]>([]);
  const languages = useSelector((state: RootState) => state.language.languages);
  const [countFileSubtitle, setCountFileSubtitle] = useState<{
    [key: string]: number;
  }>();
  const [languageDetailMovie, setLanguageDetailMovie] = useState<ILanguage[]>();
  const [isOpen, setOpen] = useState(false);
  const [dataSubtitle, setDataSubtitle] = useState<ISubtitle[]>([]);
  const [isFavorite, setFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const toggleSheetAndSaveLanguageCode = (language_code?: string) => {
    setOpen(!isOpen);
    getFilesByLanguageCode(language_code!);
  };

  const fetchDataLanguage = useCallback(async () => {
    try {
      const dataImdb_id = await fetchSearchSubtitleApi(
        item.attributes?.imdb_id,
      );
      setSubtitles(dataImdb_id);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  const handleFavorite = async () => {
    await updateMovieFavorite({...item, isFavorite: !isFavorite});
  };

  const filterMyLanguage = useCallback(() => {
    const result = languages.filter(language => language.status === true);
    setMyLanguages(result);
  }, [languages]);

  const filterCountFileSubtitle = useCallback(() => {
    const subtitleCounts: {[key: string]: number} = {};
    subtitles.forEach((subtitle: ISubtitle) => {
      const matchingLanguage = languages.filter(
        language => language.language_code === subtitle.attributes.language,
      );

      if (matchingLanguage) {
        if (!subtitleCounts[subtitle.attributes?.language]) {
          subtitleCounts[subtitle.attributes?.language] = 0;
        }
        subtitleCounts[subtitle.attributes?.language] +=
          subtitle.attributes.files.length;
      }
    });
    if (subtitleCounts) {
      setCountFileSubtitle(subtitleCounts);
    }
  }, [subtitles, languages]);

  const filterLanguageDetailMovie = useCallback(() => {
    const result = languages.filter(language =>
      subtitles.some(
        (subtitle: ISubtitle) =>
          language.language_code === subtitle.attributes.language,
      ),
    );

    const resultFilterMyLanguage = result.filter(
      language => language.status === false,
    );
    setLanguageDetailMovie(resultFilterMyLanguage);
  }, [languages, subtitles]);

  const getFilesByLanguageCode = (language_code: string) => {
    const dataSubtitle = subtitles
      .filter(
        (subtitle: ISubtitle) => subtitle.attributes.language === language_code,
      )
      .map((subtitle: ISubtitle) => subtitle);

    setDataSubtitle(dataSubtitle);
    dispatch(setDataSubtitleMovie(dataSubtitle));
  };

  useEffect(() => {
    filterCountFileSubtitle();
    filterLanguageDetailMovie();
    filterMyLanguage();
  }, [filterCountFileSubtitle, filterLanguageDetailMovie]);

  useEffect(() => {
    fetchAllLanguages(languages => {
      dispatch(setDataLanguage(languages));
    });

    fetchDataLanguage();
  }, [fetchDataLanguage]);

  useEffect(() => {
    const getMovieById = async () => {
      if (item) {
        try {
          await addMovieFovirte(item);
          const fetchedMovie = await fetchMovieById(item.id);

          if (fetchedMovie) {
            setFavorite(fetchedMovie.isFavorite!);
          }
        } catch (error) {
          console.error('Error fetching movie:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getMovieById();
  }, [item]);
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <icons.IconBack
            stroke={Colors.MenuItem}
            style={{marginTop: 48, marginLeft: 16}}
          />
        </TouchableOpacity>

        {item.attributes.img_url === '' ||
        item.attributes?.img_url.includes('assets/') ? null : (
          <View style={{alignItems: 'center', marginTop: 4}}>
            <Image
              source={{uri: item.attributes.img_url}}
              style={{
                width: 157,
                height: 216,
                borderRadius: 16,
                justifyContent: 'center',
              }}
            />
          </View>
        )}
        <Text style={styles.text_title_item}>{item.attributes.title}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12,
          }}>
          <Text style={styles.text_content_item}>{item.type}</Text>
          <icons.IconDot fill={Colors.MenuItem} />
          <Text style={styles.text_content_item}>{item.attributes.year}</Text>
        </View>
        <View style={{alignItems: 'center', marginTop: 24}}>
          <TouchableOpacity
            onPress={() => {
              setFavorite(!isFavorite);
              handleFavorite();
            }}
            style={styles.button_add_favorite}>
            <icons.IconFavorite
              stroke={!isFavorite ? '#1C1717' : Colors.TextTilte}
              fill={!isFavorite ? 'transparent' : Colors.TextTilte}
            />

            <Text
              style={{
                color: '#1C1717',
                marginLeft: 4,
                fontSize: 16,
                fontFamily: fonts.BeVietnamProMedium500,
              }}>
              {!isFavorite ? '  Add to favorite' : ' Remove from favorite'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: Colors.TextTitleContent,
            fontSize: 20,
            fontFamily: fonts.BeVietnamProSemiBold600,
            marginTop: 32,
            marginLeft: 16,
          }}>
          My language
        </Text>
        <FlatList
          style={{marginTop: 12}}
          data={myLanguages}
          keyExtractor={item => item.language_code}
          renderItem={item => (
            <ItemMyLanguage
              toggleSheet={() =>
                toggleSheetAndSaveLanguageCode(item.item.language_code)
              }
              countFileSubtitle={countFileSubtitle}
              language={item.item}
            />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
        <Text
          style={{
            color: Colors.TextTitleContent,
            fontSize: 20,
            fontFamily: fonts.BeVietnamProSemiBold600,
            marginTop: 24,
            marginLeft: 16,
          }}>
          Other language
        </Text>
        <View>
          <FlatList
            style={{marginTop: 12}}
            data={languageDetailMovie}
            keyExtractor={item => item.language_code}
            renderItem={item => (
              <ItemLanguageOther
                toggleSheet={() =>
                  toggleSheetAndSaveLanguageCode(item.item.language_code)
                }
                countFileSubtitle={countFileSubtitle}
                language={item.item}
              />
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      {isOpen && (
        <>
          <AnimatedPressable
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
            onPress={() => toggleSheetAndSaveLanguageCode()}
          />
          <Animated.View
            style={[styles.sheet]}
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown}>
            <BottomSheetFileSubtitle
              navigation={navigation}
              toggleSheet={() => toggleSheetAndSaveLanguageCode()}
              data_subtitle={dataSubtitle}
            />
          </Animated.View>
        </>
      )}
    </GestureHandlerRootView>
  );
};

export default DetailMovieSearchScreen;

const styles = StyleSheet.create({
  text_title_item: {
    fontFamily: fonts.BeVietnamProSemiBold600,
    fontSize: 32,
    color: Colors.Text,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 29.5,
  },
  text_content_item: {
    color: Colors.MenuItem,
    fontSize: 16,
    fontFamily: fonts.BeVietnamProRegular400,
    marginHorizontal: 10,
  },
  button_add_favorite: {
    backgroundColor: Colors.Text,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 10,
    width: 235,
  },
  sheet: {
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.BackDropColor,
    zIndex: 1,
  },
});
