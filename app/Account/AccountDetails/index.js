/**
 * Created by letqt on 9/8/17.
 */
import React, {Component} from "react";
import {Image, View, Dimensions} from "react-native";

import {connect} from "react-redux";
import Header from './Header/index'
import InfoRow from '../../../app/PlaceDetails/InfoRow/index'
import * as res from "../../../app/res/index";
import {Button, Divider, SocialIcon} from "react-native-elements";
import {logOut} from "../../../app/Account/actions";

class AccountDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {currentUser} = this.props;

    return (
      <View style={styles.container}>
        <Header
          style={{marginBottom: 16, marginTop: 16}}
          following={1234}
          avatar={currentUser.avatar}
          name={currentUser.fullName}/>

        <Divider style={{marginBottom: 16}}/>

        <InfoRow
          icon="place"
          title={res.I18n.t('my_created_places')}
          onPress={() => this.props.navigator.push({screen: "MyAddedPlaces",title: "My Places"})}
          content={1234}/>
        <InfoRow
          icon="free-breakfast"
          title={res.I18n.t('my_coffee')}
          onPress={() => alert(res.I18n.t('my_coffee'))}
          content={1234}/>
        <InfoRow
          icon="local-drink"
          title={res.I18n.t('my_beers')}
          onPress={() => alert(res.I18n.t('my_beers'))}
          content={1234}/>

        <InfoRow
          icon="room-service"
          title={res.I18n.t('my_foods')}
          onPress={() => alert(res.I18n.t('my_foods'))}
          content={1234}/>

        <View style={{flex: 1}}/>

        <Button
          style={{backgroundColor: 'gray'}}
          title={res.I18n.t('log_out')}
          onPress={this.props.logOut}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
};

const mapStateToProps = (state) => {
  const {user: {currentUser}} = state;
  return {
    currentUser
  };
};

export default connect(
  mapStateToProps,
  {logOut}
)(AccountDetails);
