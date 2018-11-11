import React, {Component} from "react";
import {Image, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View,} from "react-native";
import * as Progress from "react-native-progress";
import PropTypes from "prop-types";

import * as res from "../../res/index";

export default class MessageModal extends Component {
    static ICON_COMPLETED = 'ICON_COMPLETED';
    static ICON_FAILED = 'ICON_FAILED';
    static ICON_WAITING = 'ICON_WAITING';
    static ICON_INFORMED = 'ICON_INFORMED';
    static ICON_NOTHING = 'ICON_NOTHING';
    static ICON_PROGRESS = 'ICON_PROGRESS';

    static propTypes = {
        onRequestClose: PropTypes.func.isRequired,
    };

    state = {
        status: MessageModal.ICON_WAITING,
        displayText: "",
        buttons: null,
        progress: -1,
        visible: false,
    };

    showInfo(status, message, buttons = null, progress = -1) {
        this.setState({
            status,
            displayText: message,
            buttons,
            progress,
            visible: true,
        });
    }

    hide() {
        this.setState({visible: false});
    }

    render() {
        const {
            onRequestClose,
        } = this.props;
        const {
            status,
            displayText,
            buttons,
            progress,
            visible,
        } = this.state;

        const modalInfoIcon = this.renderIcon(status, progress);

        return (
            <Modal
                onRequestClose={onRequestClose}
                animationType="fade"
                transparent={true}
                visible={visible}>
                <TouchableOpacity
                    focusedOpacity={1}
                    activeOpacity={1}
                    style={styles.modalInfoOuterContent}>
                    <View style={{flexDirection: "column", backgroundColor: "white"}}>
                        <View style={styles.modalInfoInnerContent}>
                            <View style={{flex: 0.3, alignItems: "center"}}>
                                {modalInfoIcon}
                            </View>
                            <View style={{width: 12}}/>
                            <ScrollView style={{flex: 0.7}}>
                                <Text style={{fontSize: 16}}>{displayText}</Text>
                            </ScrollView>
                        </View>
                        <View style={styles.modalHeaderSep}/>
                        <View style={{flexDirection: "row-reverse"}}>
                            {
                                buttons && buttons.map((button, i) =>
                                    <TouchableHighlight key={i}
                                                        style={styles.modalInfoButton}
                                                        onPress={button.onPress}
                                                        underlayColor="#CDC9CD">
                                        <Text style={{fontSize: 16, color: "#33b5e4"}}>{button.text}</Text>
                                    </TouchableHighlight>
                                )
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    renderIcon(status, progress) {
        let displayIcon = null;
        if (status === MessageModal.ICON_COMPLETED) {
            displayIcon = <Image style={styles.displayIcon}
                                 source={res.images.completed}/>;
        } else if (status === MessageModal.ICON_FAILED) {
            displayIcon = <Image style={styles.displayIcon}
                                 source={res.images.failed}/>;
        } else if (status === MessageModal.ICON_INFORMED) {
            displayIcon = <Image style={styles.displayIcon}
                                 source={res.images.aborted}/>;
        } else if (status === MessageModal.ICON_WAITING) {
            displayIcon = <Progress.Pie style={styles.displayIcon}
                                        size={styles.displayIcon.height}
                                        indeterminate={true}
                                        borderWidth={3}/>;
        } else if (status === MessageModal.ICON_PROGRESS) {
            displayIcon = <Progress.Pie progress={progress < 0 ? 1 : progress}
                                        size={styles.displayIcon.height}/>
        }
        return displayIcon;
    }

}

const styles = StyleSheet.create({
    modalInfoInnerContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        backgroundColor: "white",
        height: 100,
        width: 300,
        padding: 12,
    },
    modalInfoButton: {
        alignSelf: "flex-end",
        marginRight: 8,
        marginBottom: 8,
        marginTop: 8,
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    modalInfoOuterContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalHeaderSep: {
        backgroundColor: "#33b5e4",
        height: 2,
        alignSelf: "stretch",
    },
    displayIcon: {
        height: 52,
        width: 52,
    },
});
