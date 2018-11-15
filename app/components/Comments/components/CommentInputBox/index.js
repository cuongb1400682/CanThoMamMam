import {View, ActivityIndicator} from 'react-native';
import {Icon} from "react-native-elements";
import Touchable from "../../../../Views/Touchable";
import React from 'react';
import Colors from "../../../../res/colors/index";
import InputBox from "../../../../MoreDetails/components/InputBox/index";
import {tr} from "../../../../res";

export default ({value, onTextChange, onSend, hint, enable, isWaiting, ...rest}) => {
  console.log('isWaiting = ', isWaiting);
  return (
    <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
      <InputBox
        style={{flex: 1}}
        noPadding={true}
        formInputStyle={{marginRight: 0, marginLeft: 4, marginTop: 0}}
        multiline={true}
        value={value}
        hint={!hint ? tr('comment_input_box_hint') : hint}
        onChangeText={text => onTextChange && onTextChange(text)}
        editable={enable}
      />
      {
        (!isWaiting)
          ? <Touchable onPress={() => (onSend && enable) && onSend(this.text)}>
            <Icon
              name={"send"}
              color={enable ? Colors.primary : "gray"}
              underlayColor={"#cbf7fe"}
              size={32}
              containerStyle={{height: 48, width: 48}}
            />
          </Touchable>
          : <View style={{height: 48, width: 48, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size={"small"} color={Colors.primary}/>
          </View>
      }
    </View>
  );
}
