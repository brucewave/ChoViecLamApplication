import { View, Text } from 'react-native'
import React from 'react'
import Mapbox, { MapView } from '@rnmapbox/maps'


const accessToken = 'pk.eyJ1IjoiYXF1YW1hbjc5MyIsImEiOiJjbTM2NW54cjIwMXYyMm1vY2tuY2M1cms2In0.xc_bpG78AzFn3nsvPy8ouw'
Mapbox.setAccessToken(accessToken)


const MapComponent = () => {
  return <Mapbox.MapView  style={{flex: 1}} />
}

export default MapComponent