import {StyleSheet, View, NativeText} from 'react-native';
import React from 'react';
import {Avatar, Text} from "react-native-elements";
import {connect} from "react-redux";
import {database} from "../../utils/FirebaseUtils";
import {loadUserInfo, updateUsersInfo} from "./actions";
import PropTypes from 'prop-types';

class UserAvatar extends React.Component {
  static propTypes = {
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    xlarge: PropTypes.bool,
    text: PropTypes.string,
    textStyle: PropTypes.any,
    subTextStyle: PropTypes.any,
    subText: PropTypes.string,
    showText: PropTypes.bool,
    userId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.usersRef = database.ref("users");
    const {userId, usersInfo} = this.props;
    if (!usersInfo || !usersInfo[userId]) {
      this.props.dispatch(loadUserInfo(this.usersRef, null));
    }

    this.usersRef.on('value', snapshot => {
      try {
        this.props.dispatch(updateUsersInfo(snapshot.val()));
      } catch (e) {
        console.log("UserAvatar.componentDidMount/on('value'): e = ", e);
      }
    });

  }

  componentWillUnmount() {
    if (this.usersRef) {
      try {
        this.usersRef.off();
      } catch (e) {
        console.log("UserAvatar.componentWillUnmount: ", e);
      }
    }
  }

  render() {
    const {userId, usersInfo, small, medium, large, xlarge, text, textStyle, subTextStyle, subText, showText} = this.props;
    const userFullName = (usersInfo && usersInfo[userId]) ? usersInfo[userId].fullName : "User name";
    const userImageSrc = (usersInfo && usersInfo[userId]) ? {uri: usersInfo[userId].avatar} : null;

    return (
      <View style={styles.container}>
        <Avatar
          containerStyle={{marginRight: 10}}
          rounded
          small={small}
          medium={medium}
          large={large}
          xlarge={xlarge}
          source={userImageSrc}
          onPress={() => {
          }}
        />

        {showText && <View style={{justifyContent: 'center'}}>
          {textStyle
            ? <Text style={textStyle}>{text ? text : userFullName}</Text>
            : <Text h4>{userFullName}</Text>}
          {subText && <Text style={subTextStyle}>{subText}</Text>}
        </View>}
      </View>
    );
  }
}

UserAvatar.defaultProps = {
  small: false,
  medium: false,
  large: true,
  xlarge: false,
  showText: true,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

const mapStateToProps = (state) => {
  return {
    usersInfo: state.usersInfo.items
  };
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAvatar);
