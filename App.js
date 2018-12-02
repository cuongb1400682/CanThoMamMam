import React from "react";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {autoRehydrate, persistStore} from "redux-persist";
import {AsyncStorage} from 'react-native';
import {Navigation} from 'react-native-navigation';
import PlacesList from "./app/PlacesList/index";
import PlaceDetails from "./app/PlaceDetails/index";
import MyAddedPlaces from "./app/MyAddedPlaces/index";
import ImageViewer from "./app/ImageViewer/index";
import Login from "./app/Account/Login/index";
import Account from "./app/Account/index";
import MoreDetails from "./app/MoreDetails/index";
import Promotions from "./app/Promotions/index";
import icHome from './app/res/images/ic_home.png'
import icAccount from './app/res/images/ic_account_box.png'
import icPromotions from "./app/res/images/ic_promotions.png"
import icMarker from "./app/res/images/ic_marker.png"
import codePush from "react-native-code-push";
import {composeWithDevTools} from 'remote-redux-devtools';
import user from "./app/Account/reducer";
import places from "./app/components/PromotionList/reducer";
import usersInfo from "./app/components/UserAvatar/reducer";
import comments from "./app/components/Comments/reducer";
import Colors from "./app/res/colors/index";
import PlaceMap from "./app/PlaceMap/PlaceMap";
import AllSubscriptions from "./app/AllSubscriptions/AllSubscriptions";

const reducer = combineReducers({user, places, usersInfo, comments});

const middleWares = composeWithDevTools(applyMiddleware(thunk), autoRehydrate());
export const store = createStore(reducer, undefined, middleWares);

persistStore(store, {storage: AsyncStorage});

// Screens
Navigation.registerComponent('PlacesList', () => PlacesList, store, Provider);
Navigation.registerComponent('MyAddedPlaces', () => MyAddedPlaces, store, Provider);
Navigation.registerComponent('PlaceDetails', () => PlaceDetails, store, Provider);
Navigation.registerComponent('Account', () => Account, store, Provider);
Navigation.registerComponent('MoreDetails', () => MoreDetails, store, Provider);
Navigation.registerComponent('PlaceMap', () => PlaceMap, store, Provider);
Navigation.registerComponent('Login', () => Login, store, Provider);
Navigation.registerComponent('Promotions', () => Promotions, store, Provider);
Navigation.registerComponent('ImageViewer', () => ImageViewer, store, Provider);
Navigation.registerComponent('AllSubscriptions', () => AllSubscriptions, store, Provider);

const startApp = () => {
  Navigation.startTabBasedApp({
    tabs: [
      {
        screen: 'PlacesList',
        label: 'Trang chủ',
        icon: icHome,
      },
      {
        screen: 'Promotions',
        label: 'Phân loại',
        icon: icPromotions,
      },
      {
        screen: 'PlaceMap',
        label: 'Xung quanh',
        icon: icMarker,
      },
      {
        screen: 'Account',
        label: 'Tài khoản',
        icon: icAccount,
      },
    ],
    tabsStyle: { // iOS only
      tabBarSelectedButtonColor: Colors.primaryDark,
    }
  });

  codePush({checkFrequency: codePush.CheckFrequency.ON_APP_RESUME})(store);
};

export {
  startApp
};
