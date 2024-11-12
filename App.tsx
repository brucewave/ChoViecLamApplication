import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import AppRouters from './src/navigators/AppRouters';
import store from './src/redux/store';
import { Host } from 'react-native-portalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <Host>
          <NavigationContainer>
            <AppRouters />
            <Toast />
          </NavigationContainer>
          </Host>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
