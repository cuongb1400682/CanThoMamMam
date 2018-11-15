import React, {Component} from "react";
import {Icon} from "react-native-elements";
import {View, Text, TouchableNativeFeedback, TouchableOpacity, Platform} from "react-native";
import * as Colors from "../../../res/colors/index";
import PropTypes from "prop-types";

export default class Voter extends React.Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    isLikeButton: PropTypes.bool,
    count: PropTypes.number,
    style: PropTypes.any,
    selectedColor: PropTypes.string,
    unselectedColor: PropTypes.string,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isSelected: false,
    isLikeButton: false,
    count: 0,
    style: {flexDirection: 'column'},
    selectedColor: Colors.default.primary,
    unselectedColor: "gray",
    onPress: () => null,
  };

  render() {
    const {
      selectedColor, unselectedColor, isSelected, isLikeButton, count, style, onPress,
    } = this.props;

    const TouchableElement = Platform.select({
      'ios': TouchableOpacity,
      'android': TouchableNativeFeedback
    });

    return (
      <TouchableElement onPress={onPress}>
        <View style={[{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 44}]}>
          <Icon
            name={isLikeButton ? 'thumb-up' : 'thumb-down'}
            color={isSelected ? selectedColor : unselectedColor}
          />
          <Text>{`${count}`}</Text>
        </View>
      </TouchableElement>
    );
  }
}
