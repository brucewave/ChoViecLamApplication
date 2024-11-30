import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {ProfileModel} from '../../models/ProfileModel';
import {
  AvatarComponent,
  ButtonComponent,
  ButtonImagePicker,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
} from '../../components';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {LoadingModal} from '../../modals';
import userAPI from '../../apis/userApi';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosRequestConfig } from 'axios';
import { appInfo } from '../../constants/appInfos';

const EditProfileScreen = ({navigation, route}: any) => {
  const {profile}: {profile: ProfileModel} = route.params;

  const [fileSelected, setFileSelected] = useState<any>();
  const [profileData, setProfileData] = useState<ProfileModel>(profile);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  const handleFileSelected = (val: ImageOrVideo) => {
    setFileSelected(val);
    handleChangeValue('photoUrl', val.path);
  };

  const handleChangeValue = (key: string, value: string | Date | string[]) => {
    const items: any = {...profileData};

    items[`${key}`] = value;

    setProfileData(items);
  };

  const handleUploadImage = async (uri: string) => {
    const type = 'image/jpg';
    const name = uri.split('/').pop();

    const formData = new FormData();
    formData.append('image', { uri, type, name });

    const config = {
      method: 'post',
      url: `${appInfo.BASE_URL}/upload/uploadImage`,
      data: formData,
    };

    try {
      const response = await axios.request(config as AxiosRequestConfig);
      if (response.status === 200) {
        return response.data.data.secure_url; // Trả về URL của hình ảnh đã upload
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error.response ? error.response.data : error.message);
    }
    return null; // Trả về null nếu có lỗi
  };

  const onUpdateProfile = async () => {
    setIsLoading(true);
    let photoUrl = profileData.photoUrl;

    if (fileSelected) {
      photoUrl = await handleUploadImage(fileSelected.path);
    }

    const updatedProfileData = {
      ...profileData,
      photoUrl,
    };

    handleUpdateProfile(updatedProfileData);
    setIsLoading(false);
  };

  const handleUpdateProfile = async (data: ProfileModel) => {
    const api = `/updateProfile?uid=${profile.uid}`;

    const newData = {
      bio: data.bio ?? '',
      familyName: data.givenName ?? '',
      givenName: data.givenName ?? '',
      name: data.name ?? '',
      photoUrl: data.photoUrl ?? '',
    };

    setIsLoading(true);

    try {
      const res: any = await userAPI.HandleUser(api, newData, 'put');

      setIsLoading(false);

      const authData = {...auth, photo: data.photoUrl ?? ''};

      await AsyncStorage.setItem('auth', JSON.stringify(authData));
      dispatch(addAuth(authData));

      navigation.navigate('ProfileScreen', {
        isUpdated: true,
        id: profile.uid,
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <ContainerComponent isScroll back title={profile.name}>
      <SectionComponent>
        <RowComponent>
          <AvatarComponent
            photoURL={fileSelected ? fileSelected.path : profileData.photoUrl}
            name={profileData.name ? profileData.name : profileData.email}
            size={120}
          />
        </RowComponent>
        <SpaceComponent height={16} />
        <RowComponent>
          <ButtonImagePicker
            onSelect={(val: any) =>
              val.type === 'url'
                ? handleChangeValue('photoUrl', val.value as string)
                : handleFileSelected(val.value)
            }
          />
        </RowComponent>
        <InputComponent
          placeholder="Full name"
          allowClear
          value={profileData.name}
          onChange={val => handleChangeValue('name', val)}
        />
        <InputComponent
          placeholder="Give name"
          allowClear
          value={profileData.givenName}
          onChange={val => handleChangeValue('givenName', val)}
        />
        <InputComponent
          placeholder="Family name"
          allowClear
          value={profileData.familyName}
          onChange={val => handleChangeValue('familyName', val)}
        />
        <InputComponent
          placeholder="Giới thiệu"
          allowClear
          value={profileData.bio}
          multiline
          numberOfLine={5}
          onChange={val => handleChangeValue('bio', val)}
        />
      </SectionComponent>
      <ButtonComponent
        disable={profileData === profile}
        text="Update"
        onPress={onUpdateProfile}
        type="primary"
      />

      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default EditProfileScreen;
