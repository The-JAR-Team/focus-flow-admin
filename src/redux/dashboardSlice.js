import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  sessions: [],
  playlists: [],
  myPlaylists: [],
  otherPlaylists: [],
  myGenericVideos: [],
  otherGenericVideos: [],
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearDashboard: (state) => {
      return initialState;
    }
  }
});

export const { 
  setDashboardData, 
  setUsers, 
  setSessions, 
  setPlaylists, 
  setLoading, 
  setError, 
  clearDashboard 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
