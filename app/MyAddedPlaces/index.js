import React, {Component} from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
import PromotionList from "../components/PromotionList";
import {tr} from "../res";
import PropTypes from "prop-types";

class MyAddedPlaces extends Component {
  static navigatorStyle = {
    statusBarColor: 'black',
    navBarHideOnScroll: true,
    navigationBarColor: 'gray'
  };

  static propTypes = {
    props: PropTypes.any.isRequired,
    showOnlyPlaceDetails: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  navigateToMoreDetails(placeDetails) {
    this.props.navigator.showModal({
      screen: "MoreDetails",
      title: tr("my_added_places_edit_place_title"),
      passProps: {placeDetails},
    });
  }

  navigateToPlaceDetails(placeDetails) {
    this.props.navigator.showModal({
      screen: "PlaceDetails",
      passProps: {place: placeDetails},
      title: tr('my_added_places_place_details_title'),
    });
  }

  render() {
    const {
      currentUser,
      query,
      showOnlyPlaceDetails,
    } = this.props;

    if (currentUser) {
      return (
        <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 16 : 0}}>
          <PromotionList
            query={!query ? {userId: currentUser.id} : query}
            onPromotionPress={
              showOnlyPlaceDetails
                ? this.navigateToPlaceDetails.bind(this)
                : this.navigateToMoreDetails.bind(this)
            }
          />
        </View>
      );
    } else {
      return (
        <View style={styles.centerizedText}>
          <Text>{tr('my_added_places_not_log_in_message')}</Text>
          <Text>{tr('my_added_places_prompt_log_in')}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  centerizedText: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapDispatchToProps = (dispatch) => ({dispatch});

const mapStateToProps = (state) => {
  const {user: {currentUser}} = state;
  return {currentUser};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAddedPlaces);
