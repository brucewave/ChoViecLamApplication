import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Mapbox, { ShapeSource, SymbolLayer, Camera, Images, CircleLayer } from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';
import { featureCollection, point } from '@turf/helpers';
import icon_partime from '../../assets/images/icon_partime.png';

Mapbox.setAccessToken(process.env.MAP_API_KEY || '');

const MapScreen = () => {
  const jobLocations = [
    point([-122.0854173, 37.4220013]),
    point([-122.085, 37.422]),
    point([-122.086, 37.423]),
    point([-122.084, 37.421]),
    point([-122.0855, 37.4225]),
    point([-122.0852, 37.4222]),
    point([-122.0858, 37.4218]),
    point([-122.0865, 37.4223]),
    point([-122.0845, 37.4215]),
    point([-122.0853, 37.4231]),
    point([-122.0862, 37.4235]),
    point([-122.0848, 37.4228]),
    point([-122.0857, 37.4212]),
    point([-122.0851, 37.4219]),
  ];

  return (
    <Mapbox.MapView style={{ flex: 1, width: '100%', height: '100%' }}>
      <Mapbox.Camera followZoomLevel={14} followUserLocation={true} />
      <Mapbox.LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      <ShapeSource 
      id="jobs" 
      cluster
      onPress={(e) => console.log(JSON.stringify(e,null,2))}
      clusterRadius={50} 
      shape={featureCollection(jobLocations)}>
        
        <CircleLayer 
          id="clusters"
          filter={['has', 'point_count']}
          style={{
            circlePitchAlignment: 'map',
            circleColor: '#FF0000', 
            circleRadius: 20,
            circleOpacity: 1,
            circleStrokeWidth: 2,
            circleStrokeColor: 'white',
          }}
        />

        <SymbolLayer
          id="clusters-count"
          filter={['has', 'point_count']}
          style={{
            textField: ['get', 'point_count'], 
            textColor: 'white',
            textSize: 12,
            textPitchAlignment: 'map',
          }}
        />

        {/* Symbol layer for individual job markers */}
        <SymbolLayer
          id="job-icons"
          filter={['!', ['has', 'point_count']]}
          style={{
            iconImage: 'icon_partime', 
            iconSize: 0.2,
          }}
        />

        {/* Load icon for individual job markers */}
        <Images images={{ icon_partime }} />
      </ShapeSource>
    </Mapbox.MapView>
  );
};

export default MapScreen;
