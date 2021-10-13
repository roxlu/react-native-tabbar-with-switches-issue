/* 
  ---------------------------------------------------------------

                       ██████╗  ██████╗ ██╗  ██╗██╗     ██╗   ██╗
                       ██╔══██╗██╔═══██╗╚██╗██╔╝██║     ██║   ██║
                       ██████╔╝██║   ██║ ╚███╔╝ ██║     ██║   ██║
                       ██╔══██╗██║   ██║ ██╔██╗ ██║     ██║   ██║
                       ██║  ██║╚██████╔╝██╔╝ ██╗███████╗╚██████╔╝
                       ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚═════╝ 

                                                    www.roxlu.com
                                            www.twitter.com/roxlu
  
  ---------------------------------------------------------------

  GENERAL INFO:

    I've created this bare bone application to debug an issue
    I was running into using a bottom tab bar navigator with a 
    header that contains a toggle. 

    The tab bar has 3 tabs. When you switch one by one and then
    click the toggle, the toggle quickly jumps to its final state
    w/o the smooth animation it normally uses (on Android).

    The smooth toggle animation is only removed when you've switched
    between each tab and then go back to the first one. So to reproduce
    you can do:

    - Click "screena" tab button
    - Click "screenb" tab button
    - Click "screenc" tab button
    - Click "screena" tab button again
    - Toggle the switch; you'll notice that it the once smooth animation
      is gone.

    See this video to see what happens:  https://imgur.com/a/j6YaY9W

*/


/* --------------------------------------------------------------- */

import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Switch,
} from 'react-native';

/* --------------------------------------------------------------- */

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* --------------------------------------------------------------- */

const SET_AVAILABILITY = 'app/setavailability';

/* --------------------------------------------------------------- */

const RoxContext = createContext();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* --------------------------------------------------------------- */

const initial_state = {
  is_available: false
};

const roxReducer = (state = initial_state, action) => {

  switch(action.type) {
      
    case SET_AVAILABILITY: {
      console.log("Setting availability to: " +((action.data) ? "y" : "n"));
      return {...state, is_available: action.data}
    }
  };
  
  return {...state};
};

const actions = {

  setAvailability: (value) => {
    return {
      type: SET_AVAILABILITY,
      data: value
    }
  }
};

/* --------------------------------------------------------------- */

const RoxContextProvider = ({children}) => {

  const [state, dispatch ] = useReducer(roxReducer, {});
  const ctx = {
    state,
    dispatch,
    ...actions,
  };

  return (
    <RoxContext.Provider value={ctx}>{children}</RoxContext.Provider>
  );
};

/* --------------------------------------------------------------- */

const ScreenA = (props) => {

  const nav = useNavigation();

  useEffect(() => {
    const state = nav.getState()
    if (state.routes.length > 1)
      nav.reset({
        routes: [
          { name: 'screena' } // 'screenb', 'screenc'
        ]
      })
  }, []);
  
  return (
    <View>
      <Text style={styles.screenText}> Screen A </Text>
    </View>
  )
};

const ScreenB = (props) => {
  return (
    <View>
      <Text style={styles.screenText}> Screen B </Text>
    </View>
  )
};

const ScreenC = (props) => {
  return (
    <View>
      <Text style={styles.screenText}> Screen C </Text>
    </View>
  )
};

/* --------------------------------------------------------------- */

var screen_options= {
  header: () => {},
  swipeEnabled: false,
  gestureEnabled: false,
};

var stack_options = {
  gestureEnabled: false,
  ...TransitionPresets.SlideFromRightIOS,
};

/* --------------------------------------------------------------- */

const TabberHeader = (props) => {

  let ctx = useContext(RoxContext);

  const onSwitchChange = (value) => {
    console.log("Changed");
    ctx.dispatch(ctx.setAvailability(value));
  };
  
  return (
    <View style={styles.headerContainer}>
      <Switch value={ctx.state.is_available} onValueChange={onSwitchChange} />
    </View>
  );
};

const TabberNavigation = (props) => {

  const tab_screen_options = {
    header:  ({ navigation, route, options }) => {
      return (
        <TabberHeader />
      );
    }
  };
  
  return (
    <Tab.Navigator screenOptions={tab_screen_options}>
      <Tab.Screen name="screena" component={ScreenA} options={stack_options} />
      <Tab.Screen name="screenb" component={ScreenB} options={stack_options} />
      <Tab.Screen name="screenc" component={ScreenC} options={stack_options} />
    </Tab.Navigator> 
  );
};

/* --------------------------------------------------------------- */

const App: () => Node = () => {
  return (
    <RoxContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="tabber" screenOptions={screen_options}>
          <Stack.Screen name="tabber" component={TabberNavigation} options={stack_options} />
        </Stack.Navigator>
      </NavigationContainer>
    </RoxContextProvider>
  );
};

/* --------------------------------------------------------------- */

export default App;

/* --------------------------------------------------------------- */

const styles = StyleSheet.create({

  headerContainer: {
    padding: 10,
    backgroundColor: 'darksalmon',
  },

  screenText: {
    fontSize: 30,
    textAlign: 'center',
    
  },
});

/* --------------------------------------------------------------- */
