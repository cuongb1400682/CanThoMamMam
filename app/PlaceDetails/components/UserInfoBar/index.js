import React from "react";
import {firebase} from "../../../utils/FirebaseUtils";
import {connect} from "react-redux";
import {Subtitle, View} from "react-native";
import {likeForUserWithId, unlikeForUserWithId} from "../Voter/actions";
import Voter from "../Voter/index";
import {timestamp2Date} from "../../../utils/DateTimeUtils";
import PropTypes from "prop-types";
import UserAvatar from "../../../components/UserAvatar/index";
import {countLikeUnlikeNumber} from "../../../utils/StatisticsUtils";

class UserInfoBar extends React.Component {
  static propTypes = {
    creatorId: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    place: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      vote: countLikeUnlikeNumber(props.place.vote, props.currentUser),
    };
  }

  componentDidMount() {
    const {currentUser} = this.props;
    this.voteRef = firebase.database().ref(`promotions/${this.props.place.id}/vote`);
    this.voteRef.on('value', async snapshot => {
        const voters = snapshot.val();
        const vote = countLikeUnlikeNumber(voters, currentUser);
        this.setState({vote});
      }
    );
  }

  componentWillUnmount() {
    if (this.voteRef) {
      try {
        this.voteRef.off();
      } catch (e) {
        console.log("UserInfoBar.componentWillUnmount: ", e);
      }
    }
  }

  voteForThisPlace(isLikeButton) {
    const {place, currentUser} = this.props;
    const {vote} = this.state;
    if (isLikeButton) {
      this.props.dispatch(likeForUserWithId(place.id, currentUser.id, vote.isCurrentUserLikeThis));
    } else {
      this.props.dispatch(unlikeForUserWithId(place.id, currentUser.id, vote.isCurrentUserUnlikeThis));
    }
  }

  render() {
    const {creatorId, timestamp, currentUser} = this.props;
    const {vote} = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
        }}
      >
        <UserAvatar
          medium
          textStyle={{fontSize: 14, fontWeight: '300', color: "black"}}
          subTextStyle={{fontSize: 10}}
          userId={creatorId}
          subText={timestamp2Date(timestamp)}
        />
        <View style={{flex: 1}}/>
        {currentUser && <Voter
          isLikeButton={true}
          isSelected={vote.isCurrentUserLikeThis}
          count={vote.like}
          onPress={this.voteForThisPlace.bind(this, true)}
        />}
        {currentUser && <Voter
          isLikeButton={false}
          isSelected={vote.isCurrentUserUnlikeThis}
          count={vote.unlike}
          onPress={this.voteForThisPlace.bind(this, false)}
        />}
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  const {user: {currentUser}} = state;
  return {
    currentUser
  };
};

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfoBar);
