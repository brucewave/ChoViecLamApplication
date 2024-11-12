import { View, Text, Modal, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, InputComponent, MapComponent, TextComponent } from '../components';
import { RowComponent, SpaceComponent } from '../components';
import { appColors } from '../constants/appColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SearchNormal1 } from 'iconsax-react-native';
import axios from 'axios';
import { LocationModel } from '../models/LocationModel';
import MapView from 'react-native-maps';
import { appInfo } from '../constants/appInfos';
import Geolocation from '@react-native-community/geolocation';
import { AddressModel } from '../models/AddressModel';
import Geocoder from 'react-native-geocoding';
import { AxiosRequestConfig } from 'axios';

Geocoder.init(process.env.MAP_API_KEY as string);
interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (val: {
    address: string;
    postion?: {
      lat: number;
      long: number;
    };
  }) => void;
}


const ModalLocation = (props: Props) => {
  const {visible, onClose, onSelect} = props;
  const [searchKey, setSearchKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [addressSelected, setAddressSelected] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; long: number; }>();

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        setCurrentLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    });
  }, []);

  const handleSearchLocation = async () => {
    const apiKey = process.env.MAP_API_KEY || 'lcIT8toRfGKDLZwdIWEdB2Y9Uvur1CvjXZ9aZwEA5As';
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=20&apiKey=lcIT8toRfGKDLZwdIWEdB2Y9Uvur1CvjXZ9aZwEA5As`;

    try {
      setIsLoading(true);
      const response = await fetch(api);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.items) {
        setLocations(data.items);
      } else {
        console.log("Không có dữ liệu trả về từ API");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm địa chỉ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLatLongFromAddress = async (address: string) => {
    const apiKey = process.env.MAP_API_KEY;
    const apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
  
      // Here API trả về trong `items`, không phải `results`
      if (response.data && response.data.items && response.data.items.length > 0) {
        const location = response.data.items[0].position;
        const currentLocation = {
          lat: location.lat,
          long: location.lng,
        };
        
        console.log('--------location---------');
        console.log(currentLocation.lat);
        console.log(currentLocation.long);
        setCurrentLocation(currentLocation);
        return currentLocation;
      } else {
        console.log('Không tìm thấy địa chỉ');
        return null;
      }
    } catch (error) {
      // console.error('Lỗi khi lấy thông tin địa chỉ:', error);
      return null;
    }
  };
  const handleClose = () => {
    onClose();
  }

  useEffect(() => {
    if (!searchKey) {
      setLocations([]);
    }
  }, [searchKey]);
  

  return (
    <Modal animationType="fade" visible={visible} style={{flex: 1}}>
      <View style={{paddingVertical: 42, paddingHorizontal: 42}}>
        <RowComponent justify="flex-end" styles={{marginVertical: 10}}>
          <View style={{flex: 1}}>
            <InputComponent 
              styles={{marginBottom: 0}}
              affix={<SearchNormal1 size={20} color={appColors.gray} />}
              placeholder="Tìm kiếm địa chỉ" 
              value={searchKey} 
              allowClear
              onEnd={handleSearchLocation}
              onChange={val => setSearchKey(val)} 
            />
            <View style={{position: 'absolute', top: 60, right: 10, left: 10, backgroundColor: appColors.white, zIndex: 5, padding: 20}}>
              {isLoading ? <ActivityIndicator /> : locations.length > 0 ? (
                <FlatList 
                  data={locations} 
                  renderItem={({item}) => 
                    <TouchableOpacity onPress={() => {
                      setAddressSelected(item.address.label);
                      setSearchKey(item.address.label);
                      handleGetLatLongFromAddress(item.address.label);
                      setLocations([]);
                    }}>
                      <TextComponent text={item.address.label} />
                    </TouchableOpacity>
                  } 
                />
              ) : <TextComponent text={searchKey? '' : 'Tìm kiếm địa chỉ'} />}
            </View>
          </View>
          <SpaceComponent width={12} />
          <ButtonComponent text="Đóng" type="link" onPress={handleClose} />
        </RowComponent>
      {/* {currentLocation && } */}
      {/* <MapComponent apikey={process.env.MAP_API_KEY as string} /> */}



      <ButtonComponent styles={{marginTop: 40}} text="Chọn" onPress={() => {
        onSelect({
          address: addressSelected,
          postion: currentLocation,
        });
        console.log(addressSelected)
        onClose();
      }} type="primary" />
      </View>


      <MapComponent />


    </Modal>
  )
}

export default ModalLocation