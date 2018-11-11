import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import PropTypes from "prop-types";

import Touchable from "../../../app/Views/Touchable";

export default class CategoriesBar extends Component {
    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.string).isRequired,
        onCategorySelected: PropTypes.func.isRequired,
    };

    state = {
        selectedItem: this.props.categories[0],
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            categories,
        } = this.props;
        return (
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {categories.map((item, index) => this.renderCategory(item, index))}
                </ScrollView>
            </View>
        );
    }

    renderCategory(item, index) {
        const {
            onCategorySelected,
        } = this.props;
        const {
            selectedItem,
        } = this.state;
        const borderStyle = (item === selectedItem ? styles.selectedItemBorder : styles.unselectedItemBorder);
        const textStyle = (item === selectedItem ? styles.selectedItemText : styles.unselectedItemText);
        return (
            <Touchable
                key={index}
                onPress={() => {
                    this.setState({selectedItem: item});
                    onCategorySelected(item);
                }}
            >
                <View style={[borderStyle, styles.borderStyle]}>
                    <Text style={textStyle}>{item}</Text>
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    borderStyle: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    selectedItemBorder: {
        flex: 1,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 3,
        borderBottomColor: "#ff4081",
        backgroundColor: "#ffebfa"
    },
    selectedItemText: {
        color: "#ff4081",
    },
    unselectedItemBorder: {
        flex: 1,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ececec",
        backgroundColor: "#fafafa"
    },
    unselectedItemText: {
        color: "#333030",
    },
    categoriesBarContainer: {
        backgroundColor: "#fafafa",
        flexDirection: "row",
    },
});
