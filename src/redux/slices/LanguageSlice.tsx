import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ILanguage} from '../../model';

type LanguageState = {
  languages: ILanguage[];
  language: ILanguage;
};

const initialState: LanguageState = {
  languages: [
    {
      language_code: '',
      language_name: '',
      status: false,
    },
  ],
  language: {
    language_code: '',
    language_name: '',
    status: false,
  },
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setDataLanguage: (state, action: PayloadAction<ILanguage[]>) => {
      state.languages = action.payload;
    },
    setOneLanguage: (state, action: PayloadAction<ILanguage>) => {
      state.language = action.payload;
    },
  },
});

export const {setDataLanguage, setOneLanguage} = languageSlice.actions;
export default languageSlice.reducer;
