import {ILanguage} from '../../../model';
import {addLanguage, getLanguages, updateLanguage} from '../model/Language';

export const addAllLanguages = (languages: ILanguage[]): void => {
  languages.map(language => {
    const status = language.language_code === 'en';
    addLanguage({...language, status});
  });
};

export const fetchAllLanguages = (
  callback: (languages: ILanguage[]) => void,
): void => {
  getLanguages(callback);
};

export const modifyLanguage = (language: ILanguage): void => {
  updateLanguage(language);
};
