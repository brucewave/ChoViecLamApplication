import {Dimensions} from 'react-native';

export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  //Mang truong
  // BASE_URL: 'http://172.25.19.191:3001',

  //Mang cong ty
  // BASE_URL: 'http://192.168.110.15:3001',

  //Mang nha
  BASE_URL: 'http://192.168.0.105:3001',

  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};