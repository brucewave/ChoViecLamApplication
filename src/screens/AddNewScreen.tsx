import {View, Text} from 'react-native';
import React, { useState } from 'react';
import { SelectModel } from '../models/SelectModel';
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, TextComponent } from '../components';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducer';
import ChoiceLocation from '../components/ChoiceLocation';

const initValues = {
  title: '',
  description: '',
  locationTitle: '',
  locationAddress: '',
  position: {
    lat: '',
    long: '',
  },
  photoUrl: '',
  users: [],
  authorId: '',
  startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
  price: '',
  category: '',
};

const AddNewScreen = () => {
  const auth = useSelector(authSelector);
  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorId: auth.id,
  });


  const [usersSelects, setUsersSelects] = useState<SelectModel[]>([]);
  const [fileSelected, setFileSelected] = useState<any>();
  const [errorsMess, setErrorsMess] = useState<string[]>([]);


  const handdleChangeValue = (key: string, value: any) => {
    const items = {...eventData};
    items[key] = value;

    setEventData(items);
  };

  const handleAddEvent = () => {
    console.log(eventData);
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent text="Thông tin công việc" />
      </SectionComponent>
      <SectionComponent>
        <InputComponent
          placeholder="Tiêu đề"
          allowClear
          value={eventData.title}
          onChange={value => handdleChangeValue('title', value)}
        />
        <InputComponent
          placeholder="Mô tả"
          multiline
          numberOfLine={4}
          allowClear
          value={eventData.description}
          onChange={value => handdleChangeValue('description', value)}
        />
      </SectionComponent>
      <SectionComponent>
        <InputComponent
          placeholder="Địa chỉ"
          multiline
          numberOfLine={4}
          allowClear
          value={eventData.locationTitle}
          onChange={value => handdleChangeValue('locationTitle', value)}
        />
      </SectionComponent>
      <SectionComponent>
        <ChoiceLocation />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent text="Thêm công việc" onPress={handleAddEvent} type="primary" />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
