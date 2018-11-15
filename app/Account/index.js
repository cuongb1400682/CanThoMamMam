/**
 * Created by charlie on 3/1/17.
 */
import React, {Component} from "react";
import AccountDetails from './AccountDetails/index'
import * as LoginActions from "../../app/Account/actions";
import {connect} from "react-redux";
import {showMessage} from "../utils/ErrorHandlers";
import Login from "./Login";
import {tr} from "../res/index"
import PropTypes from "prop-types";

class Account extends Component {
  static LOGIN_METHOD_FACEBOOK = "LOGIN_METHOD_FACEBOOK";

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
        }
        break;
    }
  }

  render() {
    const {
      currentUser,
      isLoginWaiting,
      loginErrorMessage,
    } = this.props;

    if (loginErrorMessage) {
      showMessage(tr('account_login_error'));
      console.log("Account.render: loginErrorMessage = ", JSON.stringify(loginErrorMessage));
    }

    return (
      currentUser
        ? <AccountDetails navigator={this.props.navigator}/>
        : <Login onLogin={this.onLoginButtonPress} isWaiting={isLoginWaiting}/>
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
  const {user: {currentUser, loading, error}} = state;

  return {
    currentUser,
    isLoginWaiting: loading,
    loginErrorMessage: error,
  };
};

export default connect(
  mapStateToProps
)(Account);
