import React, {Component} from "react";
import {StyleSheet} from "react-native";
import MapView from "react-native-maps";

class PlaceMapView extends Component {
    render() {
        return (
            <MapView style={styles.mapView}/>
        );
    }
}

const styles = StyleSheet.create({
    mapView: {
        flex: 1
    }
});

export default PlaceMapView;
