import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import MapView, {Callout, Marker} from "react-native-maps";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import {loadPromotions} from "../components/PromotionList/actions";
import {database} from "../utils/FirebaseUtils";

class PlaceMap extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Các nơi xung quanh"
    });

    static propsTypes = {
        places: PropTypes.any
    };

    static defaultProps = {
        places: []
    };

    componentDidMount() {
        this.promotionRef = database.ref("promotions");
    }

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

export default connect(mapStateToProps, {loadPromotions})(PlaceMap);
