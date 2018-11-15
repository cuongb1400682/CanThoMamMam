import React, {Component} from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import {FormInput, FormLabel} from "react-native-elements";
import PropTypes from "prop-types";

export default class InputBox extends Component {
  static DEFAULT_HEIGHT = Platform.select({
    android: 46,
    ios: 36,
  });

  static propTypes = {
    onChangeText: PropTypes.func,
    title: PropTypes.string,
    hint: PropTypes.string,
    error: PropTypes.string,
    keyboardType: PropTypes.string,
    style: PropTypes.object,
    rightButton: PropTypes.element,
    value: PropTypes.string,
    multiline: PropTypes.bool,
    editable: PropTypes.bool,
    noPadding: PropTypes.bool,
    formInputStyle: PropTypes.any,
  };

  static defaultProps = {
    noPadding: false,
  };

  state = {
    height: InputBox.DEFAULT_HEIGHT,
  };

  focus() {
    this.refs.formInput.refs.inputBox.focus();
  }

  render() {
    const {
      onChangeText,
      title,
      hint,
      error,
      keyboardType,
      style,
      rightButton,
      value,
      multiline,
      editable,
      noPadding,
      formInputStyle,
    } = this.props;

    const {
      height
    } = this.state;

    return (
      <View style={style}>
        {title && <FormLabel>{title.toUpperCase()}</FormLabel>}
        <View style={{flexDirection: "row", flex: 1}}>
          <FormInput
            ref="formInput"
            value={value}
            textInputRef={"inputBox"}
            containerStyle={[{flex: 1}, formInputStyle && formInputStyle]}
            keyboardType={keyboardType}
            underlineColorAndroid="#cfd5db"
            multiline={multiline}
            editable={editable}
            placeholder={hint}
            style={[!noPadding && styles.formInput, multiline && {height: Math.max(InputBox.DEFAULT_HEIGHT, height)}]}
            onChangeText={onChangeText}
            onContentSizeChange={event => {
              if (multiline) {
                this.setState({height: event.nativeEvent.contentSize.height})
              }
            }}
          />
          {rightButton}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  formInput: {
    fontSize: 16,
    paddingTop: 8,
    paddingBottom: 8,
    margin: 0,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 20,
    marginRight: 20,
    color: "red",
  },
});
