import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import InfoRow from '../../PlaceDetails/components/InfoRow/index';
import {Alert, Animated, FlatList, StyleSheet, View} from "react-native";
import CommentInputBox from "./components/CommentInputBox/index";
import {changeCommentContent, database, deleteComment} from "../../utils/FirebaseUtils";
import {addNewComment, loadAllComments, updateComments} from "./actions";
import {showMessage} from "../../utils/ErrorHandlers";
import Colors from "../../res/colors";
import {Icon} from "react-native-elements";
import {isEmpty} from "../../utils/StringUtils";
import CommentListItem from "./components/CommentListItem";
import {tr} from "../../res";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Comments extends Component {
  static propTypes = {
    isCollapsed: PropTypes.bool,
    onHeightChange: PropTypes.func,
    placeId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      animationHeight: new Animated.Value(0),
      isCommentEditable: true,
      edittedItemIndex: -1,
      newlyEnteredComment: "",
    };
    this.minHeight = 0;
    //this.maxHeight = Dimensions.get('window').height / 2;
    this.state.animationHeight.addListener(this.props.onHeightChange);
  }

  commentsRefValueChanges(snapshot) {
    this.props.dispatch(updateComments(this.props.placeId, snapshot.val()));
  }

  componentDidMount() {
    this.commentsRef = database.ref(`/comments/${this.props.placeId}`);
    this.commentsRef.on('value', this.commentsRefValueChanges.bind(this));
  }

  componentWillUnmount() {
    if (this.commentsRef) {
      try {
        this.commentsRef.off();
      } catch (e) {
        console.log("Component.componentWillUnmount: ", e);
      }
    }
  }

  expandComments() {
    const initialValue = this.state.isExpanded
      ? this.maxHeight + this.minHeight
      : this.minHeight;
    const finalValue = this.state.isExpanded
      ? this.minHeight
      : this.maxHeight + this.minHeight;
    this.setState({isExpanded: !this.state.isExpanded});

    this.state.animationHeight.setValue(initialValue);
    Animated.timing(
      this.state.animationHeight,
      {
        toValue: finalValue,
        duration: 300
      }
    ).start();

    if (!this.state.isExpanded) {
      this.props.dispatch(loadAllComments(this.commentsRef, this.props.placeId));
    }
  }

  async sendData() {
    const text = this.state.newlyEnteredComment;
    const {
      placeId,
      currentUser,
    } = this.props;

    if (isEmpty(text)) {
      return;
    }

    try {
      this.setState({isCommentEditable: false});
      await this.props.dispatch(addNewComment(placeId, currentUser.id, text, this.commentsRef));
      this.setState({newlyEnteredComment: ""});
    } catch (e) {
      console.log('in Comments.sendData: ', e);
    } finally {
      this.setState({isCommentEditable: true});
    }
  }

  showCommentContextMenu(index, comment) {
    const {
      currentUser
    } = this.props;

    if (!currentUser || currentUser.id !== comment.creatorId) {
      return;
    }

    Alert.alert(
      tr('comment_context_menu_title'),
      tr('comment_context_menu_question'),
      [
        {
          text: tr('comment_context_menu_button_delete'), onPress: async () => {
            try {
              await deleteComment(this.commentsRef, comment.id);
            } catch (e) {
              1
              showMessage(e.message);
            }
          }
        },
        {text: tr('comment_context_menu_button_edit'), onPress: () => this.setState({edittedItemIndex: index})},
      ]
    );
  }

  cancelEdittingComment() {
    this.setState({edittedItemIndex: -1});
  }

  async saveNewComment(index, comment, newContent) {
    try {
      this.setState({isCommentEditable: false});
      await changeCommentContent(this.props.placeId, comment.id, newContent);
    } catch (e) {
      showMessage(e.message);
    } finally {
      this.setState({isCommentEditable: true});
      this.cancelEdittingComment();
    }
  }

  render() {
    const {
      comments,
      placeId,
      currentUser,
    } = this.props;

    const {edittedItemIndex} = this.state;

    if (comments.error) {
      showMessage(comments.message);
    }

    return (
      <View
        style={{alignSelf: 'stretch', flexDirection: "column", flex: 1}}
      >
        {(!this.state.isExpanded || !currentUser)
          ? <InfoRow
            icon={"comment"}
            title={tr('comment_component_default_title')}
            onPress={() => this.expandComments()}
          />
          : <View style={{flexDirection: 'row', paddingLeft: 16, marginVertical: 8, alignItems: "center"}}>
            <Icon
              name={"comment"}
              color={Colors.primary}/>
            <CommentInputBox
              onSend={this.sendData.bind(this)}
              onTextChange={text => this.setState({newlyEnteredComment: text})}
              value={this.state.newlyEnteredComment}
              enable={this.state.isCommentEditable}
              isWaiting={!this.state.isCommentEditable}
            />
          </View>}

        {this.state.isExpanded && <AnimatedFlatList
          style={{
            alignSelf: 'stretch',
            height: this.state.animationHeight,
          }}
          data={(placeId in comments.items) ? comments.items[placeId] : []}
          renderItem={({index, item}) =>
            <CommentListItem
              id={index}
              comment={item}
              creatorInfo={this.props.usersInfo[item.creatorId]}
              isEditable={edittedItemIndex === index}
              onShowCommentContextMenu={this.showCommentContextMenu.bind(this, index, item)}
              onSaveButtonClicked={this.saveNewComment.bind(this)}
              onCancelButtonClicked={this.cancelEdittingComment.bind(this)}
            />
          }
          scrollable={true}
          keyExtractor={item => item.id}
        />}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = (state) => {
  const {user: {currentUser}, comments} = state;
  return {
    currentUser,
    comments,
    usersInfo: state.usersInfo.items,
  };
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
