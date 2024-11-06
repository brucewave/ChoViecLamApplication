import {View, Text} from 'react-native';
import React, { useState } from 'react';
import { SelectModel } from '../models/SelectModel';
import { ButtonComponent, ButtonImagePicker, ContainerComponent, DateTimePicker, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../components';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducer';
import ChoiceLocation from '../components/ChoiceLocation';
import userAPI from '../apis/userApi';

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


  const handleFileSelected = (val: any) => {
    setFileSelected(val);
    handdleChangeValue('photoUrl', val.path);
  };
  const handleAddEvent = async () => {
    // const res = await userAPI.HandleUser('/get-all');
    // const resMe = await userAPI.HandleUser('/me');
    // console.log('------------------------------res:---------------------------------------');
    // console.log(res);
    // console.log(resMe);
    // console.log(eventData);
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent text="Thêm công việc" />
      </SectionComponent>
      <SectionComponent>
        <SpaceComponent height={10} />
        <ButtonImagePicker
          onSelect={(val: any) =>
            val.type === 'url'
              ? handdleChangeValue('photoUrl', val.value as string)
              : handleFileSelected(val.value)
          }
        />
        <SpaceComponent height={10} />
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
          allowClear
          value={eventData.locationTitle}
          onChange={value => handdleChangeValue('locationTitle', value)}
        />
        <RowComponent>
          <DateTimePicker label="Thời gian bắt đầu" type="time" onSelect={value => handdleChangeValue('startAt', value)} />
          <SpaceComponent width={10} />
          <DateTimePicker label="Thời gian kết thúc" type="time" onSelect={value => handdleChangeValue('endAt', value)} />
        </RowComponent>
        <DateTimePicker label="Ngày đăng" type="date" onSelect={value => handdleChangeValue('date', value)} />
      </SectionComponent>
      <SectionComponent>
        <ChoiceLocation />
      </SectionComponent>
      <SectionComponent>
        <InputComponent placeholder="Lương" type="number-pad" allowClear value={eventData.price} onChange={value => handdleChangeValue('price', value)} />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent text="Thêm công việc" onPress={handleAddEvent} type="primary" />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
