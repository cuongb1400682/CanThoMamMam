import React, {Component} from "react";
import {Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View,} from "react-native";
import PropTypes from "prop-types";
import * as res from "../../res/index";

export default class PhotoSourcesModal extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    onPickImagesFromCamera: PropTypes.func.isRequired,
    onPickImagesFromSDCard: PropTypes.func.isRequired,
  };

  state = {
    visible: false,
  };

  hide() {
    this.setState({visible: false});
  }

  show() {
    this.setState({visible: true});
  }

  render() {
    const {
      onRequestClose,
      onPickImagesFromCamera,
      onPickImagesFromSDCard,
    } = this.props;
    const {
      visible
    } = this.state;
    return (
      <Modal
        onRequestClose={onRequestClose}
        visible={visible}
        animationType={"fade"}
        transparent={true}
        style={styles.photoSourcesModal}>
        <TouchableOpacity
          activeOpacity={1}
          focusedOpacity={1}
          style={styles.photoSourcesModalOuterContent}
          onPress={onRequestClose}>
          <View style={styles.photoSourcesModalInnerContent}>
            <View>
              <Text style={styles.modalHeaderText}>{res.I18n.t('selectImages')}</Text>
              <View style={styles.modalHeaderSep}/>
            </View>
            <View>
              <TouchableHighlight underlayColor="#c4daff"
                                  onPress={onPickImagesFromCamera}>
                <View>
                  <Text style={styles.modalListItemText}>{res.I18n.t('fromCamera')}</Text>
                  <View style={styles.modalListItemSep}/>
                </View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor="#c4daff"
                                  onPress={onPickImagesFromSDCard}>
                <View>
                  <Text style={styles.modalListItemText}>{res.I18n.t('fromSDCard')}</Text>
                  <View style={{marginTop: 12}}/>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalListItemText: {
    fontSize: 16,
    marginTop: 12,
    marginLeft: 16,
  },
  photoSourcesModalOuterContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: "center",
    alignItems: "center",
  },
  photoSourcesModalInnerContent: {
    width: 300,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 5
  },
  modalHeaderText: {
    fontSize: 16,
    color: "#33b5e4",
    paddingLeft: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  modalHeaderSep: {
    backgroundColor: "#33b5e4",
    height: 2,
    alignSelf: "stretch",
  },
  modalListItemSep: {
    backgroundColor: "#ded2e4",
    height: 1,
    marginTop: 12,
    alignSelf: "stretch",
  },
  photoSourcesModal: {
    width: 200,
    height: 140,
    borderRadius: 5,
    opacity: 0.7,
  },
});
