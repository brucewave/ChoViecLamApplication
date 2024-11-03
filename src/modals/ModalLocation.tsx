// import axios from 'axios';
// import {SearchNormal1} from 'iconsax-react-native';
// import React, {useEffect, useState} from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   Modal,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {
//   ButtonComponent,
//   InputComponent,
//   RowComponent,
//   SpaceComponent,
//   TextComponent,
// } from '../components';
// import {appColors} from '../constants/appColors';
// import {LocationModel} from '../models/LocationModel';
// import MapView from 'react-native-maps';
// import {appInfo} from '../constants/appInfos';
// import {AddressModel} from '../models/AddressModel';
// import GeoLocation from '@react-native-community/geolocation';
// import GeoCoder from 'react-native-geocoding';
// import {Marker} from 'react-native-svg';

// GeoCoder.init(process.env.MAP_API_KEY as string);

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   onSelect: (val: {
//     address: string;
//     postion?: {
//       lat: number;
//       long: number;
//     };
//   }) => void;
// }

// const ModalLocation = (props: Props) => {
//   const {visible, onClose, onSelect} = props;
//   const [searchKey, setSearchKey] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [locations, setLocations] = useState<LocationModel[]>([]);
//   const [addressSelected, setAddressSelected] = useState('');

//   const [currentLocation, setCurrentLocation] = useState<{
//     lat: number;
//     long: number;
//   }>();

//   useEffect(() => {
//     GeoLocation.getCurrentPosition(
//       position => {
//         if (position.coords) {
//           setCurrentLocation({
//             lat: position.coords.latitude,
//             long: position.coords.longitude,
//           });
//         }
//       },
//       error => {
//         console.log(error);
//       },
//       {},
//     );
//   }, []);

//   useEffect(() => {
//     GeoCoder.from(addressSelected)
//       .then(res => {
//         const position = res.results[0].geometry.location;

//         setCurrentLocation({
//           lat: position.lat,
//           long: position.lng,
//         });
//       })
//       .catch(error => console.log(error));
//   }, [addressSelected]);

//   useEffect(() => {
//     if (!searchKey) {
//       setLocations([]);
//     }
//   }, [searchKey]);

//   const handleClose = () => {
//     onClose();
//   };

//   const handleSearchLocation = async () => {
//     const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=20&apiKey=lcIT8toRfGKDLZwdIWEdB2Y9Uvur1CvjXZ9aZwEA5As`;

//     try {
//       setIsLoading(true);
//       const res = await axios.get(api);

//       if (res && res.data && res.status === 200) {
//         setLocations(res.data.items);
//       }

//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleGetAddressFromPosition = ({
//     latitude,
//     longitude,
//   }: {
//     latitude: number;
//     longitude: number;
//   }) => {
//     onSelect({
//       address: 'This is demo address',
//       postion: {
//         lat: latitude,
//         long: longitude,
//       },
//     });
//     onClose();
//     GeoCoder.from(latitude, longitude)
//       .then(data => {
//         console.log(data);
//         console.log(data.results[0].address_components[0]);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };

//   return (
//     <Modal animationType="slide" visible={visible} style={{flex: 1}}>
//       <View style={{paddingVertical: 42}}>
//         <RowComponent
//           justify="flex-end"
//           styles={{marginVertical: 20, paddingHorizontal: 20}}>
//           <View style={{flex: 1}}>
//             <InputComponent
//               styles={{marginBottom: 0}}
//               affix={<SearchNormal1 size={20} color={appColors.gray} />}
//               placeholder="Search"
//               value={searchKey}
//               allowClear
//               onChange={val => setSearchKey(val)}
//               onEnd={handleSearchLocation}
//             />
//           </View>
//           <View
//             style={{
//               position: 'absolute',
//               top: 56,
//               right: 10,
//               left: 10,
//               backgroundColor: appColors.white,
//               zIndex: 5,
//               padding: 20,
//             }}>
//             {isLoading ? (
//               <ActivityIndicator />
//             ) : locations.length > 0 ? (
//               <FlatList
//                 data={locations}
//                 renderItem={({item}) => (
//                   <TouchableOpacity
//                     style={{marginBottom: 12}}
//                     onPress={() => {
//                       setAddressSelected(item.address.label);
//                       setSearchKey('');
//                     }}>
//                     <TextComponent text={item.address.label} />
//                   </TouchableOpacity>
//                 )}
//               />
//             ) : (
//               <View>
//                 <TextComponent
//                   text={searchKey ? 'Location not found' : 'Search location'}
//                 />
//               </View>
//             )}
//           </View>
//           <SpaceComponent width={12} />
//           <ButtonComponent text="Cancel" type="link" onPress={handleClose} />
//         </RowComponent>
//         {currentLocation && (
//           <MapView
//             style={{
//               width: appInfo.sizes.WIDTH,
//               height: appInfo.sizes.HEIGHT - 220,
//               marginVertical: 40,
//               zIndex: -1,
//             }}
//             showsMyLocationButton
//             showsUserLocation
//             initialRegion={{
//               latitude: currentLocation.lat,
//               longitude: currentLocation.long,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}
//             onPress={event =>
//               handleGetAddressFromPosition(event.nativeEvent.coordinate)
//             }
//             region={{
//               latitude: currentLocation.lat,
//               longitude: currentLocation.long,
//               latitudeDelta: 0.001,
//               longitudeDelta: 0.015,
//             }}
//             mapType="standard"
//           />
//         )}
//         <View
//           style={{
//             position: 'absolute',
//             bottom: 10,
//             left: 0,
//             right: 0,
//           }}>
//           <ButtonComponent
//             styles={{marginBottom: 40}}
//             text="Confirm"
//             onPress={() => {
//               onSelect({
//                 address: addressSelected,
//                 postion: currentLocation,
//               });

//               onClose();
//             }}
//             type="primary"
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default ModalLocation;
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, InputComponent, TextComponent } from '../components';
import { RowComponent, SpaceComponent } from '../components';
import { appColors } from '../constants/appColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SearchNormal1 } from 'iconsax-react-native';
import axios from 'axios';
import { LocationModel } from '../models/LocationModel';


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

  const handleClose = () => {
    onClose();
  }

  useEffect(() => {
    if (!searchKey) {
      setLocations([]);
    }
  }, [searchKey]);

  const handleSearchLocation = async () => {
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=20&apiKey=lcIT8toRfGKDLZwdIWEdB2Y9Uvur1CvjXZ9aZwEA5As`;
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

  }



  return (
    <Modal animationType="fade" visible={visible} style={{flex: 1}}>
      <View style={{paddingVertical: 42, paddingHorizontal: 42}}>
        <RowComponent justify="flex-end"  styles={{marginBottom: 20}}>
          <View style={{flex: 1}}>
            <InputComponent 
            styles={{marginBottom: 0}}
            affix={<SearchNormal1 size={20} color={appColors.gray} />}
            placeholder="Tìm kiếm địa chỉ" 
            value={searchKey} 
            allowClear
            onEnd={handleSearchLocation}
            onChange={val => setSearchKey(val)} />
          </View>
          <SpaceComponent width={12} />


          <ButtonComponent text="Đóng" type="link" onPress={handleClose} />
        
        </RowComponent>

        <View>
          {isLoading ? <ActivityIndicator /> : locations.length > 0 ? <FlatList data={locations} renderItem={({item}) => <TextComponent text={item.address.label} />} /> : <TextComponent text={searchKey ? 'Không tìm thấy địa chỉ' : 'Tìm kiếm địa chỉ'} />}
        </View>


      </View>
    </Modal>
  )
}

export default ModalLocation