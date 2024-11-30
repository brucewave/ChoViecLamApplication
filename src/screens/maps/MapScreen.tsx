import GeoLocation from '@react-native-community/geolocation';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, TouchableOpacity, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import eventAPI from '../../apis/eventApi';
import {
  CardComponent,
  CategoriesList,
  EventItem,
  InputComponent,
  MakerCustom,
  RowComponent,
  SpaceComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {appInfo} from '../../constants/appInfos';
import {EventModel} from '../../models/EventModel';
import {globalStyles} from '../../styles/globalStyles';
import {useIsFocused} from '@react-navigation/native';
import {LoadingModal} from '../../modals';
import jobAPI from '../../apis/jobApi';
import { KnifeFork_Color } from '../../assets/svgs';

const MapScreen = ({navigation}: any) => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();


  useEffect(() => {
    GeoLocation.getCurrentPosition(
      (position: any) => {
        if (position.coords) {
          setCurrentLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        }
      },
      (error: any) => {
        console.log(error);
      },
      {},
    );
  }, []);
  
  useEffect(() => {
    currentLocation && getNearbyEvents();
  }, [currentLocation]);

  const getNearbyEvents = async () => {
    try {
      const api = `/getEvents?lat=${currentLocation?.lat}&long=${currentLocation?.long}`;
      const res = await jobAPI.HandleJob(api, null, 'get');
      try{
        console.log('res: ', res.data);
        setEvents(res.data);
      } catch (error) {
        console.log('No data received from API');
      }
    } catch (error) {
      console.log('Error fetching events: ', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'} />

      {currentLocation ? (
        <MapView
          style={{
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
          }}
          // showsMyLocationButton
          showsUserLocation
          initialRegion={{
            latitude: currentLocation.lat,
            longitude: currentLocation.long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={{
            latitude: currentLocation.lat,
            longitude: currentLocation.long,
            latitudeDelta: 0.001,
            longitudeDelta: 0.015,
          }}
          mapType="standard">
             {events.length > 0 &&
            events.map((event, index) => (
              event.position && event.position.lat !== null && event.position.long !== null && (
                <Marker
                  key={`event${index}`}
                  title={event.title}
                  description=""
                  onPress={() =>
                    navigation.navigate('EventDetail', {item: event})
                  }
                  coordinate={{
                    longitude: event.position.long,
                    latitude: event.position.lat,
                  }}>
                  <MakerCustom type={event.category} />
                </Marker>
              )
            ))}
        </MapView>
      ) : (
        <></>
      )}

      <View
        style={{
          position: 'absolute',
          // backgroundColor: 'rgba(255, 255, 255, 0.5)',
          top: 0,
          right: 0,
          left: 0,
          padding: 20,
          paddingTop: 48,
        }}>
        <RowComponent>
          <RowComponent styles={{flex: 1}}>
            <InputComponent
              styles={{marginBottom: 0}}
              affix={
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Explore', {
                      screen: 'HomeScreen',
                    })
                  }>
                  <ArrowLeft2 size={24} color={appColors.text} />
                </TouchableOpacity>
              }
              placeholder="Search"
              value=""
              onChange={val => console.log(val)}
            />
          </RowComponent>
          <SpaceComponent width={12} />
          <CardComponent
            onPress={getNearbyEvents}
            styles={[globalStyles.noSpaceCard, {width: 56, height: 56}]}
            color={appColors.white}>
            <MaterialIcons
              name="my-location"
              size={28}
              color={appColors.primary}
            />
          </CardComponent>
        </RowComponent>
        <SpaceComponent height={20} />
        <CategoriesList onFilter={catId => getNearbyEvents(catId)} />
      </View>

      <LoadingModal visible={isLoading} />
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          right: 0,
          left: 0,
        }}>
        <FlatList
          initialScrollIndex={0}
          data={events}
          renderItem={({item}) => <EventItem item={item} type="list" imageUrl={item.photoUrl} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default MapScreen;