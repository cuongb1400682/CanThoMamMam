/**
 * Created by letqt on 9/8/17.
 */
import React, {Component} from "react";
import {View} from "react-native";
import {connect} from "react-redux";
import Header from '../../components/UserAvatar/index'
import InfoRow from '../../PlaceDetails/components/InfoRow/index'
import * as res from "../../../app/res/index";
import {Button, Divider} from "react-native-elements";
import {logOut} from "../../../app/Account/actions";
import {countUserFavoritePlaces, getPlacesStatistic} from "../../utils/StatisticsUtils";
import {tr} from "../../res";

class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.showMyAddedPlaces = this.showMyAddedPlaces.bind(this);
    }

    showMyAddedPlaces(query, title, passProps = {}) {
        this.props.navigator.push({
            screen: "MyAddedPlaces",
            title,
            passProps: {query, ...passProps},
        });
    }

    render() {
        const {currentUser, places, currentUserInfo} = this.props;

        const statistics =
            getPlacesStatistic(places.items["-1"].filter(item => item.user.id === currentUser.id));

        return (
            <View style={styles.container}>
                <Header
                    style={{marginBottom: 16, marginTop: 16}}
                    userId={currentUser.id}
                />
                <Divider style={{marginBottom: 16}}/>
                <InfoRow
                    icon="place"
                    title={res.I18n.t('account_details_my_added_places')}
                    onPress={() => {
                        this.showMyAddedPlaces({userId: currentUser.id}, tr('account_details_navigate_to_my_added_places_title'))
                    }}
                    content={`Tổng cộng ${statistics.total} nơi`}/>
                <InfoRow
                    icon="favorite"
                    title={tr("account_details_my_favorite_places")}
                    content={`Có ${countUserFavoritePlaces(currentUserInfo)} nơi`}
                    onPress={() => {
                        let query = {};
                        if (!!currentUserInfo && !!currentUserInfo.likedPlaces) {
                            query = {which: currentUserInfo.likedPlaces};
                        }
                        this.showMyAddedPlaces(
                            query,
                            tr('account_details_my_favorite_places'),
                            {showOnlyPlaceDetails: true}
                        );
                    }}
                />
                <InfoRow
                    icon="free-breakfast"
                    title={tr('account_details_navigate_to_my_coffee')}
                    onPress={() => {
                        this.showMyAddedPlaces({
                            userId: currentUser.id,
                            id: 1
                        }, tr('account_details_navigate_to_my_coffee'))
                    }}
                    content={`Có ${statistics.coffee} nơi`}/>
                <InfoRow
                    icon="local-drink"
                    title={tr('account_details_navigate_to_my_pub')}
                    onPress={() => {
                        this.showMyAddedPlaces({
                            userId: currentUser.id,
                            id: 2
                        }, tr('account_details_navigate_to_my_pub'))
                    }}
                    content={`Có ${statistics.pub} nơi`}/>
                <InfoRow
                    icon="room-service"
                    title={tr('account_details_navigate_to_my_food')}
                    onPress={() => {
                        this.showMyAddedPlaces({
                            userId: currentUser.id,
                            id: 0
                        }, tr('account_details_navigate_to_my_food'))
                    }}
                    content={`Có ${statistics.food} nơi`}/>
                <InfoRow
                    icon="bell-ring"
                    title="Theo dõi"
                    iconType="material-community"
                    onPress={() => {
                        this.props.navigator.push({screen: "AllSubscriptions"});
                    }}
                />
                <View style={{flex: 1}}/>

                <Button
                    style={{backgroundColor: 'gray'}}
                    title={tr('account_details_log_out_button_title')}
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
)(AccountDetails);
