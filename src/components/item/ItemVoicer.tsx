import {Text, View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import ItemNameVoicer from './ItemNameVoicer';
import {fonts} from '../../assets/fonts';
import {Colors} from '../../assets/color';

type ItemVoicerProp = {
  item: any;
  handleSelectVoicer: (id: string) => void;
  isSelectVoicer: string;
};

const ItemVoicer: React.FC<ItemVoicerProp> = ({
  item,
  handleSelectVoicer,
  isSelectVoicer,
}) => {
  return (
    <View style={{marginTop: 20}}>
      <Text
        style={{
          fontFamily: fonts.BeVietnamProMedium500,
          fontSize: 16,
          lineHeight: 16,
          color: Colors.Text,
        }}>
        {item.language_name}
      </Text>
      <FlatList
        style={{marginTop: 8}}
        data={item.voicer}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (
          <ItemNameVoicer
            isSelectVoicer={isSelectVoicer}
            handleSelectVoicer={() => handleSelectVoicer(item.item)}
            voicer_name={item.item}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ItemVoicer;
