import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import React, {Component} from 'react';
import {Icon, ListItem} from "react-native-elements";
import Colors from "../../../res/colors/index";
import Touchable from "../../../Views/Touchable";
import PropTypes from "prop-types";

export default ({icon, title, content, onPress, subtitleNumberOfLines, onLayout, rightIcon, iconType = "material", ...rest}) => {
  // if the InfoRow is just for showing text, we don't need it to response press event
  return (
    <Touchable onPress={onPress} onLayout={onLayout}>
      <View style={{flexDirection: 'row', paddingLeft: 16}}>
        <Icon
          name={icon}
          color={Colors.primary}
          type={iconType}
        />
        <ListItem
          containerStyle={{flex: 1}}
          title={title}
          subtitle={content}
          subtitleNumberOfLines={subtitleNumberOfLines}
          rightIcon={rightIcon}
          {...rest}
        />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({});

Component.contextTypes = {
  rootTag: PropTypes.number,
};
