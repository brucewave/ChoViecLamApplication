import { View, Text, Modal, TouchableOpacity, Button, ActivityIndicator, FlatList } from "react-native";
import { ButtonComponent, InputComponent, SpaceComponent, TextComponent } from "../components";
import { RowComponent } from "../components";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { appColors } from "../constants/appColors";
import { useEffect, useState } from "react";
import { SearchNormal1 } from "iconsax-react-native";
import axios from "axios";
import { LocationModel } from "../models/LocationModel";
import MapView from 'react-native-maps';
import { appInfo } from "../constants/appInfos";
import GeoLocation from "@react-native-community/geolocation";
import { AddressModel } from "../models/AddressModel";
import GeoCoder from 'react-native-geocoding';
import { globalStyles } from '../styles/globalStyles'; 

GeoCoder.init(process.env.GOOGLE_API_KEY as string);

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

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();

  useEffect(() => {
    GeoLocation.getCurrentPosition(
      position => {
        if (position.coords) {
          setCurrentLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        }
      },
      error => {
        console.log(error);
      },
      {},
    );
  }, []);

  useEffect(() => {
    GeoCoder.from(addressSelected)
      .then(res => {
        const position = res.results[0].geometry.location;

        setCurrentLocation({
          lat: position.lat,
          long: position.lng,
        });
      })
      .catch(error => console.log(error));
  }, [addressSelected]);

  useEffect(() => {
    if (!searchKey) {
      setLocations([]);
    }
  }, [searchKey]);

  const handleClose = () => {
    onClose();
  };

  const handleSearchLocation = async () => {
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=20&apiKey=EoGZAqvCk9NFBvK6Trb_9iudji1DWPy1QfnsJN0GRlo`;

    try {
      setIsLoading(true);
      const res = await axios.get(api);

      if (res && res.data && res.status === 200) {
        setLocations(res.data.items);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAddressFromPosition = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    onSelect({
      address: 'This is demo address',
      postion: {
        lat: latitude,
        long: longitude,
      },
    
    });
    onClose();
    // GeoCoder.from(latitude, longitude)
    //   .then(data => {
    //     // console.log(data);
    //     // console.log(data.results[0].address_components[0]);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };


  return (
    <Modal 
      animationType="slide" 
      visible={visible} 
      style={{flex: 1}}
    >
      <View style={{paddingVertical: 42, paddingHorizontal: 22}}>
        <RowComponent justify="flex-end" styles={{marginVertical: 10}}>
          <View style={{flex: 1}}>
            <InputComponent 
              styles={{marginBottom: 0}}
              affix={<SearchNormal1 size={20} color={appColors.gray} />}
              placeholder="Tìm kiếm địa chỉ"
              value={searchKey} 
              allowClear
              onChange={val => setSearchKey(val)} 
              onEnd={handleSearchLocation}
            />
          </View>
          <SpaceComponent width={12} />
          <ButtonComponent text="Đóng" type="link" onPress={handleClose} />
          {/* <TouchableOpacity onPress={handleClose}>
            <AntDesign name="close" size={20} color={appColors.text} />
          </TouchableOpacity> */}
        </RowComponent>
        <View style={{flex: 1}}>
        <View style={{position: 'absolute', top: 0, right: 10, left: 10, backgroundColor: appColors.white, zIndex: 5, padding: 20}}>
          {isLoading ? (
            <ActivityIndicator />
          ) : locations.length > 0 ? (
            <FlatList
              data={locations}
              renderItem={({item}) => (
                <TouchableOpacity
                 style={{marginBottom: 12}}
                 onPress={() => {
                  setAddressSelected(item.address.label);
                  setSearchKey('');
                }}>
                  <TextComponent text={item.address.label} />
                </TouchableOpacity>
              )}
            />
            ) : (
              <View>
                <TextComponent text={searchKey? 'Không tìm thấy địa chỉ' : ''} />
              </View>
            )}
          </View>
        </View>
      </View>
      {
        currentLocation && (
          <MapView
          showsUserLocation
          showsMyLocationButton
          style={{width: appInfo.sizes.WIDTH, height: 400, marginTop: 140}} 
          initialRegion={{
            latitude: currentLocation.lat,
            longitude: currentLocation.long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }} 
              onPress={event => {
                handleGetAddressFromPosition(event.nativeEvent.coordinate);
              }}
            region={{
              latitude: currentLocation.lat,
              longitude: currentLocation.long,
              latitudeDelta: 0.001,
              longitudeDelta: 0.015,
            }}
            mapType="standard"
            // onRegionChange={val => console.log('val: ', val)}
            
          />
        )
      }
       <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
          }}>
          <ButtonComponent
            styles={{marginBottom: 40}}
            text="Confirm"
            onPress={() => {
              onSelect({
                address: addressSelected,
                postion: currentLocation,
              });

              onClose();
            }}
            type="primary"
          />
        </View>
    </Modal>
  )
}

export default ModalLocation    