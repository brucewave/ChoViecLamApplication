import {View, Text, FlatList} from 'react-native';
import React, {ReactNode} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RowComponent, SpaceComponent, TextComponent} from '.';
import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ChefFork, KnifeFork_Color} from '../assets/svgs';

interface Props {
  isColor?: boolean;
}

interface Category {
  key: string;
  title: string;
  icon: ReactNode;
  iconColor: string;
}

const CategoriesList = (props: Props) => {
  const {isColor} = props;


  const categories: Category[] = [
    {
      key: '1',
      icon: (
        <Ionicons
          name="basketball"
          size={22}
          color={isColor ? appColors.white : '#EE544A'}
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
          color={isColor ? appColors.white : '#F59762'}
        />
      ),
      iconColor: '#F59762',
      title: 'Toàn Thời Gian',
    },
    {
      key: '3',
      icon: isColor ? (
        <ChefFork color="#29D697" />
      ) : (
        <KnifeFork_Color />
      ),
      iconColor: '#29D697',
      title: 'Thời Vụ',
    },
    {
      key: '4',
      icon: (
        <Ionicons
          name="color-palette-sharp"
          size={22}
          color={isColor ? appColors.white : '#46CDFB'}
        />
      ),
      iconColor: '#46CDFB',
      title: 'Cần Gấp',
    },
  ];

  const renderTagCategory = (item: Category) => {
    return (
      <RowComponent
        onPress={() => {}}
        styles={[
          globalStyles.tag,
          {
            backgroundColor: isColor ? item.iconColor : appColors.white,
            marginRight: 10,
          },
        ]}>
        {item.icon}
        <SpaceComponent width={8} />
        <TextComponent
          text={item.title}
          color={isColor ? appColors.white : appColors.gray}
        />
      </RowComponent>
    );
  };

  return (
    <FlatList
      style={{paddingHorizontal: 16}}
      showsHorizontalScrollIndicator={false}
      horizontal
      data={categories}
      renderItem={({item}) => renderTagCategory(item)}
      
    />
  );
};

export default CategoriesList;
