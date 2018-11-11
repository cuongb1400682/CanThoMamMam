/**
 * Created by charlie on 3/1/17.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";

import {connect} from "react-redux";
import AccountDetails from './AccountDetails/index'
import Login from './Login/index'
import * as LoginActions from "../../app/Account/actions";

class Account extends Component {
    static LOGIN_METHOD_FACEBOOK = "LOGIN_METHOD_FACEBOOK";
    static LOGIN_METHOD_ANONYMOUS = "LOGIN_METHOD_ANONYMOUS";

    static propTypes = {
        onUserLoggedIn: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.onLoginButtonPress = this.onLoginButtonPress.bind(this);
    }

    async onLoginButtonPress(loginMethodName) {
        switch (loginMethodName) {
            case Account.LOGIN_METHOD_FACEBOOK:
                try {
                    await this.props.dispatch(LoginActions.logIn());
                } catch (e) {
                    console.log('onLoginButtonPress', e);
                    alert(e.message);
                }
                break;
            case Account.LOGIN_METHOD_ANONYMOUS:
                break;
        }
    }

    render() {
        const {currentUser} = this.props;
        if (!currentUser) {
            return (
                <Login onLogin={this.onLoginButtonPress}/>
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

export default connect(
    mapStateToProps
)(Account);
