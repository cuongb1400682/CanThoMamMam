import React, {Component} from "react";
import {Dimensions, Linking, Platform, ScrollView, StyleSheet, Subtitle, Text, View} from "react-native";
import MapView, {Callout, Marker, ProviderPropType} from 'react-native-maps';
import {convertToCapitalizedText, isEmpty} from "../utils/StringUtils";
import {Card} from "react-native-elements";
import ImagesGallery from "../components/ImagesGallery/index";
import {showMessage} from "../utils/ErrorHandlers";
import InfoRow from './components/InfoRow/index';
import Comments from "../components/Comments/index";
import UserInfoBar from "./components/UserInfoBar";
import {languageSelect, tr} from "../res";
import PropTypes from "prop-types";

const width = Dimensions.get('window').width;

const MAP_HEIGHT = 256;
const LATITUDE_DELTA = 0.0122;

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
      <ScrollView
        ref={ref => this.scrollView = ref}
        style={{backgroundColor: 'white'}}
      >
        <ImagesGallery
          images={place.images}
          placeAddress={place.address.displayName}
          placeName={place.name}
          navigator={this.props.navigator}
        />
        <View style={{backgroundColor: 'whitesmoke', height: 8}}/>
        <UserInfoBar
          creatorId={place ? place.user.id : null}
          timestamp={place.created_timestamp}
          place={place}
        />
        <Card containerStyle={{padding: 8, margin: 0}}>
          <Text style={{color: "black"}}>{place.description}</Text>
        </Card>
        <View style={{backgroundColor: 'whitesmoke', height: 8}}/>
        <View style={{flexDirection: "column"}}>
          {this.renderMap(place.address)}
          {this.renderExtTextInformation("phone")}
          {this.renderExtTextInformation("email")}
          {this.renderExtTextInformation("website")}
          <InfoRow
            icon={"warning"}
            title={tr('place_details_report_error_title')}
            content={tr('place_details_report_error_content')}
            onPress={this.reportWrongContent.bind(this, place)}>
          </InfoRow>
          <Comments
            onHeightChange={() => this.scrollView.scrollToEnd()}
            placeId={place.id}
          />
        </View>
      </ScrollView>
    );
  }

  reportWrongContent(place) {
    try {
      const uri = languageSelect({
        any: encodeURI(`mailto:canthomammam@gmail.com?` +
          `subject=[REPORT] Content problem with ${place.name} (id: ${place.id})&body=` +
          `Write your report content here!`),
        vi: encodeURI(`mailto:canthomammam@gmail.com?` +
          `subject=[BÁO CÁO] Có sai sót tại '${place.name}' (id: ${place.id})&body=` +
          `Hãy viết những sai sót bạn tìm thấy ở đây!`),
      });
      Linking.openURL(uri);
    } catch (e) {
      showMessage(e.message);
    }
  }

  renderMap(region) {
    const aspect_ratio = width / MAP_HEIGHT;
    return (
      <View style={styles.container}>
        <MapView
          provider={null}
          style={styles.map}
          initialRegion={{
            ...region,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LATITUDE_DELTA * aspect_ratio,
          }}
          showsCompass
          showsTraffic
          loadingEnabled
          showsUserLocation
          onLongPress={() => this.openMapApplication(region)}
        >
          <Marker coordinate={region}>
            <Callout>
              <View>
                <Text>{region.displayName}</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      </View>
    );
  }

  async openMapApplication(region) {
    const {latitude, longitude, displayName} = region;
    const url = Platform.select({
      android: `geo:${latitude},${longitude}?q=${displayName}`,
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${displayName}`,
    });

    try {
      await Linking.openURL(url);
    } catch (e) {
      showMessage(tr('place_details_unable_open_map_message'));
    }
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
        title={convertToCapitalizedText(tr(item))}
        content={placeExt[item]}
        onPress={async () => {
          try {
            if (item === "phone") {
              await Linking.openURL(`tel:${placeExt.phone}`);
            } else if (item === "email") {
              await Linking.openURL(`mailto:${placeExt.email}`);
            } else if (item === "website") {
              await Linking.openURL(placeExt.website);
            }
          } catch (e) {
            showMessage(languageSelect({
              any: `Cannot open ${item} (${placeExt[item]})`,
              vi: `Không truy cập ${tr(item)} (${placeExt[item]})`,
            }));
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: MAP_HEIGHT,
    alignSelf: 'stretch',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
