import {getThumbUrl} from "../../../utils/ImgurUtils";
import {Icon} from "react-native-elements";
import Colors from "../../../res/colors/index";
import PropTypes from "prop-types";

const React = require('react');
const {ViewPropTypes} = ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} = ReactNative;
import createReactClass from "create-react-class";

export const IMAGE_SIZE = 64;
const WINDOW_WIDTH = Dimensions.get('window').width;

export default createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
    showDeleteItemButton: PropTypes.boolean,
    showAddNewItemButton: PropTypes.boolean,
    showLoadingIndicator: PropTypes.number,
    onDeleteItemButtonClick: PropTypes.func,
    onAddNewItemButtonClick: PropTypes.func,
  },

  defaultProps: {
    activeTextColor: 'navy',
    inactiveTextColor: 'black',
    backgroundColor: null,
  },

  renderTabOption(name, page) {
  },

  selectTab(page) {
    const _currentScrollOffsetX = this._currentScrollOffsetX ? this._currentScrollOffsetX : 0;
    const selectedViewOffsetX = page * IMAGE_SIZE; // relative to scrollView
    const inScreenOffsetX = selectedViewOffsetX - _currentScrollOffsetX;
    const averageWidth = (WINDOW_WIDTH - IMAGE_SIZE) / 2;
    if (inScreenOffsetX < 0 || inScreenOffsetX + IMAGE_SIZE > WINDOW_WIDTH) {
      if (this.scrollView) {
        this.scrollView.scrollTo({x: selectedViewOffsetX - averageWidth, y: 0, animated: true});
      }
    }
  },

  renderTabPage(name) {
    if (name.waiting) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="small" color={Colors.primary}/>
        </View>
      );
    } else if (name.error) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Icon name={"warning"} color={"yellow"}/>
        </View>
      );
    } else {
      return (
        <Image
          style={styles.imagesContent}
          source={{uri: getThumbUrl(name)}}
        />
      );
    }
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const {
      showDeleteItemButton,
      onDeleteItemButtonClick,
    } = this.props;

    return (
      <TouchableOpacity
        key={page}
        style={isTabActive ? styles.selectedTabs : {}}
        onPress={() => onPressHandler(page)}
      >
        <View style={{width: IMAGE_SIZE, height: IMAGE_SIZE, opacity: isTabActive ? 1 : 0.4}}>
          {this.renderTabPage(name)}
        </View>
        {(showDeleteItemButton && !name.waiting) && <TouchableOpacity
          onPress={() => onDeleteItemButtonClick(page)}
          style={styles.deleteButton}>
          <Icon
            style={{opacity: 1, flex: 1}}
            size={20}
            name="delete-forever"
            color="red"
          />
        </TouchableOpacity>}
      </TouchableOpacity>
    );
  },

  render() {
    const {
      showAddNewItemButton,
      onAddNewItemButtonClick,
    } = this.props;

    return (
      <View style={{height: IMAGE_SIZE}}>
        <ScrollView
          ref={ref => this.scrollView = ref}
          horizontal
          style={styles.flexOne}
          onScroll={event => this._currentScrollOffsetX = event.nativeEvent.contentOffset.x}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page;
            const renderTab = this.props.renderTab || this.renderTab;
            return renderTab(name, page, isTabActive, this.props.goToPage);
          })}
          {showAddNewItemButton &&
          <TouchableOpacity
            style={styles.surplusItem}
            onPress={onAddNewItemButtonClick}
          >
            <View style={styles.iconContainer}>
              <Icon
                name="add-a-photo"
                color={Colors.primary}
                size={32}
              />
            </View>
          </TouchableOpacity>}
        </ScrollView>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  flexOne: {
    flex: 1,
    backgroundColor: "black",
  },
  tabs: {
    height: IMAGE_SIZE,
  },
  selectedTabs: {
    height: IMAGE_SIZE - 2,
    borderWidth: 2,
    borderColor: "black",
    opacity: 1,
  },
  imagesContent: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  deleteButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: IMAGE_SIZE - 20,
    top: IMAGE_SIZE - 22,
    position: 'absolute',
    borderTopLeftRadius: 3,
  },
  surplusItem: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});

