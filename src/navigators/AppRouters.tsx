import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, addFollowedJobs, authSelector, AuthState} from '../redux/reducers/authReducer';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import {SplashScreen} from '../screens';
import axios from 'axios';
import userApi from '../apis/userApi';
import { UserHandlers } from '../utils/UserHandlers';

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const {getItem} = useAsyncStorage('auth');

  const auth: AuthState = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    handleGetDatas();
  }, []);


  useEffect(() => {
    UserHandlers.getJobsFollowed(auth.id, dispatch);
  }, [auth.id]);

  const handleGetDatas = async () => {
    await checkLogin();
    setIsShowSplash(false);
  }

  const checkLogin = async () => {
    const res = await getItem();

    res && dispatch(addAuth(JSON.parse(res)));
  };

  // const getJobsFollowed = async () => {
  //   if(auth.id){
  //     const api = `/getJobsFollowed?uid=${auth.id}`;
  //     try { 
  //       const res = await userApi.HandleUser(api);
  //       if(res && res.data && res.data.length > 0){
  //         dispatch(addFollowedJobs(res.data));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : auth.accesstoken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppRouters;
