import React, {Component} from "react";
import {ActivityIndicator, FlatList, ScrollView, StyleSheet, Platform, View, Text, TouchableHighlight} from "react-native";
import {connect} from "react-redux";
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import PromotionList from "../components/PromotionList"
import Colors from "../res/colors/index";
import {Icon} from "react-native-elements";
import {centerAll} from "../res/styles/index";
import * as res from "../../app/res/index";

console.log(res);

class Promotions extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: 'gray',
    navigationBarColor: 'gray'
  };

  static categories = [
    {name: "food", color: 'red', icon: 'food'},
    {name: "coffee", color: 'fuchsia', icon: 'coffee'},
    {name: "pub", color: 'blue', icon: 'beer'},
  ];

  constructor(props) {
    super(props);
    this.renderTabContent = this.renderTabContent.bind(this);
  }

  renderTabContent(category, index) {
    const name = res.I18n.t(category.name);
    return (
      <PromotionList
        key={index}
        navigator={this.props.navigator}
        query={{id: index}}
        tabLabel={name}
      />
    )
  }

  renderTab(name, page, isTabActive, onPressHandler) {
    const {icon, color} = Promotions.categories[page];
    const tabColor = isTabActive ? color : 'gray';
    return (
      <TouchableHighlight
        underlayColor='rgba(0, 0, 0, 0.09)'
        onPress={() => {onPressHandler(page)}}>
      <View
        key={page}
        style={{flex: 1, flexDirection: 'row', ...centerAll, padding: 8}}>
        <Icon
          containerStyle={{marginRight: 8}}
          color={tabColor}
          name={icon}
          type='material-community'/>
        <Text style={{color: tabColor}}>{name}</Text>
      </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <ScrollableTabView
        style={{paddingTop: Platform.OS === 'ios' ? 16 : 0}}
        renderTabBar={() => <ScrollableTabBar renderTab={this.renderTab}/>}
        tabBarActiveTextColor={Colors.primary}
        tabBarUnderlineStyle={{backgroundColor: Colors.primary}}>
        {Promotions.categories.map(this.renderTabContent)}
      </ScrollableTabView>
    )
  }
}

const styles = StyleSheet.create({});

const mapDispatchToProps = (dispatch) => ({dispatch});

const mapStateToProps = (state) => {
  const {places} = state;
  return {places};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Promotions);
