import {StyleSheet, View, Platform} from 'react-native';
import React, {Component} from 'react';
import {connect} from "react-redux";
import ActionButton from "react-native-action-button";
import PropTypes from "prop-types";

import {SearchBar, Tile} from "react-native-elements";
import PromotionList from "../components/PromotionList";
import Colors from "../res/colors/index";
import codePush from "react-native-code-push";
import {tr} from "../res";

class PlacesList extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: "black",
    navigationBarColor: 'gray'
  };

  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.navigateToAddPromotion = this.navigateToAddPromotion.bind(this);
    this.searchTimer = null;
    this.state = {
      query: {keyword: ''}
    }
  }

  navigateToAddPromotion() {
    this.props.navigator.showModal({
      screen: "MoreDetails",
      title: tr("places_list_navigate_to_add_place_title"),
      passProps: {images: []},
    });
  }

  onChangeText(keyword) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.search(keyword), this.searchTimer ? 500 : 0);
  }

  search(keyword) {
    keyword=keyword.toLowerCase();
    this.setState({query: {keyword}})
  }

  componentDidMount() {
    codePush.sync({
      updateDialog: false,
      installMode: codePush.InstallMode.IMMEDIATE
    });
  }

  render() {
    const {query} = this.state;
    const {currentUser} = this.props;

    return (
      <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 16 : 0}}>
        <SearchBar
          lightTheme
          containerStyle={{backgroundColor: 'white', borderTopWidth: 0}}
          inputStyle={{backgroundColor: 'white', borderWidth: 1, borderColor: '#e1e8ee'}}
          onChangeText={this.onChangeText}
          placeholder={tr('places_list_search_bar_place_holder')}
          textInputRef={'textInputRef'}
          clearIcon
        />
        <PromotionList
          query={{...query, ...{id: -1}}}
          navigator={this.props.navigator}
        />
        {
          !!currentUser &&
          <ActionButton
            buttonColor={Colors.primary}
            onPress={this.navigateToAddPromotion}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapDispatchToProps = (dispatch) => ({dispatch});

const mapStateToProps = (state) => {
  const {places, user: {currentUser}} = state;
  return {places, currentUser};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacesList);
