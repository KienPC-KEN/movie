import {
  FlatList,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {icons} from '../../assets/icons';
import ItemLanguage from '../../components/item/Itemlanguage';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {ILanguage} from '../../model';
import {fetchAllLanguages} from '../../constants/database/services/LanguageService';
import {setDataLanguage} from '../../redux/slices/LanguageSlice';
import {sortLanguages} from '../../utils';

const SettingLanguageScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ILanguage[]>();
  const languages = useSelector((state: RootState) => state.language.languages);

  const sortedLanguages = sortLanguages(languages);

  const searchFunction = async (term: string) => {
    try {
      if (!languages) {
        setSearchResults([]);
        return;
      }
      const regex = new RegExp(term, 'i');
      const filteredLanguages = languages.filter(language =>
        regex.test(language.language_name),
      );
      setSearchResults(filteredLanguages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChangeTextInput = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const value = event.nativeEvent.text;
      setSearchTerm(value);

      searchFunction(value);
    },
    [searchTerm],
  );

  useEffect(() => {
    fetchAllLanguages(languages => {
      dispatch(setDataLanguage(languages));
    });
  }, [sortedLanguages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignSelf: 'flex-start', marginTop: 24, marginLeft: 16}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <icons.IconBack stroke={Colors.MenuItem} />
        </TouchableOpacity>
        <Text style={{fontSize: 32, color: Colors.Text, marginTop: 12}}>
          Languages
        </Text>
      </View>

      <View style={styles.input_search}>
        <icons.IconSearch width={28} height={28} stroke={Colors.IconSearch} />
        <TextInput
          style={styles.input}
          value={searchTerm}
          placeholder="Search"
          placeholderTextColor={Colors.TextPlaceholder}
          onChange={e => handleChangeTextInput(e)}
        />
      </View>

      {searchTerm?.length !== 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{width: '90%', marginTop: 20}}
          data={searchResults}
          keyExtractor={item => item.language_code}
          renderItem={item => <ItemLanguage language={item.item} />}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{width: '90%', marginTop: 20}}
          data={sortedLanguages}
          keyExtractor={item => item.language_code}
          renderItem={item => <ItemLanguage language={item.item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default SettingLanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input_search: {
    paddingHorizontal: 16,
    width: '90%',
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 50,
    borderWidth: 1,
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
