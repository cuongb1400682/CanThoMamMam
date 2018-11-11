import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Account from '../index'
import logo from '../../res/images/logo.png'
import {SocialIcon} from "react-native-elements";
import * as res from "../../../app/res/index";


export default ({onLogin}) => {
    return (
        <View style={styles.container}>
            <Image style={{width: Dimensions.get('window').width}}
                   resizeMode="contain"
                   source={logo}/>
            <SocialIcon
                title={res.I18n.t('loginWithFacebook')}
                button
                type='facebook'
                onPress={() => {
                    onLogin(Account.LOGIN_METHOD_FACEBOOK)
                }}
            />
            <SocialIcon
                style={{backgroundColor: 'gray'}}
                title={res.I18n.t('notNow')}
                button
                onPress={() => {
                    onLogin(Account.LOGIN_METHOD_ANONYMOUS)
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
