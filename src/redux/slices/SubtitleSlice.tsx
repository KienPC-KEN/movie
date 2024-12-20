import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IFiles, ISubtitle} from '../../model';

type SubtitleState = {
  dataSubtitleMovie: ISubtitle[];
  dataSelectFile: IFiles;
  isPlay: boolean;
  subtitle_id: number;
};

const initialState: SubtitleState = {
  dataSubtitleMovie: [],
  dataSelectFile: {
    file_id: 0,
    cd_number: 0,
    file_name: '',
  },
  isPlay: true,
  subtitle_id: 0,
};

const subtitleSlice = createSlice({
  name: 'subtitle',
  initialState,
  reducers: {
    setDataSubtitleMovie: (state, action: PayloadAction<ISubtitle[]>) => {
      state.dataSubtitleMovie = action.payload;
    },
    setDataSelectFile: (state, action: PayloadAction<IFiles>) => {
      state.dataSelectFile = action.payload;
    },
    setPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setSubtitleId: (state, action: PayloadAction<number>) => {
      state.subtitle_id = action.payload;
    },
  },
});

export const {setDataSubtitleMovie, setDataSelectFile, setPlay, setSubtitleId} =
  subtitleSlice.actions;
export default subtitleSlice.reducer;
