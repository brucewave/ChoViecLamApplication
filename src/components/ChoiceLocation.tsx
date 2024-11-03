import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RowComponent from './RowComponent';
import { globalStyles } from '../styles/globalStyles';
import TextComponent from './TextComponent';
import { ArrowRight2, Location } from 'iconsax-react-native';
import { appColors } from '../constants/appColors';
import CardComponent from './CardComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SpaceComponent from './SpaceComponent';
import ModalLocation from '../modals/ModalLocation';

const ChoiceLocation = () => {
  const [isVisibleLocation, setIsVisibleLocation] = useState(false);

  return (
    <>
      <RowComponent styles={[globalStyles.inputContainer, ]}
      onPress={() => setIsVisibleLocation(!isVisibleLocation)}>
      <Location variant="Bold" size={22} color={`${appColors.primary}80`} />
      <SpaceComponent width={12} />
      <TextComponent text="Đà Nẵng, Việt Nam" flex={1} />
      <ArrowRight2 color={appColors.primary} size={22} />
    </RowComponent>

    <ModalLocation visible={isVisibleLocation} onClose={() => setIsVisibleLocation(false)} onSelect={() => {}} />
    </>

  );
};

export default ChoiceLocation