import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Avatar, Text} from "react-native-elements";

export default ({name, avatar, following, style}) => {
    return (
        <View style={[styles.container, style]}>
            <Avatar
                containerStyle={{marginRight: 16}}
                xlarge
                large
                rounded
                source={{uri: avatar}}
                onPress={() => {
                }}
            />
            <View>
                <Text h4>{name}</Text>
                <Text h5>{following}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});
