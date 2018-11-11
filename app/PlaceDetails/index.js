import React, {Component} from "react";
import {ScrollView, StyleSheet, Subtitle, Text, View} from "react-native";
import {Card} from "react-native-elements";
import PropTypes from "prop-types";

import InfoRow from './InfoRow/index';
import {convertToCapitalizedText, isEmpty} from "../utils/StringUtils";
import ImagesGallery from "../components/ImagesGallery/index";

export default class PlaceDetails extends Component {
    static propTypes = {
        place: PropTypes.object,
    };

    static navigatorStyle = {
        navBarHideOnScroll: true,
        navBarTranslucent: true,
        navBarTransparent: true,
        navBarButtonColor: "#ffffff",
        drawUnderNavBar: true,
        tabBarHidden: true,
        statusBarBlur: true,
        statusBarTextColorScheme: 'light',
        statusBarColor: "black",
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {place} = this.props;
        return (
            <ScrollView style={{backgroundColor: 'white'}}>
                <ImagesGallery
                    images={place.images}
                    placeAddress={place.address.displayName}
                    placeName={place.name}
                    navigator={this.props.navigator}
                />
                <View style={{backgroundColor: 'whitesmoke', height: 8}}/>
                <Card title={'Description'}
                      containerStyle={{padding: 8, margin: 0}}>
                    <Text>{place.description}</Text>
                </Card>
                <View style={{backgroundColor: 'whitesmoke', height: 8}}/>
                <InfoRow
                    icon={'directions'}
                    title="Show On Map"
                    onPress={() => null}
                />
                {this.renderExtTextInformation("phone")}
                {this.renderExtTextInformation("email")}
                {this.renderExtTextInformation("website")}
            </ScrollView>
        );
    }


    // this function renders item in place.ext
    renderExtTextInformation(item) {
        const {
            ext: placeExt
        } = this.props.place;

        // map the item to its corresponding icon
        const icons = {
            "website": "web",
            "phone": "phone",
            "email": "mail",
        };

        // return null if item doesn't exist
        if (!placeExt || !placeExt[item] || isEmpty(placeExt[item])) {
            return null;
        }

        return (
            <InfoRow
                icon={icons[item]}
                title={convertToCapitalizedText(item)}
                content={placeExt[item]}
            />
        );
    }
}

const styles = StyleSheet.create({});
