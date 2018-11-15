import React, {Component} from "react";
import PropTypes from "prop-types";
import Colors from "../../../../res/colors";
import UserAvatar from "../../../../components/UserAvatar/index";
import {Button, View, Text} from "react-native";
import {timestamp2Date} from "../../../../utils/DateTimeUtils";
import InputBox from "../../../../MoreDetails/components/InputBox/index";
import Touchable from "../../../../Views/Touchable";
import {tr} from "../../../../res";

export default class CommentListItem extends Component {
  static propTypes = {
    isEditable: PropTypes.bool,
    comment: PropTypes.any.isRequired,
    creatorInfo: PropTypes.any.isRequired,
    onShowCommentContextMenu: PropTypes.func,
    onSaveButtonClicked: PropTypes.func,
    onCancelButtonClicked: PropTypes.func,
  };

  static defaultProps = {
    isEditable: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      newCommentContent: this.props.comment.content,
    };
    this.renderEditableComment = this.renderEditableComment.bind(this);
    this.renderComment = this.renderComment.bind(this);
  }

  renderEditableComment() {
    const {
      id,
      comment,
      onSaveButtonClicked,
      onCancelButtonClicked,
    } = this.props;

    const {
      newCommentContent,
    } = this.state;

    return (
      <View style={{flexDirection: "column", flex: 1}}>
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          <InputBox
            formInputStyle={{marginRight: 0, marginLeft: 0, marginTop: 0}}
            style={{flex: 1}}
            noPadding={true}
            multiline={true}
            value={newCommentContent}
            hint={tr('comment_input_box_hint')}
            onChangeText={newCommentContent => this.setState({newCommentContent})}
            editable={true}
          />
        </View>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingTop: 4,}}>
          <Button
            color={Colors.primary}
            title={tr('comment_list_item_save_button')}
            onPress={() => onSaveButtonClicked && onSaveButtonClicked(id, comment, newCommentContent)}/>
          <View style={{width: 4}}/>
          <Button
            color={Colors.primary}
            title={tr('comment_list_item_cancel_button')}
            onPress={() => {
              this.setState({newCommentContent: comment.content});
              onCancelButtonClicked && onCancelButtonClicked(id, comment);
            }}/>
        </View>
      </View>
    );
  }

  renderComment() {
    const {comment, creatorInfo} = this.props;

    return (
      <View style={{flexDirection: "column", flex: 1}}>
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          <Text style={{flex: 1, color: "black"}}>{comment.content}</Text>
        </View>
        <View style={{flexDirection: "row", alignItems: "center", paddingTop: 4,}}>
          <Text style={{fontSize: 10, fontStyle: "italic"}}>{creatorInfo.fullName}</Text>
          <View style={{width: 4, height: 4, borderRadius: 4, marginHorizontal: 4, backgroundColor: "gray"}}/>
          <Text style={{fontSize: 10, fontStyle: "italic"}}>{timestamp2Date(comment.created_timestamp)}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {
      isEditable,
      comment,
      onShowCommentContextMenu,
      id,
    } = this.props;

    return (
      <Touchable onLongPress={() => onShowCommentContextMenu && onShowCommentContextMenu(id, comment)}>
        <View style={{flexDirection: "row", paddingVertical: 8, paddingHorizontal: 12, alignItems: 'flex-start'}}>
          <UserAvatar
            userId={comment.creatorId}
            showText={false}
            small
          />
          {isEditable
            ? this.renderEditableComment()
            : this.renderComment()}
        </View>
      </Touchable>
    );
  }

}