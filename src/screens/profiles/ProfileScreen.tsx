import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import userAPI from '../../apis/userApi';
import {
  AvatarComponent,
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {ProfileModel} from '../../models/ProfileModel'
import {
  AuthState,
  addAuth,
  authSelector,
} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../styles/globalStyles';
import AboutProfile from './components/AboutProfile'
import EditProfile from './components/EditProfile'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {appColors} from '../../constants/appColors';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import jobAPI from '../../apis/jobApi';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({navigation, route}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileModel>();
  const [userFollowers, setUserFollowers] = useState<string[]>([]);
  const [profileId, setProfileId] = useState('');
  const [userJobsCount, setUserJobsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [userJobs, setUserJobs] = useState([]);

  const dispatch = useDispatch();
  const auth: AuthState = useSelector(authSelector);

  useEffect(() => {
    if (route.params) {
      const {id} = route.params;
      setProfileId(id);

      if (route.params.isUpdated) {
        getProfile();
      }
    } else {
      setProfileId(auth.id);
    }
  }, [route.params]);

  useEffect(() => {
    if (profileId) {
      getProfile();
      getJobsById();
    }
  }, [profileId]);

  const getProfile = async () => {
    const api = `/getProfile?uid=${profileId}`;
    
    setIsLoading(true);
    try {
      const res = await userAPI.HandleUser(api);
      res && res.data && setProfile(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getJobsById = async () => {
    const api = `/author/${profileId}`;
    console.log(api)
    setIsLoading(true);
    try {
      const res = await jobAPI.HandleJob(api, null, 'get');
      if (res && res.data) {
        setUserJobs(res.data);
        setUserJobsCount(res.data.length);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Loi Getjob');
      setIsLoading(false);
    }
  };

  // const getFollowersByUid = async () => {
  //   const api = `/getFollowers?uid=${profileId}`;

  //   try {
  //     const res = await userAPI.HandleUser(api);
  //     console.log(res);
  //     setUserFollowers(res.data);
      
  //     const jobsApi = `/jobs/author/${profileId}`;
  //     const jobsRes = await userAPI.HandleUser(jobsApi,null,get);
  //     console.log(jobsRes)
  //     setUserJobsCount(jobsRes.data.length);
  //     console.log("so luong viec la",jobsRes.data.length)
  //   } catch (error) {
  //     console.log('loi count job');
  //   }
  // };

  return (
    <ContainerComponent
      back
      title={route.params ? '' : 'Profile'}
      right={
        <ButtonComponent
          icon={
            <MaterialIcons
              name="more-vert"
              size={24}
              color={appColors.text}
              onPress={() => {}}
            />
          }
        />
      }>
      {isLoading ? (
        <ActivityIndicator />
      ) : profile ? (
        <>
          <SectionComponent styles={[globalStyles.center]}>
            <RowComponent>
              <AvatarComponent
                photoURL={profile.photoUrl}
                name={profile.name ? profile.givenName : profile.email}
                size={120}
              />
            </RowComponent>
            <SpaceComponent height={16} />
            <TextComponent
              text={
                profile.name
                  ? profile.name
                  : profile.givenName
                  ? profile.givenName
                  : profile.email
              }
              title
              size={24}
            />
            <SpaceComponent height={16} />
            <RowComponent>
              <View style={[globalStyles.center, {flex: 1}]}>
                <TextComponent
                  title
                  text={`${userJobsCount}`}
                  size={20}
                />
                <SpaceComponent height={8} />
                <TextComponent text="Jobs" />
              </View>
              <View
                style={{
                  backgroundColor: appColors.gray2,
                  width: 1,
                  height: '100%',
                }}
              />
              <View style={[globalStyles.center, {flex: 1}]}>
                <TextComponent
                  title
                  text={`${userFollowers.length}`}
                  size={20}
                />
                <SpaceComponent height={8} />
                <TextComponent text="Followers" />
              </View>
            </RowComponent>
          </SectionComponent>
          {activeTab === 'about' && <AboutProfile profile={profile} userJobs={userJobs} />}
          {activeTab === 'jobs' && <TextComponent text="Nội dung việc đã đăng sẽ hiển thị ở đây." />}
          {activeTab === 'reviews' && <TextComponent text="Nội dung đánh giá sẽ hiển thị ở đây." />}
    
        </>
      ) : (
        <TextComponent text="profile not found!" />
      )}
    </ContainerComponent>
  );
};

export default ProfileScreen;