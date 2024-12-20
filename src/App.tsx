import {StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Search from './screens/search/SearchScreen';
import MenuBottom from './navigation/MenuBottom';
import {Colors} from './assets/color';
import SubtitleScreen from './screens/subtitle/SubtitleScreen';
import CaptionScreen from './screens/caption/CaptionScreen';
import FavoriteScreen from './screens/favorite/FavoriteScreen';
import SettingScreen from './screens/setting/SettingScreen';
import SettingLanguageScreen from './screens/setting/SettingLanguageScreen';
import DetailMovieSearchScreen from './screens/details/DetailMovieSearchScreen';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import LanguageDetailScreen from './screens/details/LanguageDetailScreen';
import PlaySubtitleScreen from './screens/play/PlaySubtitleScreen';
import SelectVideoAndCaptionScreen from './screens/caption/SelectVideoAndCaptionScreen';
import LoadingScreen from './screens/caption/LoadingScreen';
import SelectSubtitleScreen from './screens/subtitle/SelectSubtitleScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import VideoPreview from './screens/caption/VideoPreview';
import PlayCaptionScreen from './screens/caption/PlayCaptionScreen';

const App = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.Background,
    },
  };
  return (
    <NavigationContainer theme={MyTheme}>
      <Provider store={store}>
        <GestureHandlerRootView>
          <StatusBar backgroundColor={Colors.Background} barStyle={'default'} />
          <MainNavigator />
        </GestureHandlerRootView>
      </Provider>
    </NavigationContainer>
  );
};

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="BottomTab"
        component={MenuBottom}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Subtitle"
        component={SubtitleScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Caption"
        component={CaptionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SettingLanguageScreen"
        component={SettingLanguageScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailMovieSearchScreen"
        component={DetailMovieSearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LanguageDetailScreen"
        component={LanguageDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PlaySubtitleScreen"
        component={PlaySubtitleScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectVideoAndCaptionScreen"
        component={SelectVideoAndCaptionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectSubtitleScreen"
        component={SelectSubtitleScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VideoPreview"
        component={VideoPreview}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PlayCaptionScreen"
        component={PlayCaptionScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default App;

const styles = StyleSheet.create({});
