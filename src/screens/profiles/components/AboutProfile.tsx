import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  EventItem,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import Feather from 'react-native-vector-icons/Feather';
import {appColors} from '../../../constants/appColors';
import {globalStyles} from '../../../styles/globalStyles';
import {fontFamilies} from '../../../constants/fontFamilies';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
  authSelector,
  // updateFollowing,
} from '../../../redux/reducers/authReducer';
import {ProfileModel} from '../../../models/ProfileModel';
import userAPI from '../../../apis/userApi';
import {LoadingModal} from '../../../modals';
import {JobModel} from '../../../models/JobModel';
import { useNavigation } from '@react-navigation/native';

interface Props {
  profile: ProfileModel;
  userJobs: JobModel[];
}

const AboutProfile = (props: Props) => {
  const {profile, userJobs} = props;
  const navigation = useNavigation();

  const [tabSelected, setTabSelected] = useState('about');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    {
      key: 'about',
      title: 'Về Tôi',
    },
    {
      key: 'events',
      title: 'Công Việc',
    },
    {
      key: 'reviews',
      title: 'Đánh Giá',
    },
  ];

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  // console.log(profile);

  const renderTabContent = (id: string) => {
    let content = <></>;

    switch (id) {
      case 'about':
        content = (
          <View style={{marginTop: 20}}>
            <TextComponent text={profile.bio} />
          </View>
        );
        break;

      case 'events':
        content = (
          <View style={{marginTop: 20}}>
            <FlatList
              data={userJobs}
              renderItem={({item}) => (
                <TouchableOpacity 
                onPress={() => navigation.navigate('EventDetail', { item })
                }>
                  <EventItem item={item} type="list" />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );
        break;

      default:
        content = <></>;
        break;
    }
    return content;
  };

  const handleToggleFollowing = async () => {
    const api = `/update-following`;

    setIsLoading(true);
    try {
      const res = await userAPI.HandleUser(
        api,
        {
          uid: auth.id,
          authorId: profile.uid,
        },
        'put',
      );
      // dispatch(updateFollowing(res.data));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <SectionComponent>
        <RowComponent>
          {auth.id === profile.uid ? (
            <TouchableOpacity
              style={[
                globalStyles.button,
                {flex: 1, backgroundColor: appColors.primary},
              ]}
              onPress={() => {
                // Xử lý sự kiện cho nút Edit
                // Điều hướng đến màn hình chỉnh sửa profile
              }}>
              <Feather name="edit" size={20} color={appColors.white} />
              <SpaceComponent width={12} />
              <TextComponent
                text="Edit"
                color={appColors.white}
                font={fontFamilies.medium}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleToggleFollowing}
              style={[
                globalStyles.button,
                {flex: 1, backgroundColor: appColors.primary},
              ]}>
              <Feather
                name={
                  auth.following && auth.following.includes(profile.uid)
                    ? 'user-minus'
                    : 'user-plus'
                }
                size={20}
                color={appColors.white}
              />
              <SpaceComponent width={12} />
              <TextComponent
                text={
                  auth.following && auth.following.includes(profile.uid)
                    ? 'Unfollow'
                    : 'Follow'
                }
                color={appColors.white}
                font={fontFamilies.medium}
              />
            </TouchableOpacity>
          )}
          <SpaceComponent width={20} />

          <TouchableOpacity
            style={[
              globalStyles.button,
              {flex: 1, borderColor: appColors.primary, borderWidth: 1},
            ]}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={appColors.primary}
            />
            <SpaceComponent width={12} />
            <TextComponent
              text="Messages"
              color={appColors.primary}
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent>
      <SectionComponent>
        <RowComponent>
          {tabs.map(item => (
            <TouchableOpacity
              onPress={() => setTabSelected(item.key)}
              style={[
                globalStyles.center,
                {
                  flex: 1,
                },
              ]}
              key={item.key}>
              <TextComponent
                text={item.title}
                font={
                  item.key === tabSelected
                    ? fontFamilies.medium
                    : fontFamilies.regular
                }
                color={
                  item.key === tabSelected ? appColors.primary : appColors.text
                }
                size={16}
              />
              <View
                style={{
                  width: 80,
                  borderRadius: 100,
                  marginTop: 6,
                  flex: 0,
                  height: 3,
                  backgroundColor:
                    item.key === tabSelected
                      ? appColors.primary
                      : appColors.white,
                }}
              />
            </TouchableOpacity>
          ))}
        </RowComponent>
        {renderTabContent(tabSelected)}
      </SectionComponent>

      <LoadingModal visible={isLoading} />
    </>
  );
};

export default AboutProfile;
