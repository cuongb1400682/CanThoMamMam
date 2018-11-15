import {Dimensions, Image, StyleSheet, TouchableHighlight, View} from 'react-native';
import React from 'react';
import Account from '../index'
import logo from '../../res/images/logo.png'
import {SocialIcon} from "react-native-elements";
import {tr} from "../../../app/res/index";

export default ({onLogin, isWaiting}) => {
  return (
    <View style={styles.container}>
      <Image style={{width: Dimensions.get('window').width}}
             resizeMode={Image.resizeMode.contain}
             source={logo}/>

      <SocialIcon
        title={tr('log_in_with_facebook_button_title')}
        button
        type='facebook'
        loading={isWaiting}
        small
        onPress={() => {
          onLogin(Account.LOGIN_METHOD_FACEBOOK)
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  icon: {},
  text: {}
});