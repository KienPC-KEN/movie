import {DocumentPickerResponse} from 'react-native-document-picker';
import {IProject} from '../model';

export type RootStackParamList = {
  BottomTab: undefined;
  Search: undefined;
  Subtitle: undefined;
  Caption: undefined;
  Favorite: undefined;
  Setting: undefined;
  SettingLanguageScreen: undefined;
  DetailMovieSearchScreen: undefined;
  LanguageDetailScreen: undefined;
  PlaySubtitleScreen: {language_code: string | undefined};
  SelectVideoAndCaptionScreen: {
    video?: DocumentPickerResponse;
    isChangeCaption?: boolean;
  };
  LoadingScreen: {percent: number; video: DocumentPickerResponse};
  SelectSubtitleScreen: undefined;
  VideoPreview: {video: DocumentPickerResponse};
  PlayCaptionScreen: {project: IProject};
};
