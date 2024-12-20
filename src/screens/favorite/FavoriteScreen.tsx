import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {images} from '../../assets/images';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {IMovie} from '../../model';
import ItemMovieFavorite from '../../components/item/ItemMovieFavorite';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  fetchAllMovie,
  updateMovieFavorite,
} from '../../constants/database/services/MovieService';
import {
  GestureHandlerRootView,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler';

const FavoriteScreen = () => {
  const [movieFavorites, setMovieFavorites] = useState<IMovie[]>();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isFavorite, setFavorite] = useState<boolean>(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const widthScreen = useMemo(
    () => Dimensions.get('window').width - 32,
    [Dimensions.get('window').width],
  );
  const handleFavorite = async (item: IMovie) => {
    await updateMovieFavorite({...item, isFavorite: isFavorite});
    await loadDataFavorite();
    Alert.alert('Succes', 'Removed favorite successfully!');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      loadDataFavorite();
    }, 1000);
  }, []);

  const loadDataFavorite = useCallback(() => {
    fetchAllMovie(movies => {
      const result = movies.filter(item => item.isFavorite === true);

      setMovieFavorites(result);
    });
  }, [fetchAllMovie]);

  useFocusEffect(
    useCallback(() => {
      loadDataFavorite();
    }, [loadDataFavorite]),
  );

  useEffect(() => {
    const dimensions = Dimensions.get('window');
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }, [height, width]);

  return (
    <GestureHandlerRootView
      style={[styles.container, {width: width, height: height}]}>
      <images.ImageBackground style={{position: 'absolute', left: 0}} />

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}>
          {movieFavorites && movieFavorites.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={{marginTop: 33, width: widthScreen}}
              data={movieFavorites}
              keyExtractor={item => item.id}
              renderItem={item => (
                <ItemMovieFavorite
                  item={item.item}
                  navigation={navigation}
                  handleFavorite={() => handleFavorite(item.item)}
                  setFavorite={() => setFavorite(!item.item.isFavorite)}
                />
              )}
            />
          ) : (
            <>
              <images.ImageEmpty />
              <Text
                style={{
                  color: Colors.Text,
                  fontFamily: fonts.BeVietnamProMedium500,
                  fontSize: 16,
                  lineHeight: 24,
                  textAlign: 'center',
                  marginTop: 32,
                }}>
                The list is empty. No movie favorite have been saved yet.
              </Text>
            </>
          )}
        </SafeAreaView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
