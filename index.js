import React, {Component} from "react";
import {AppRegistry, View} from "react-native";

import {startApp} from "./App";

class App extends Component   {
  componentDidMount() {
    startApp();
  }

  render() {
    return (
      <View/>
    );
  }
}

AppRegistry.registerComponent("Photos", () => App);



