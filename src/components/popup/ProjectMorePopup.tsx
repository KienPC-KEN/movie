import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {icons} from '../../assets/icons';
import {Colors} from '../../assets/color';
import {fonts} from '../../assets/fonts';
import {removeProject} from '../../constants/database/services/ProjectService';

type ProjectMorePopupProp = {
  id: number;
  onShowRenamePopup: () => void;
  navigation: any;
  setIsPaused: () => void;
};

const ProjectMorePopup: React.FC<ProjectMorePopupProp> = ({
  id,
  onShowRenamePopup,
  navigation,
  setIsPaused,
}) => {
  const deleteProject = async () => {
    await removeProject(id);
    Alert.alert('Succes', 'Removed project successfully!');
    setIsPaused();
    navigation.navigate('BottomTab');
  };
  return (
    <View style={styles.container}>
      <icons.IconRectanglePopup style={{paddingBottom: 8}} />
      <TouchableOpacity
        style={styles.container_line}
        onPress={onShowRenamePopup}>
        <icons.IconEdit />
        <Text style={styles.text}>Rename</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={deleteProject} style={styles.container_line}>
        <icons.IconDelete />
        <Text style={styles.text}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectMorePopup;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.BackgroundPopup,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },

  container_line: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.BorderColor,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.BeVietnamProRegular400,
    marginLeft: 10,
    color: Colors.Text,
  },
});
