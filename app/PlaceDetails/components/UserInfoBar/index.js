import React from "react";
import {addSubscription, firebase, removeSubscription} from "../../../utils/FirebaseUtils";
import {connect} from "react-redux";
import {Text, View} from "react-native";
import {likeForUserWithId, unlikeForUserWithId} from "../Voter/actions";
import Voter from "../Voter/index";
import {timestamp2Date} from "../../../utils/DateTimeUtils";
import PropTypes from "prop-types";
import UserAvatar from "../../../components/UserAvatar/index";
import {countLikeUnlikeNumber} from "../../../utils/StatisticsUtils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Touchable from "../../../Views/Touchable";

class UserInfoBar extends React.Component {
    static propTypes = {
        creatorId: PropTypes.string.isRequired,
        timestamp: PropTypes.number.isRequired,
        place: PropTypes.any.isRequired,
        onSubscriptionPress: PropTypes.func
    };

    static defaultProps = {
        onSubscriptionPress: () => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            vote: countLikeUnlikeNumber(props.place.vote, props.currentUser),
            subscriptions: []
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

        this.subscriptionRef = firebase.database().ref(`/users/${currentUser.id}/subscriptions`);
        this.subscriptionRef.on("value", async snapshot => {
            const subscriptions = snapshot.val() || [];

            this.setState({
                subscriptions: Object.keys(subscriptions)
            });
        });
    }

    componentWillUnmount() {
        if (this.voteRef) {
            try {
                this.voteRef.off();
            } catch (e) {
                console.log("UserInfoBar.componentWillUnmount: ", e);
            }
        }

        if (this.subscriptionRef) {
            this.subscriptionRef.off();
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

    onSubscriptionPress = async () => {
        const {creatorId, currentUser} = this.props;
        const {subscriptions} = this.state;

        if (subscriptions.includes(creatorId)) {
            await removeSubscription(currentUser.id, creatorId);
        } else {
            await addSubscription(currentUser.id, creatorId);
        }
    };

    render() {
        const {creatorId, timestamp, currentUser} = this.props;
        const {vote, subscriptions} = this.state;
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
                <Touchable onPress={this.onSubscriptionPress}>
                    <View style={{
                        flexDirection: "column",
                        alignItems: "center",
                        width: 54,
                        height: 44
                    }}>
                        <MaterialCommunityIcons
                            name="bell-ring"
                            style={{
                                fontSize: 24,
                                color: subscriptions.includes(creatorId) ? "red" : "gray"
                            }}
                        />
                        <Text style={{
                            fontSize: 10
                        }}>Theo dõi</Text>
                    </View>
                </Touchable>
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
