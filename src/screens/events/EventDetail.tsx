import {ArrowLeft, ArrowRight, Calendar, Location} from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  AvatarGroup,
  ButtonComponent,
  CardComponent,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TabBarComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {EventModel} from '../../models/EventModel';
import {globalStyles} from '../../styles/globalStyles';
import {fontFamilies} from '../../constants/fontFamilies';
import { useSelector, useDispatch } from 'react-redux';
import { authSelector, AuthState } from '../../redux/reducers/authReducer';
import jobAPI from '../../apis/jobApi';
import LoadingModal from '../../modals/LoadingModal';
import { UserHandlers } from '../../utils/UserHandlers';
import { DateTime } from '../../utils/DateTime';

const EventDetail = ({navigation, route}: any) => {
  const {item}: {item: EventModel} = route.params;
  const auth: AuthState = useSelector(authSelector)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowed, setIsFollowed] = useState<string[]>([]);
  const dispatch = useDispatch();

useEffect(() => {
    item && getFollowers();
}, [item])

const getFollowers = async () => {
  const api = `/getFollowers?id=${item._id}`
  try{  
    const res = await jobAPI.HandleJob(api, {}, 'get')
    res && res.data && setIsFollowed(res.data)
  }catch(err){
    console.log(err)
  }
}

  const handleFollower =  () => {
   const items = [...isFollowed];
   if(items.includes(auth.id)){
    const index = items.findIndex(element => element === auth.id)
    if(index !== -1){
      items.splice(index, 1)
    }
   }else{
    items.push(auth.id)
   }
   setIsFollowed(items)
   handleUpdateFollowers(items)
  }

  const handleUpdateFollowers = async (data: string[]) => {
    
    await UserHandlers.getJobsFollowed(item._id, dispatch)
    
    const api = `/updateFollowers`
    try{
      const res = await jobAPI.HandleJob(api, {
        id: item._id,
        followers: data,
      }, 'post')
      if(res.status === 200){
          console.log('Update successful')
      }
    }catch(err){
      console.log('Error updating followers:', err)
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ImageBackground
        source={{uri: item.photoUrl}}
        style={{flex: 1, height: 244}}
        imageStyle={{
          resizeMode: 'cover',
        }}>
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}>
          <RowComponent
            styles={{
              padding: 16,
              alignItems: 'flex-end',
              paddingTop: 42,
            }}>
            <RowComponent styles={{flex: 1}}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 48,
                  height: 48,
                  justifyContent: 'center',
                }}>
                <ArrowLeft size={28} color={appColors.white} />
              </TouchableOpacity>
              <TextComponent
                flex={1}
                text="Chi Tiết Công Việc"
                title
                color={appColors.white}
              />
              <CardComponent
                onPress={handleFollower}
                styles={[globalStyles.noSpaceCard, {width: 36, height: 36}]}
                color={
                  auth.follow_jobs && auth.follow_jobs.includes(item._id)
                    ? '#ffffffB3'
                    : '#ffffff4D'
                }>
                <MaterialIcons
                  name="bookmark"
                  color={
                    auth.follow_jobs && auth.follow_jobs.includes(item._id)
                      ? appColors.danger2
                      : appColors.white
                  }
                  size={22}
                />
              </CardComponent>
            </RowComponent>
          </RowComponent>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingTop: 244 - 130,
          }}>


          <SectionComponent>
            {
              item.users.length > 0 ? (
              <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <RowComponent
                justify="space-between"
                styles={[
                  globalStyles.shadow,
                  {
                    backgroundColor: appColors.white,
                    borderRadius: 100,
                    paddingHorizontal: 12,
                    width: '90%',
                  },
                ]}>
                <AvatarGroup userIds={item.user || []} size={36} />
                <TouchableOpacity
                  style={[
                    globalStyles.button,
                    {backgroundColor: appColors.primary, paddingVertical: 8},
                  ]}>
                  <TextComponent text="Invite" color={appColors.white} />
                </TouchableOpacity>
                </RowComponent>
              </View>
            ) : (
              <>
                <ButtonComponent
                  text="Invite"
                type="primary"
                  onPress={() => {}}
                />
              </>
            )
            }
          </SectionComponent>
          <View
            style={{
              backgroundColor: appColors.white,
            }}>
            <SectionComponent>
              <TextComponent
                title
                size={34}
                font={fontFamilies.medium}
                text={item.title}
              />
            </SectionComponent>
            <SectionComponent>
              <RowComponent styles={{marginBottom: 20}}>
                <CardComponent
                  styles={[globalStyles.noSpaceCard, {width: 48, height: 48}]}
                  color={`${appColors.primary}4D`}>
                  <Calendar
                    variant="Bold"
                    color={appColors.primary}
                    size={24}
                  />
                </CardComponent>
                <SpaceComponent width={16} />
                <View
                  style={{
                    flex: 1,
                    height: 48,
                    justifyContent: 'space-around',
                  }}>
                  <TextComponent
                    text={DateTime.GetDate(item.date)}
                    font={fontFamilies.medium}
                    size={16}
                  />
                  <TextComponent
                    text={DateTime.GetTime(item.startAt)}
                    color={appColors.gray}
                  />
                </View>
              </RowComponent>
              <RowComponent styles={{marginBottom: 20, alignItems: 'flex-start'}}>
                <CardComponent
                  styles={[globalStyles.noSpaceCard, {width: 48, height: 48}]}
                  color={`${appColors.primary}4D`}>
                  <Location
                    variant="Bold"
                    color={appColors.primary}
                    size={24}
                  />
                </CardComponent>
                <SpaceComponent width={16} />
                <View
                  style={{
                    flex: 1,
                    height: 48,
                    justifyContent: 'space-around',
                  }}>
                  <TextComponent
                    text={item.locationTitle}
                    font={fontFamilies.medium}
                    size={16}
                  />
                  <TextComponent
                    text={item.locationAddress}
                    color={appColors.gray}
                  />
                </View>
              </RowComponent>
              <RowComponent styles={{marginBottom: 20}}>
                <Image
                  source={{
                    uri: item.photoUrl,
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    resizeMode: 'cover',
                  }}
                />
                <SpaceComponent width={16} />
                <View
                  style={{
                    flex: 1,
                    height: 48,
                    justifyContent: 'space-around',
                  }}>
                  <TextComponent
                    text="Lương"
                    font={fontFamilies.medium}
                    size={16}
                  />
                  <TextComponent
                    text={`${item.price} K/Giờ`}
                    color={appColors.gray}
                  />
                </View>
              </RowComponent>
            </SectionComponent>
            <TabBarComponent title="About Event" onPress={() => {}} />
            <SectionComponent>
              <TextComponent
                text={item.description}
              />
            </SectionComponent>
          </View>
        </ScrollView>
      </ImageBackground>

      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)']}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 12,
        }}>
        <ButtonComponent
          text="Liên Hệ Ngay"
          type="primary"
          onPress={() => {}}
          iconFlex="right"
          icon={
            <View
              style={[
                globalStyles.iconContainer,
                {
                  backgroundColor: '#3D56F0',
                },
              ]}>
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </LinearGradient>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default EventDetail;