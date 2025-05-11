import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
