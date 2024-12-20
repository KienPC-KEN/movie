import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IMovie} from '../../model';

type ItemMovieProp = {
  item: IMovie;
  navigation: any;
  resetSearch: () => void;
};

const ItemMovie: React.FC<ItemMovieProp> = ({
  item,
  navigation,
  resetSearch,
}) => {
  return (
    <TouchableOpacity
      onPress={() => (
        resetSearch(), navigation.navigate('DetailMovieSearchScreen', {item})
      )}>
      <View style={styles.container_item}>
        {item.attributes?.img_url === '' ||
        item?.attributes?.img_url.includes('assets/') ? null : (
          <Image
            source={{uri: item?.attributes?.img_url}}
            style={{width: 175, height: 233, borderRadius: 16}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemMovie;

const styles = StyleSheet.create({
  container_item: {
    margin: 12,
  },
});
