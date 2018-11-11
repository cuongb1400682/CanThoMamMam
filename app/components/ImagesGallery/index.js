import React, {Component} from 'react';
import {Dimensions, StyleSheet, View,} from 'react-native';
import {Tile} from 'react-native-elements';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PropTypes from "prop-types";

import ImagesTabBar, {IMAGE_SIZE} from "./ImagesTabBar/index";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ImagesGallery extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    placeAddress: PropTypes.string,
    placeName: PropTypes.string,
    showDeleteItemButton: PropTypes.boolean,
    onDeleteItemButtonClick: PropTypes.func,
    showAddNewItemButton: PropTypes.boolean,
    onAddNewItemButtonClick: PropTypes.func,
    navigator: PropTypes.object,
    onImagePress: PropTypes.func,
  };

  render() {
    const {
      images,
      placeAddress,
      placeName,
      showDeleteItemButton,
      onDeleteItemButtonClick,
      showAddNewItemButton,
      onAddNewItemButtonClick,
      navigator,
      onImagePress,
    } = this.props;

    return (
      <View style={{height: SCREEN_WIDTH * 0.8 + IMAGE_SIZE}}>
        <ScrollableTabView
          renderTabBar={() => <ImagesTabBar
            showAddNewItemButton={showAddNewItemButton}
            onAddNewItemButtonClick={onAddNewItemButtonClick}
            showDeleteItemButton={showDeleteItemButton}
            onDeleteItemButtonClick={onDeleteItemButtonClick}
            ref={ref => this.imagesTabBar = ref}
          />}
          onChangeTab={obj => this.imagesTabBar.selectTab(obj.i)}
          tabBarPosition="bottom"
        >
          {images.map((item, index) => <Tile
            tabLabel={item.url}
            key={index}
            imageSrc={{uri: item.url}}
            featured
            title={placeName}
            caption={placeAddress}
            activeOpacity={0.9}
            onPress={() => {
              if (onImagePress) {
                onImagePress(images, index);
              } else if (navigator) {
                navigator.push({
                  screen: "ImageViewer",
                  passProps: {images, index},
                });
              }
            }}
          />)}
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

