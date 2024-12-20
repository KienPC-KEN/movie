import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IMovie} from '../../model';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';

type ItemMovieFavoriteProp = {
  item: IMovie;
  navigation: any;
  setFavorite: () => void;
  handleFavorite: () => void;
};

const ItemMovieFavorite: React.FC<ItemMovieFavoriteProp> = ({
  item,
  navigation,
  handleFavorite,
  setFavorite,
}) => {
  return (
    <View
      style={{
        marginBottom: 24,
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailMovieSearchScreen', {item})}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 12,
        }}>
        {item.attributes?.img_url === '' ||
        item?.attributes?.img_url.includes('assets/') ? null : (
          <Image
            source={{uri: item?.attributes?.img_url}}
            style={{width: 112, height: 162, borderRadius: 12}}
          />
        )}
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 12,
            marginRight: 8,
            width: Dimensions.get('window').width - 200,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 20,
              fontFamily: fonts.BeVietnamProSemiBold600,
              lineHeight: 30,
              color: Colors.Text,
            }}>
            {item.attributes.title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Text style={styles.text_content_item}>{item.type}</Text>
            <icons.IconDot style={{marginRight: 10}} fill={Colors.MenuItem} />
            <Text style={styles.text_content_item}>{item.attributes.year}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setFavorite();
            handleFavorite();
          }}>
          <icons.IconFavorite
            width={32}
            height={32}
            stroke={Colors.TextTilte}
            fill={Colors.TextTilte}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <View
        style={{
          height: 1,
          borderBottomWidth: 1,
          borderColor: Colors.BorderColor,
        }}></View>
    </View>
  );
};

export default ItemMovieFavorite;

const styles = StyleSheet.create({
  text_content_item: {
    color: Colors.MenuItem,
    fontSize: 14,
    fontFamily: fonts.BeVietnamProRegular400,
    textAlign: 'left',
    marginRight: 10,
  },
});
