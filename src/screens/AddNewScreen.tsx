import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectModel } from '../models/SelectModel';
import { ButtonComponent, ButtonImagePicker, ContainerComponent, DateTimePicker, DropdownPicker, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../components';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducer';
import ChoiceLocation from '../components/ChoiceLocation';
import userAPI from '../apis/userApi';
import { Image } from 'react-native';
import { Validate } from '../utils/validate';
import { appColors } from '../constants/appColors';
import imageAPI from '../apis/imageApi';
import axios, { AxiosRequestConfig } from 'axios';
import eventAPI from '../apis/eventApi';
import { EventModel } from '../models/EventModel';
import jobAPI from '../apis/jobApi';
import { JobModel } from '../models/JobModel';  

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
    console.log(eventData); 
  };


  const handleFileSelected = (val: any) => {
    setFileSelected(val);
    handdleChangeValue('photoUrl', val.path);
  };


  useEffect(() => {
    const mess = Validate.EventValidation(eventData);
    setErrorsMess(mess);
  }, [eventData]);


  
  
  const handleAddEvent = async () => {
    console.log('-------------------');
    console.log(eventData.photoUrl);
    
    if (eventData.photoUrl) {
      const upload = async () => {
        const uri = eventData.photoUrl;
        const type = 'image/jpg';
        const name = uri.split('/').pop();

        const formData = new FormData();
        formData.append('image', { uri, type, name });

        const config = {
          method: 'post',
          url: 'http://192.168.0.105:3001/upload/uploadImage',
          data: formData,
        };

        try {
          const response = await axios.request(config as AxiosRequestConfig);

          if (response.status === 200) {
            console.log('Upload thành công:', response.data);
            setEventData((prevData: any) => ({
              ...prevData,
              photoUrl: response.data.data.secure_url,
            }));
            // console.log('Link ảnh:', response.data.data.secure_url);
            handlePushJob(eventData);
          }
        } catch (error: any) {
          console.error('Lỗi khi tải ảnh lên:', error.response ? error.response.data : error.message);
        }
      };
      await upload();
    }
  };

  const handlePushJob = async (job: JobModel) => {
    console.log(job);
    const api = `http://192.168.0.105:3001/jobs/addNew`;
    try {
      const response = await jobAPI.HandleJob(api, job, 'post');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };


  const handleLocation = (val: any) => {
    const items = {...eventData};
    items.locationAddress = val.address;
    items.position = val.postion;

    setEventData(items);
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent text="Thêm công việc" title />
      </SectionComponent>
      <SectionComponent>
        {eventData.photoUrl || (fileSelected) ? (
        
          <Image
            source={{
              uri: eventData.photoUrl ? eventData.photoUrl : fileSelected.path,
            }}
            style={{width: '100%', height: 250, marginBottom: 12}}
            resizeMode="cover"
          />
        ) : (
          <></>
        )}
        <ButtonImagePicker
          onSelected={(val: any) =>
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
        <SectionComponent>
          <DropdownPicker selected={eventData.category} values={[
            {
            label: 'Bán thời gian',
            value: 'partime',
          },
          {
            label: 'Toàn thời gian',
            value: 'fulltime',
          },
          {
            label: 'Thời vụ',
            value: 'seasonal',
          },
          {
            label: 'Gấp',
            value: 'urgent',
            },
            ]}
          onSelect={value => handdleChangeValue('category', value)}
        />
        </SectionComponent>
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
        <ChoiceLocation onSelect={value => handleLocation(value)} />
      </SectionComponent>
      <SectionComponent>
        <InputComponent placeholder="Lương" type="number-pad" allowClear value={eventData.price} onChange={value => handdleChangeValue('price', value)} />
      </SectionComponent>
      {errorsMess.length > 0 && (
        <SectionComponent>
          {errorsMess.map(mess => (
            <TextComponent
              text={mess}
              key={mess}
              color={appColors.danger}
              styles={{marginBottom: 12}}
            />
          ))}
        </SectionComponent>
      )}
      <SectionComponent>
        <ButtonComponent disable={errorsMess.length > 0} text="Thêm công việc" onPress={handleAddEvent} type="primary" />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
