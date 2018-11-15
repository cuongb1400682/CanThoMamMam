import {StyleSheet, View, Platform, Text} from 'react-native';
import React, {Component} from 'react';
import {Icon, Tile} from "react-native-elements";
import * as res from "../../../../../app/res/index";
import {centerAll} from "../../../../res/styles/index";

export default () => {
  return (
    <View style={{flex: 1, ...centerAll}}>
      <Icon
        containerStyle={{marginBottom: 8}}
        type='material-community'
        name='emoticon-sad'/>
      <Text>{res.I18n.t('empty_promotion_list')}</Text>
    </View>
  )
}