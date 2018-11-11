import React, {Component} from "react";
import {StyleSheet, Text, View, Platform} from "react-native";
import {connect} from "react-redux";
import {store} from "../../App";
import PromotionList from "../components/PromotionList";

class MyAddedPlaces extends Component {
  static navigatorStyle = {
    statusBarColor: 'black',
    navBarHideOnScroll: true,
    navigationBarColor: 'gray'
  };

  constructor(props) {
    super(props);
  }
  navigateToMoreDetails(placeDetails) {
    this.props.navigator.showModal({
      screen: "MoreDetails", // unique ID registered with Navigation.registerScreen
      title: "Edit details", // title of the screen as appears in the nav bar (optional)
      passProps: {placeDetails}, // simple serializable object that will pass as props to the modal (optional)
    });
  }

  render() {
    const {currentUser} = this.props;
    if (currentUser) {
      return (
        <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 16 : 0}}>
          <PromotionList
            query={{userId: currentUser.id}}
            onPromotionPress={this.navigateToMoreDetails.bind(this)}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.centerizedText}>
          <Text>{"You have not logged in"}</Text>
          <Text>{"Please log in before using this feature"}</Text>
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
