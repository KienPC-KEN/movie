import {Dimensions, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchScreen from '../screens/search/SearchScreen';
import SubtitleScreen from '../screens/subtitle/SubtitleScreen';
import CaptionScreen from '../screens/caption/CaptionScreen';
import FavoriteScreen from '../screens/favorite/FavoriteScreen';
import SettingScreen from '../screens/setting/SettingScreen';
import {fonts} from '../assets/fonts';
import {Colors} from '../assets/color';
import {icons} from '../assets/icons';

const Tab = createBottomTabNavigator();

const MenuBottom = () => {
  return (
    <Tab.Navigator
      initialRouteName="Search"
      screenOptions={() => ({
        headerShown: false,
        keyboardHidesTabBar: false,
        tabBarStyle: {
          paddingTop: 24,
          paddingBottom: 16,
          height: 92,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          backgroundColor: 'black',
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.TextTilte,
        tabBarInactiveTintColor: Colors.MenuItem,
      })}>
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                alignItems: 'center',
                width: Dimensions.get('window').width / 5,
              }}>
              <icons.IconSearch
                height={size}
                width={size}
                stroke={focused ? Colors.TextTilte : Colors.MenuItem}
              />
              {focused ? (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.BeVietnamProBold700,
                      alignSelf: 'center',
                      color: Colors.TextTilte,
                    }}>
                    Search
                  </Text>
                  <icons.IconDot
                    style={{marginTop: 4}}
                    fill={Colors.TextTilte}
                  />
                </View>
              ) : null}
            </View>
          ),
          tabBarLabel: ({focused}) => '',
        }}
      />
      <Tab.Screen
        name="Subtitle"
        component={SubtitleScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                alignItems: 'center',
                width: Dimensions.get('window').width / 5,
              }}>
              <icons.IconSubtitle
                height={size}
                width={size}
                stroke={focused ? Colors.TextTilte : Colors.MenuItem}
              />
              {focused ? (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.BeVietnamProBold700,
                      alignSelf: 'center',
                      color: Colors.TextTilte,
                    }}>
                    Subtitle
                  </Text>
                  <icons.IconDot
                    style={{marginTop: 4}}
                    fill={Colors.TextTilte}
                  />
                </View>
              ) : null}
            </View>
          ),
          tabBarLabel: ({focused}) => '',
        }}
      />
      <Tab.Screen
        name="Caption"
        component={CaptionScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                alignItems: 'center',
                width: Dimensions.get('window').width / 5,
              }}>
              <icons.IconCaption
                height={size}
                width={size}
                stroke={focused ? Colors.TextTilte : Colors.MenuItem}
              />
              {focused ? (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.BeVietnamProBold700,
                      alignSelf: 'center',
                      color: Colors.TextTilte,
                    }}>
                    Caption
                  </Text>
                  <icons.IconDot
                    style={{marginTop: 4}}
                    fill={Colors.TextTilte}
                  />
                </View>
              ) : null}
            </View>
          ),
          tabBarLabel: ({focused}) => '',
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                alignItems: 'center',
                width: Dimensions.get('window').width / 5,
              }}>
              <icons.IconFavorite
                height={size}
                width={size}
                stroke={focused ? Colors.TextTilte : Colors.MenuItem}
              />
              {focused ? (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.BeVietnamProBold700,
                      alignSelf: 'center',
                      color: Colors.TextTilte,
                    }}>
                    Favorite
                  </Text>
                  <icons.IconDot
                    style={{marginTop: 4}}
                    fill={Colors.TextTilte}
                  />
                </View>
              ) : null}
            </View>
          ),
          tabBarLabel: ({focused}) => '',
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                alignItems: 'center',
                width: Dimensions.get('window').width / 5,
              }}>
              <icons.IconSetting
                height={size}
                width={size}
                stroke={focused ? Colors.TextTilte : Colors.MenuItem}
              />
              {focused ? (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.BeVietnamProBold700,
                      alignSelf: 'center',
                      color: Colors.TextTilte,
                    }}>
                    Setting
                  </Text>
                  <icons.IconDot
                    style={{marginTop: 4}}
                    fill={Colors.TextTilte}
                  />
                </View>
              ) : null}
            </View>
          ),
          tabBarLabel: ({focused}) => '',
        }}
      />
    </Tab.Navigator>
  );
};

export default MenuBottom;
