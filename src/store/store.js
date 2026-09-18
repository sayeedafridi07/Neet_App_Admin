// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducer';

export const store = configureStore({
  reducer: rootReducer,
});
