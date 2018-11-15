import React from 'react';
import {
  TouchableHighlight,
  Platform,
  TouchableNativeFeedback,
  View,
} from 'react-native';

const AndroidTouchable = ({ children, ...rest }) => {
  return (
    <TouchableNativeFeedback useForeground={true} {...rest}>
      {children}
    </TouchableNativeFeedback>
  );
};

const iOSTouchable = ({ children, ...rest }) => {
  return (
    <TouchableHighlight {...rest} underlayColor={'rgba(0,0,0,0.12)'}>
      {children}
    </TouchableHighlight>
  );
};

const Touchable =
  Platform.OS === 'android' && TouchableNativeFeedback.canUseNativeForeground()
    ? AndroidTouchable
    : iOSTouchable;
export default Touchable;
