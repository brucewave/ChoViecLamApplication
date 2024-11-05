import axios from 'axios';
import queryString from 'query-string';
import {appInfo} from '../constants/appInfos';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getAccessToken = async () => {
  const auth = await AsyncStorage.getItem('auth');
  return auth ? JSON.parse(auth).accesstoken : '';
};

const axiosClient = axios.create({
  baseURL: appInfo.BASE_URL,
  paramsSerializer: params => queryString.stringify(params),
});



axiosClient.interceptors.request.use(async (config: any) => {
  const accesstoken = await getAccessToken();
  console.log(accesstoken);
  config.headers = {
    Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
    Accept: 'application/json',
    ...config.headers,
  };

  config.data;
  return config;
});

axiosClient.interceptors.response.use(
  res => {
    if (res.data && res.status === 200) {
      return res.data;
    }
    throw new Error('Error');
  },
  error => {
    console.log(`Error api ${JSON.stringify(error)}`);
    throw new Error(error.response);
  },
);

export default axiosClient;
