import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '.';
import {Camera, Image, Link} from 'iconsax-react-native';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

interface Props {
  onSelect: (val: {type: 'url' | 'file'; value: string | ImageOrVideo}) => void;
}

const ButtonImagePicker = (props: Props) => {
  const {onSelect} = props;
  const navigation = useNavigation();

  const [imageUrl, setImageUrl] = useState('');
  const [isVisibleModalAddUrl, setIsVisibleModalAddUrl] = useState(false);

  const options: Options = {
    cropping: true,
    mediaType: 'photo',
  };

  const handleChoiceImage = (key: string) => {
    switch (key) {
      case 'library':
        ImageCropPicker.openPicker(options).then(res => {
          onSelect({type: 'file', value: res});
        }).catch(error => {
          console.error('Error picking image from library:', error);
        });
        break;

      case 'camera':
        ImageCropPicker.openCamera(options).then(res => {
          onSelect({type: 'file', value: res});
        }).catch(error => {
          console.error('Error opening camera:', error);
        });
        break;

      case 'url':
        setIsVisibleModalAddUrl(true);
        break;

      default:
        break;
    }
  };

  return (
    <View style={{marginBottom: 20}}>
      <ButtonComponent
        text="Upload image"
        // onPress={() => navigation.navigate('ImagePickerOverlay', {onSelect})}
        type="link"
      />

      <Modal
        visible={isVisibleModalAddUrl}
        statusBarTranslucent
        transparent
        animationType="slide">
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: appColors.white,
              margin: 20,
              borderRadius: 12,
              width: '90%',
              padding: 20,
            }}>
            <RowComponent justify="flex-end">
              <TouchableOpacity
                onPress={() => {
                  setImageUrl('');
                  setIsVisibleModalAddUrl(false);
                }}>
                <AntDesign name="close" size={24} color={appColors.text} />
              </TouchableOpacity>
            </RowComponent>

            <TextComponent text="Image URL" title size={18} />
            <InputComponent
              placeholder="URL"
              value={imageUrl}
              onChange={val => setImageUrl(val)}
              allowClear
            />
            <RowComponent justify="flex-end">
              <ButtonComponent
                type="link"
                text="Agree"
                onPress={() => {
                  if (imageUrl) {
                    onSelect({type: 'url', value: imageUrl});
                    setImageUrl('');
                    setIsVisibleModalAddUrl(false);
                  } else {
                    console.error('Please enter a valid URL');
                  }
                }}
              />
            </RowComponent>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ButtonImagePicker;
