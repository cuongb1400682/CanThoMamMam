import React, {Component} from 'react';
import ImageViewerComponent from 'react-native-image-zoom-viewer';
import PropTypes from "prop-types";

export default class ImageViewer extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    index: PropTypes.number,
  };

  static navigatorStyle = {
    navBarTranslucent: true,
    navBarTransparent: true,
    navBarButtonColor: "#ffffff",
    drawUnderNavBar: true,
    tabBarHidden: true,
    statusBarBlur: true,
    statusBarTextColorScheme: 'light',
    statusBarColor: "black",
    navigationBarColor: 'gray'
  };

  render() {
    let index = 0;
    if (typeof(this.props.index) === 'number') {
      index = this.props.index;
    }

    return (
      <ImageViewerComponent
        imageUrls={this.props.images}
        index={index}
      />
    );
  }
}


