import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ImagesTabBar, {IMAGE_SIZE} from "./ImagesTabBar/index";
import Touchable from "../../Views/Touchable";
import Colors from "../../res/colors";
import {tr} from "../../res";
import PropTypes from "prop-types";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ImagesGallery extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    placeAddress: PropTypes.string,
    placeName: PropTypes.string,
    showDeleteItemButton: PropTypes.boolean,
    showAddNewItemButton: PropTypes.boolean,
    showLoadingIndicator: PropTypes.number,
    onDeleteItemButtonClick: PropTypes.func,
    onAddNewItemButtonClick: PropTypes.func,
    onImagePress: PropTypes.func,
    navigator: PropTypes.object.isRequired,
  };

  static defaultProps = {
    showDeleteItemButton: false,
    showAddNewItemButton: false,
    placeAddress: "",
    placeName: "",
    onDeleteItemButtonClick: () => void 0,
    onAddNewItemButtonClick: () => void 0,
  };

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderError(item) {
    return (
      <View tabLabel={{error: true}} style={styles.titleSize}>
        <Icon name={"warning"} size={64} color={"#ead000"} style={{margin: 16}}/>
        {item.error && <Text
          style={{textAlign: "center"}}>{typeof(item.error) === "string" ? item.error : JSON.stringify(item.error)}</Text>}
      </View>
    );
  }

  renderWaiting() {
    return (
      <View tabLabel={{waiting: true}} style={styles.titleSize}>
        <ActivityIndicator size="large" color={Colors.primary} style={{margin: 16}}/>
        <Text>{tr('images_gallery_waiting')}</Text>
      </View>
    );
  }

  renderItem(item, index) {
    const {
      images,
      placeAddress,
      placeName,
      navigator,
      onImagePress,
    } = this.props;

    if (item.error) {
      console.log(`ImagesGallery.renderItem(${JSON.stringify(item)}, ${index}): renderError`);
      return this.renderError(item);
    } else if (item.waiting) {
      console.log(`ImagesGallery.renderItem(${JSON.stringify(item)}, ${index}): renderWaiting`);
      return this.renderWaiting();
    }

    const screenWidth = Dimensions.get("window").width;
    const width = screenWidth;
    const height = screenWidth * 0.8;

    return (
      <TouchableOpacity
        tabLabel={item.url}
        style={{width, height}}
        activeOpacity={0.8}
        onPress={() => {
          console.log("ok");
          if (onImagePress) {
            onImagePress(images, index);
          } else if (navigator) {
            navigator.push({
              screen: "ImageViewer",
              passProps: {images, index},
            });
          }
        }}
      >
        <ImageBackground
          source={{uri: item.url}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            resizeMode: 'cover',
            backgroundColor: '#ffffff',
            width,
            height,
          }}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
            alignSelf: 'stretch',
            justifyContent: 'center',
            paddingLeft: 25,
            paddingRight: 25,
            paddingTop: 45,
            paddingBottom: 40,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "stretch",
              }}
            >
              <Text h4 style={{
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0)',
                marginBottom: 15,
                textAlign: 'center',
              }}>{placeName}</Text>
              <Text style={{
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0)',
                marginBottom: 15,
                textAlign: 'center',
              }}>{placeAddress}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      images,
      showDeleteItemButton,
      showAddNewItemButton,
      showLoadingIndicator,
      onDeleteItemButtonClick,
      onAddNewItemButtonClick,
    } = this.props;

    return (
      <View style={{height: SCREEN_WIDTH * 0.8 + IMAGE_SIZE}}>
        <ScrollableTabView
          renderTabBar={() =>
            <ImagesTabBar
              showAddNewItemButton={showAddNewItemButton}
              showDeleteItemButton={showDeleteItemButton}
              showLoadingIndicator={showLoadingIndicator}
              onAddNewItemButtonClick={onAddNewItemButtonClick}
              onDeleteItemButtonClick={onDeleteItemButtonClick}
              ref={ref => this.imagesTabBar = ref}
            />}
          onChangeTab={obj => this.imagesTabBar.selectTab(obj.i)}
          tabBarPosition="bottom"
        >
          {images.map(this.renderItem)}
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleSize: {
    height: SCREEN_WIDTH * 0.8,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center"
  },
});

