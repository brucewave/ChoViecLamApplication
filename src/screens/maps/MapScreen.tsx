import {View, Text, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import Mapbox, { ShapeSource, SymbolLayer, Camera, Images } from '@rnmapbox/maps';
import { appInfo } from '../../constants/appInfos';
import Geolocation from '@react-native-community/geolocation'
import { featureCollection, point } from '@turf/helpers';
import icon_partime from '../../assets/images/icon_partime.png';



Mapbox.setAccessToken(process.env.MAP_API_KEY || '');

const MapScreen = () => {
  // const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       setLocation({ latitude, longitude });
  //       console.log(latitude, longitude);
  //     },
  //     (error) => console.log(error),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //   );
  // }, []);

  return (
    <>
      <Mapbox.MapView style={{ flex: 1, width: '100%', height: '100%' }}>
        <Mapbox.Camera followZoomLevel={14} followUserLocation={true} />
        <Mapbox.LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      <ShapeSource
       id="jobs"
       shape={featureCollection([point([-122.0854173, 37.4220013])])}>
        <SymbolLayer
          id="jobs"
          style={{
            iconImage: 'icon_partime', 
            iconSize: 0.2,
          }}
          />
      <Images images={{icon_partime}} />
      </ShapeSource>
      </Mapbox.MapView>
    </>
  );
};


export default MapScreen;
