/**
 * Created by charlie on 3/1/17.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";

import {connect} from "react-redux";
import AccountDetails from './AccountDetails/index'
import Login from './Login/index'
import {logIn} from "../../app/Account/actions";

class Account extends Component {
    static LOGIN_METHOD_FACEBOOK = "LOGIN_METHOD_FACEBOOK";
    static LOGIN_METHOD_ANONYMOUS = "LOGIN_METHOD_ANONYMOUS";

    static propTypes = {
        onUserLoggedIn: PropTypes.func,
        logIn: PropTypes.func,
    };

    static defaultProps = {
        onUserLoggedIn: () => {
        },
        logIn: () => {
        },
    };

    render() {
        const {currentUser} = this.props;

        if (!currentUser) {
            return (
                <Login onLogin={this.props.logIn}/>
            )
        }

        return (
            <AccountDetails navigator={this.props.navigator}/>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "white",
    },
};

const mapDispatchToProps = () => ({});

const mapStateToProps = (state) => {
    const {user: {currentUser}} = state;
    return {
        currentUser
    };
};

export default connect(mapStateToProps, {
    logIn
})(Account);
