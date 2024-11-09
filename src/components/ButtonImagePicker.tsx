import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { ButtonComponent, RowComponent, SpaceComponent } from '.'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import TextComponent from './TextComponent'
import { Camera, Image } from 'iconsax-react-native'
import { appColors } from '../constants/appColors'
import { fontFamilies } from '../constants/fontFamilies'
import ImageCropPicker, { Options } from 'react-native-image-crop-picker'
import { ImageOrVideo } from 'react-native-image-crop-picker'



interface Props {
  onSelected: (val: {
    type: 'camera' | 'gallery',
    value: string | ImageOrVideo
  }) => void
}


const options: Options = {
  mediaType: 'photo',
  cropping: true,
}

const ButtonImagePicker = (props: Props) => {
  const { onSelected } = props


  const modalizeRef = useRef<Modalize>();



  const choiceImage = [
    {
      key: 'camera',
      title: 'Chụp ảnh',
      icon: <Camera size={24} color={appColors.text}/>
    },
    {
      key: 'gallery',
      title: 'Chọn từ thư viện',
      icon: <Image size={24} color={appColors.text}/>
    }
  ]

  const renderItem = (item: {icon: React.ReactNode, title: string, key: string}) => {
    return (
      <RowComponent key={item.key} styles={{ paddingVertical: 10 }}
      onPress = {() => handleChoiceImage(item.key)}>
          {item.icon}
        <SpaceComponent width={10} />
        <TextComponent text={item.title} flex={1} title font={fontFamilies.medium}/>
      </RowComponent>
    )
  }

  const handleChoiceImage = (key: string) => {
    if (key === 'camera') {
      ImageCropPicker.openCamera(options).then((res) => {
        onSelected({
          type: 'camera',
          value: res
        })
      })
    } else {
      ImageCropPicker.openPicker(options).then((res) => {
        onSelected({
          type: 'gallery',
          value: res
        })
      })
    }
  }


  return (
    <View style={{ marginBottom: 20 }}>
      <ButtonComponent 
        text="Chọn ảnh"
        type="link"
        onPress={() => modalizeRef.current?.open()}
      />
      <Portal>
        <Modalize adjustToContentHeight ref={modalizeRef} handlePosition="inside" >
          <View style={{ marginVertical: 30, paddingHorizontal: 20 }}>
            {
              choiceImage.map((item) => (
                renderItem(item)
              ))
            }
          </View>
        </Modalize>
      </Portal>
    </View>
  )
}

export default ButtonImagePicker