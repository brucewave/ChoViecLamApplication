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
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  CategoriesList,
  CircleComponent,
  EventItem,
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

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [currentLocation, setCurrentLocation] = useState<AddressModel>();
  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        reverseGeoCode({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    });
  }, []);


  const auth = useSelector(authSelector);


  const getCoordinatesFromAddress = async (address: string) => {
    const apiKey = process.env.MAP_API_KEY;
    const apiUrl = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.results.length > 0) {
        const result = response.data.results[0];
        const location = result.geometry.location;
        const formattedAddress = result.formatted_address;
        const addressComponents = result.address_components;
        
        reverseGeoCode({ lat: location.lat, long: location.lng });

      } else {
        console.log('No results found for the address.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };
  
  useEffect(() => {
    getCoordinatesFromAddress('64 Nguyễn Chí Thanh, Hải Châu, Đà Nẵng');
  }, []);





  const reverseGeoCode = async ({ lat, long }: { lat: number; long: number }) => {
    const apiKey = process.env.MAP_API_KEY;
    const apiUrl = `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;
  
    try {
      const res = await axios.get(apiUrl);
  
      if (res.data && res.data.results.length > 0) {
        const result = res.data.results[0];
        const formattedAddress = result.formatted_address;
      } else {
        console.log('No results found for the coordinates.');
      }
    } catch (error) {
      console.log('Error fetching address:', error);
    }
  };



  const itemEvent = {
    title: 'Nhân viên phục vụ nhà hàng',
    description:
      'Nhà hàng Ánh Sao cần tuyển 10 nhân viên phục vụ nhà hàng',
    location: {
      title: 'Nhà hàng Ánh Sao',
      address: '36 Nguyễn Chí Thanh, Hải Châu, Đà Nẵng',
    },
    imageUrl: '',
    users: [''],
    authorId: '',
    startAt: Date.now(),
    endAt: Date.now(),
    date: Date.now(),
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
                  text="Current Location"
                  color={appColors.white2}
                  size={12}
                />
                <MaterialIcons
                  name="arrow-drop-down"
                  size={18}
                  color={appColors.white}
                />
              </RowComponent>


              {currentLocation && (
                <TextComponent
                text={`${currentLocation.address.city}, ${currentLocation.address.county}`}
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
       showsVerticalScrollIndicator={false}
       style={[
         {
           flex: 1,
           marginTop: Platform.OS === 'ios' ? 22 : 18,
         },
       ]}>
       <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 24}}>
         <TabBarComponent title="Việc Vừa Đăng" onPress={() => {}} />
         <FlatList
           showsHorizontalScrollIndicator={false}
           horizontal
           data={Array.from({length: 5})}
           renderItem={({item, index}) => (
             <EventItem key={`event${index}`} item={itemEvent} type="card" />
           )}
         />
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
         <TabBarComponent title="Việc gần đây" onPress={() => {}} />
         <FlatList
           showsHorizontalScrollIndicator={false}
           horizontal
           data={Array.from({length: 5})}
           renderItem={({item, index}) => (
             <EventItem key={`event${index}`} item={itemEvent} type="card" />
           )}
         />
       </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
