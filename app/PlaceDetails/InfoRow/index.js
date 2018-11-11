import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import React, {Component} from 'react';
import {Icon, ListItem} from "react-native-elements";
import PropTypes from "prop-types";

import Colors from "../../res/colors/index";
import Touchable from "../../../app/Views/Touchable";

export default ({icon, title, content, onPress, subtitleNumberOfLines}) => {
  // if the InfoRow is just for showing text, we don't need it to response press event
  return (
    <Touchable onPress={onPress}>
      <View style={{flexDirection: 'row', paddingLeft: 16}}>
        <Icon
          name={icon}
          color={Colors.primary}/>
        <ListItem
          containerStyle={{flex: 1}}
          title={title}
          subtitle={content}
          subtitleNumberOfLines={subtitleNumberOfLines}
        />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({});

Component.contextTypes = {
  rootTag: PropTypes.number,
};
