import {configureStore} from '@reduxjs/toolkit';
import LanguageSlice from './slices/LanguageSlice';
import SubtitleSlice from './slices/SubtitleSlice';

export const store = configureStore({
  reducer: {
    language: LanguageSlice,
    subtitle: SubtitleSlice,

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
