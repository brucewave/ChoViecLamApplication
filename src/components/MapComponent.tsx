import { View, Text } from 'react-native'
import React from 'react'
import Mapbox, { MapView } from '@rnmapbox/maps'
import { appInfo } from '../constants/appInfos'


const accessToken = 'pk.eyJ1IjoiYXF1YW1hbjc5MyIsImEiOiJjbTM2NW54cjIwMXYyMm1vY2tuY2M1cms2In0.xc_bpG78AzFn3nsvPy8ouw'
Mapbox.setAccessToken(accessToken)



const MapComponent = () => {
  return <Mapbox.MapView style={{width: appInfo.sizes.WIDTH, height: 500}}>
    <Mapbox.Camera followZoomLevel={15} followUserLocation={true} />
    <Mapbox.LocationPuck />
  </Mapbox.MapView>
}

export default MapComponent