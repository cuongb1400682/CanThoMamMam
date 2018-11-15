import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {FormLabel} from "react-native-elements";
import PropTypes from "prop-types";

export default class CategoriesList extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    categoryColors: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.number,
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    error: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: props.value ? props.value : 0,
    };
  }

  render() {
    const {
      categories,
      categoryColors,
      title,
      onPress,
      error,
    } = this.props;

    let {
      selectedIndex,
    } = this.state;

    return (
      <View>
        <FormLabel>{title.toUpperCase()}</FormLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.setState({selectedIndex: index});
                onPress && onPress(category, index);
              }}
            >
              <View style={[
                styles.textViewBased,
                {backgroundColor: selectedIndex === index ? categoryColors[index % categoryColors.length] : 'whitesmoke'}
              ]}>
                <Text
                  style={
                    selectedIndex === index
                      ? styles.textView
                      : styles.unselectedTextView
                  }
                >
                  {category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    marginBottom: 1,
  },
  textViewBased: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  textView: {
    color: "white",
  },
  unselectedTextView: {
    color: "gray",
  },
  errorText: {
    fontSize: 12,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    color: "red",
  },
});
