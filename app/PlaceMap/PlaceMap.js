import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import MapView, {Callout, Marker} from "react-native-maps";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";

class PlaceMap extends Component {
  static navigationOptions = () => ({
    title: "Các nơi gần đây"
  });

  static propsTypes = {
    places: PropTypes.any
  };

  static defaultProps = {
    places: []
  };

  showPlaceDetail = (place) => () => {
    this.props.navigator.push({
      screen: "PlaceDetails",
      passProps: {place},
    });
  };

  render() {
    const {places} = this.props;
    let allPlaces = [];

    if (places["-1"]) {
      allPlaces = places["-1"];
    }

    return (
      <MapView
        style={styles.mapView}
        showsCompass
        showsTraffic
        loadingEnabled
        showsUserLocation
        followsUserLocation
      >
        {allPlaces.map((place) => {
          const {id, address = "", name = ""} = place;

          return <Marker
            key={id}
            coordinate={address}
            pinColor="red"
          >
            <Callout onPress={this.showPlaceDetail(place)}>
              <View style={{flexWrap: "wrap"}}>
                <Text style={styles.placeTitle}>{name}</Text>
                <Text>{address.displayName}</Text>
              </View>
            </Callout>
          </Marker>
        })}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  mapView: {
    flex: 1
  },
  placeTitle: {
    fontWeight: "bold"
  },
  placeImage: {
    width: 30,
    height: 30
  }
});

const mapStateToProps = (state) => ({
  places: state.places.items
});

export default connect(mapStateToProps, {})(PlaceMap);
