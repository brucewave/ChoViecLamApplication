import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken('pk.eyJ1IjoiYXF1YW1hbjc5MyIsImEiOiJjbTM2NW54cjIwMXYyMm1vY2tuY2M1cms2In0.xc_bpG78AzFn3nsvPy8ouw');

const MapScreen = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1
  }
});

export default MapScreen;
