import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, View} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import eventAPI from '../apis/eventApi';
import {Category} from '../models/Category';
import TextComponent from './TextComponent';
import { ChefFork, KnifeFork_Color } from '../assets/svgs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appColors } from '../constants/appColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  // categoryId: string;
  type: string;
}

const MakerCustom = (props: Props) => {
  const {type} = props;

  const categories: Category[] = [
    {
      key: '1',
      icon: (
        <Ionicons
          name="basketball"
          size={22}
          color='#EE544A'
        />
      ),
      iconColor: '#EE544A',
      title: 'Bán Thời Gian',
    },
    {
      key: '2',
      icon: (
        <FontAwesome
          name="music"
          size={22}
          color='#F59762'
        />
      ),
      iconColor: '#F59762',
      title: 'Toàn Thời Gian',
    },
    {
      key: '3',
      icon: (
        <KnifeFork_Color />
      ),
      iconColor: '#29D697',
      title: 'Thời Vụ',
    },
    {
      key: '4',
      icon: 
        <Ionicons
          name="color-palette-sharp"
          size={22}
          color= '#46CDFB'
        />
      

    },
  ];

  const renderIcon = () => {
    let icon;
    switch (type) {
      case 'partime':
        return icon = <Ionicons
        name="basketball"
        size={30}
        color='#EE544A'
      />
      case 'fulltime':
        return icon = 
          <FontAwesome
            name="music"
            size={30}
            color='#F59762'
          />
        
      case 'casual':
        return  icon = 
          <KnifeFork_Color />
        
      default:
        return icon = 
        <Ionicons
          name="color-palette-sharp"
          size={30}
          color= '#46CDFB'
        />
    }
    return icon;
  }
  
  return (
    <ImageBackground source={require('../assets/images/Union.png')} 
    style={[
      globalStyles.shadow, {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
      }]}
      imageStyle={{
        resizeMode: 'contain',
      }}
    >
    {renderIcon(type)}
    </ImageBackground>
  )
};

export default MakerCustom;
