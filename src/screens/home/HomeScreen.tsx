import {
  HambergerMenu,
  Notification,
  SearchNormal1,
  Sort,
} from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  CategoriesList,
  CircleComponent,
  EventItem,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TabBarComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {fontFamilies} from '../../constants/fontFamilies';
import {authSelector} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../styles/globalStyles';
import { ImageBackground } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { AddressModel } from '../../models/AddressModel';
import Geocoder from 'react-native-geocoding';
import jobAPI from '../../apis/jobApi';
import { EventModel } from '../../models/EventModel';

Geocoder.init(process.env.GOOGLE_API_KEY as string);

const HomeScreen = ({navigation}: any) => {
  // const [currentLocation, setCurrentLocation] = useState<AddressModel>();
  const [jobs, setJobs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [diaChiHienTai, setDiaChiHienTai] = useState<AddressModel>();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobAPI.GetJobs(); 

        const formattedJobs = response.data.map((job: any) => ({
          title: job.title,
          description: job.description || 'Không có mô tả', 
          location: {
            title: job.locationTitle || 'Không có tiêu đề địa điểm', 
            address: job.locationAddress || 'Không có địa chỉ', 
          },
          imageUrl: job.photoUrl || '', 
          users: job.users || [], 
          authorId: job._id, 
          startAt: job.startAt, 
          endAt: job.endAt, 
          date: job.date, 
        }));

        setJobs(formattedJobs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())); 
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error); 
      }
    };

    fetchJobs(); // Gọi hàm
  }, []);

  
  useEffect(() => {
    getEvents();
    Geolocation.getCurrentPosition(position => {
      // console.log('position: ', position);
      daoNguocDiaChi({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    },
  );
  }, []);

  useEffect(() => {
    if (diaChiHienTai && diaChiHienTai.position) {
      getEvents(diaChiHienTai.position.lat, diaChiHienTai.position.lng);
    }
  }, [diaChiHienTai]);

  const daoNguocDiaChi = async ({lat, long}: {lat: number, long: number}) => {

    const apiKey = process.env.HERE_API_KEY;
    
    const apiUrl = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi&apiKey=${apiKey}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200 && response.data) {
        const items = response.data.items;
        setDiaChiHienTai(items[0]);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }

  
  const getEvents = async (lat?: number, long?: number, distance?: number) => {
    const api = `${lat && long ? 
    `/getEvents?lat=${lat}&long=${long}&distance=${distance ?? 5}&limit=5` 
    : `/getEvents?limit=5`}`;
    // &date=${new Date().toISOString}`;
    setIsLoading(true);
    try{
      const res = await jobAPI.HandleJob(api, null, 'get');
      // console.log('response: ', res.data);
      setIsLoading(false);
      res && res.data && (lat && long ? setNearbyEvents(res.data) :  setEvents(res.data));
    } catch (error) {
      console.log('No data received from API');
    }
  }


  const pullToRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 3000);

  };

  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      
      <View
        style={{
          backgroundColor: appColors.primary,
          height: 178 + (Platform.OS === 'ios' ? 16 : 0),
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52,
        }}>
        <View style={{paddingHorizontal: 16}}>
          <RowComponent>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <HambergerMenu size={24} color={appColors.white} />
            </TouchableOpacity>
            <View style={[{flex: 1, alignItems: 'center'}]}>
              <RowComponent>
                <TextComponent
                  text="Vị trí hiện tại"
                  color={appColors.white2}
                  size={12}
                />
                <MaterialIcons
                  name="arrow-drop-down"
                  size={18}
                  color={appColors.white}
                />
              </RowComponent>


              {diaChiHienTai && (
                <TextComponent
                text={diaChiHienTai.address.city + ', ' + diaChiHienTai.address.county}
                flex={0}
                color={appColors.white}
                font={fontFamilies.medium}
                size={13}
                />
              )}
            </View>

            <CircleComponent color="#524CE0" size={36}>
              <View>
                <Notification size={18} color={appColors.white} />
                <View
                  style={{
                    backgroundColor: '#02E9FE',
                    width: 10,
                    height: 10,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#524CE0',
                    position: 'absolute',
                    top: -2,
                    right: -2,
                  }}
                />
              </View>
            </CircleComponent>
          </RowComponent>
          <SpaceComponent height={24} />
          <RowComponent>
            <RowComponent
              styles={{flex: 1}}
              onPress={() =>
                navigation.navigate('SearchEvents', {
                  isFilter: false,
                })
              }>
              <SearchNormal1
                variant="TwoTone"
                size={22}
                color={appColors.white}
              />
              <View
                style={{
                  width: 1,
                  height: 18,
                  marginHorizontal: 12,
                  backgroundColor: '#A29EF0',
                }}
              />
              <TextComponent text="Search..." color={`#A29EF0`} flex={1} />
            </RowComponent>
            <RowComponent
              onPress={() =>
                navigation.navigate('SearchEvents', {
                  isFilter: true,
                })
              }
              styles={{
                backgroundColor: '#5D56F3',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 100,
              }}>
              <CircleComponent size={19.3} color={`#A29EF0`}>
                <Sort size={12} color={appColors.primary} />
              </CircleComponent>
              <SpaceComponent width={8} />
              <TextComponent text="Filters" color={appColors.white} />
            </RowComponent>
          </RowComponent>
          <SpaceComponent height={24} />
        </View>
        <View style={{marginBottom: -14}}>
          <CategoriesList isColor />
        </View>
      </View>
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={pullToRefresh} />
      }
       showsVerticalScrollIndicator={false}
       style={[
         {
           flex: 1,
           marginTop: Platform.OS === 'ios' ? 22 : 18,
         },
       ]}>
        <SectionComponent styles={{ paddingHorizontal: 0, paddingTop: 24 }}>
        <TabBarComponent title="Việc Vừa Đăng" onPress={() => {}} />
          {
            events.length > 0 ? <FlatList
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={pullToRefresh} />
            }
              showsHorizontalScrollIndicator={false}
              horizontal
              data={events} 
              renderItem={({ item, index }) => (
                <EventItem
                  key={`event${index}`}
                  item={item}
                  type="card"
                />
              )}
               
            /> : <LoadingComponent isLoading={isLoading} values={events.length} />
          }
       
      </SectionComponent>
       <SectionComponent>
         <ImageBackground 
           source={require('../../assets/images/invite-image.png')}
           style={{flex: 1, padding: 16, minHeight: 127}}
           imageStyle={{
             resizeMode: 'cover',
             borderRadius: 12,
           }}>
           <TextComponent text="Invite your friends" title />
           <TextComponent text="Get $20 for ticket" />

           <RowComponent justify="flex-start">
             <TouchableOpacity
               style={[
                 globalStyles.button,
                 {
                   marginTop: 12,
                   backgroundColor: '#00F8FF',
                   paddingHorizontal: 28,
                 },
               ]}>
               <TextComponent
                 text="INVITE"
                 font={fontFamilies.bold}
                 color={appColors.white}
               />
             </TouchableOpacity>
            </RowComponent>
          </ImageBackground>
        </SectionComponent>
        <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 24}}>
         <TabBarComponent title="Việc Gần Đây" onPress={() => {}} />
         {
          nearbyEvents.length > 0 ? <FlatList
           showsHorizontalScrollIndicator={false}
           horizontal
           data={nearbyEvents}
           renderItem={({item, index}) => (
             <EventItem key={`event${index}`} 
                 item={item}
                 type="card" 
               />
           )}
         /> : <LoadingComponent isLoading={isLoading} values={nearbyEvents.length} />
       }
       </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
