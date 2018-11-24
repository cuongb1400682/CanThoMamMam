import React, {Component} from "react";
import PropTypes from "prop-types";
import PromotionList from "../components/PromotionList";
import connect from "react-redux/es/connect/connect";
import {logOut} from "../Account/actions";
import {database} from "../utils/FirebaseUtils";

class AllSubscriptions extends Component {
    static propTypes = {
        currentUser: PropTypes.any,
    };

    static defaultProps = {
        currentUser: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            subscriptions: []
        };
    }

    componentDidMount() {
        const {currentUser} = this.props;

        if (currentUser.id) {
            this.currentUserInfo = database.ref(`/users/${currentUser.id}/subscriptions`);

            this.currentUserInfo.on("value", snap => {
                this.setState({
                    subscriptions: Object.keys(snap.val() || {})
                });
            });
        }
    }

    componentWillUnmount() {
        if (this.currentUserInfo) {
            this.currentUserInfo.off();
        }
    }

    render() {
        const {subscriptions = []} = this.state;

        console.log("SUB: subscriptions", subscriptions)

        return (
            <PromotionList
                showsCreatorAvatar
                query={{userIds: subscriptions}}
                navigator={this.props.navigator}
            />
        );
    }
}

const mapStateToProps = (state) => {
    const {user: {currentUser}, places, usersInfo} = state;
    return {
        currentUser,
        places,
        currentUserInfo: (usersInfo && usersInfo.items) ? usersInfo.items[currentUser.id] : {},
    };
};

export default connect(
    mapStateToProps,
    {logOut}
)(AllSubscriptions);
