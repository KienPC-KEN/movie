import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {IProject} from '../../model';
import {modifyProject} from '../../constants/database/services/ProjectService';

type RenameProjectPopupProp = {
  project: IProject;
  onShowRenamePopup: () => void;
  navigation: any;
  setIsPaused: () => void;
};

const RenameProjectPopup: React.FC<RenameProjectPopupProp> = ({
  project,
  onShowRenamePopup,
  navigation,
  setIsPaused,
}) => {
  const [name, setName] = useState(project.name);

  const saveNameProject = async () => {
    const newDate = new Date();
    await modifyProject({
      ...project,
      name: name,
      date_upload: newDate.toISOString(),
    });
    onShowRenamePopup();
    setIsPaused();
    navigation.navigate('BottomTab');
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 18,
          fontFamily: fonts.BeVietnamProBold700,
          color: Colors.Text,
        }}>
        Rename playlist
      </Text>

      <TextInput
        style={styles.text_intput}
        value={name}
        placeholder="Workout Music Mix"
        placeholderTextColor={Colors.TextTitleContent}
        onChangeText={value => setName(value)}
      />

      <View
        style={{flexDirection: 'row', alignSelf: 'flex-end', marginTop: 32}}>
        <Text onPress={onShowRenamePopup} style={styles.text_button}>
          Cancel
        </Text>
        <Text onPress={saveNameProject} style={styles.text_button}>
          Save
        </Text>
      </View>
    </View>
  );
};

export default RenameProjectPopup;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.BackgroundPopup,
    width: Dimensions.get('window').width,
    alignItems: 'flex-start',
  },
  text_intput: {
    borderBottomColor: Colors.TextTilte,
    borderBottomWidth: 1.5,
    gap: 10,
    width: '100%',
    fontSize: 16,
    fontFamily: fonts.BeVietnamProSemiBold600,
    marginTop: 20,
    color: Colors.TextTitleContent,
  },
  text_button: {
    color: Colors.TextTilte,
    fontSize: 18,
    fontFamily: fonts.BeVietnamProBold700,
    marginLeft: 32,
  },
});
