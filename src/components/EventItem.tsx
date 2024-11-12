import {Bookmark, Bookmark2, Location} from 'iconsax-react-native';
import React from 'react';
import {
  AvatarGroup,
  CardComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '.';
import {appColors} from '../constants/appColors';
import {appInfo} from '../constants/appInfos';
import {EventModel} from '../models/EventModel';
import {ImageBackground} from 'react-native';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

interface Props {
  item: EventModel;
  type: 'card' | 'list';
  imageUrl: string;
}



const EventItem = (props: Props) => {
  const {item, type, imageUrl} = props;

  const navigation: any = useNavigation();

  return (
    <CardComponent
      isShadow
      styles={{width: appInfo.sizes.WIDTH * 0.7}}
      onPress={() => navigation.navigate('EventDetail', {item})}>
      <ImageBackground
        style={{flex: 1, marginBottom: 12, height: 131, padding: 10}}
        source={imageUrl && imageUrl.trim() !== '' ? { uri: imageUrl } : require('../assets/images/event-image.png')} // Sử dụng ảnh mặc định nếu imageUrl không hợp lệ
        imageStyle={{
          resizeMode: 'cover',
          borderRadius: 12,
        }}>
        <RowComponent justify="space-between">
          <CardComponent styles={[globalStyles.noSpaceCard]} color="#ffffffB3">
            <TextComponent
              color={appColors.danger}
              font={fontFamilies.bold}
              size={18}
              text={item.day}
            />
            <TextComponent
              color={appColors.danger}
              font={fontFamilies.semiBold}
              size={10}
              text={item.month}
            />
          </CardComponent>
          <CardComponent styles={[globalStyles.noSpaceCard]} color="#ffffffB3">
            <MaterialIcons
              name="favorite"
              color={appColors.danger}
              size={22}
            />
          </CardComponent>
        </RowComponent>
      </ImageBackground>
      <TextComponent numberOfLine={1} text={item.title} title size={18} />
      <AvatarGroup />
      <RowComponent>
        <Location size={18} color={appColors.text} variant="Bold" />
        <SpaceComponent width={8} />
        <TextComponent
          flex={1}
          numberOfLine={1}
          text={item.location.address}
          size={12}
          color={appColors.text}
        />
      </RowComponent>
    </CardComponent>
  );
};

export default EventItem;