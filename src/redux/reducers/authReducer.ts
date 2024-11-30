import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  id: string;
  email: string;
  accesstoken: string;
  follow_jobs: string[];
}

const initialState: AuthState = {
  id: '',
  email: '',
  accesstoken: '',
  follow_jobs: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload;
    },

    removeAuth: (state, action) => {
      state.authData = initialState;
    },

    addFollowedJobs: (state, action) => {
      state.authData.follow_jobs = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth, addFollowedJobs} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;
