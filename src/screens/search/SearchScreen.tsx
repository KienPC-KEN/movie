import {
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../assets/color';
import {images} from '../../assets/images';
import {fonts} from '../../assets/fonts';
import {icons} from '../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import {
  fetchDataLanguageApi,
  fetchDataSearchApi,
} from '../../constants/api/axios';
import ItemMovie from '../../components/item/ItemMovie';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {setDataLanguage} from '../../redux/slices/LanguageSlice';
import {ILanguage, IMovie} from '../../model';
import {
  createTableFileDownload,
  createTableMovie,
  createTableProject,
  createTablesLanguage,
} from '../../constants/database/db';
import {addAllLanguages} from '../../constants/database/services/LanguageService';

const SearchScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<any>();
  const [searchResults, setSearchResults] = useState<IMovie[]>();
  const [languages, setLanguages] = useState<ILanguage[]>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const resetSearch = () => {
    setSearchTerm('');
    setSearchResults(undefined);
  };

  const searchFunction = async (term: string) => {
    try {
      const moviesSearch = await fetchDataSearchApi(term);
      setSearchResults(moviesSearch);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangeTextInput = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const value = event.nativeEvent.text;
      setSearchTerm(value);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      setTypingTimeout(
        setTimeout(() => {
          searchFunction(value);
        }, 100),
      );
    },
    [searchTerm],
  );

  const fetchDataLanguage = useCallback(async () => {
    try {
      const dataLanguage = await fetchDataLanguageApi();

      setLanguages(dataLanguage);
      dispatch(setDataLanguage(dataLanguage));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [languages]);

  const initializeApp = async () => {
    createTablesLanguage();
    createTableMovie();
    createTableFileDownload();
    createTableProject();
  };

  useEffect(() => {
    fetchDataLanguage();
    initializeApp();
  }, []);

  useEffect(() => {
    if (languages) {
      addAllLanguages(languages);
    }
  }, [languages]);

  useEffect(() => {
    const dimensions = Dimensions.get('window');
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }, [height, width]);

  return (
    <SafeAreaView style={[styles.container, {width: width, height: height}]}>
      <images.ImageBackground style={{position: 'absolute', left: 0}} />
      <View
        style={{
          width: Dimensions.get('window').width,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 24,
          paddingHorizontal: 16,
        }}>
        <Text style={styles.text_title}>Search The Movie</Text>
      </View>
      <View style={styles.input_search}>
        <icons.IconSearch width={28} height={28} stroke={Colors.IconSearch} />
        <TextInput
          style={styles.input}
          value={searchTerm}
          placeholder="Search name movie"
          placeholderTextColor={Colors.TextPlaceholder}
          onChange={e => handleChangeTextInput(e)}
        />
      </View>
      {searchResults === undefined ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <images.ImageEmpty />
          <Text
            style={{
              color: Colors.Text,
              fontSize: 16,
              fontFamily: fonts.BeVietnamProMedium500,
              lineHeight: 24,
              marginTop: 32,
            }}>
            Find the movie in the search box above
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            style={{
              marginTop: 18,
              width: Dimensions.get('window').width - 32,
            }}
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={item => (
              <ItemMovie
                navigation={navigation}
                item={item.item}
                resetSearch={() => resetSearch()}
              />
            )}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            numColumns={width > 900 ? 5 : 2}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text_title: {
    width: 198,
    color: Colors.TextTilte,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
    fontFamily: fonts.BeVietnamProSemiBold600,
    marginTop: 20,
  },
  input_search: {
    paddingHorizontal: 16,
    width: '90%',
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 50,
    borderWidth: 1,
    paddingVertical: 8,
    gap: 8,
    borderColor: Colors.BorderColor,
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.BeVietnamProRegular400,
    letterSpacing: -1,
    color: Colors.TextPlaceholder,
  },
});
