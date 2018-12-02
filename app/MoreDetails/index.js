import React, {Component} from "react";
import {Alert, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {addNewPlace, deletePlace, saveChanges} from "../utils/FirebaseUtils";
import {Button, Icon} from 'react-native-elements';
import RNGooglePlacePicker from 'react-native-google-place-picker';
import InputBox from "./components/InputBox";
import ImagesGallery from "../components/ImagesGallery/index";
import {validateInput} from "../utils/InputValidationUtils";
import CategoriesList from "./components/CategoriesList";
import ScheduleInput from "./components/ScheduleInput";
import Promotions from "../Promotions/index";
import {ImagesSources} from "../utils/ImagesSourcesUtils";
import {isEmpty} from "../utils/StringUtils";
import {addPlaceToList, removePlaceFromList, updatePlaceById} from "../components/PromotionList/actions";
import {showMessage} from "../../app/utils/ErrorHandlers/index";
import Colors from "../res/colors/index";
import * as res from "../res/index";
import {tr} from "../res";
import {removeLikedPlace} from "../components/UserAvatar/actions";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class MoreDetails extends Component {
    static navigatorStyle = {
        navBarHideOnScroll: true,
        navBarTranslucent: true,
        navBarTransparent: true,
        navBarButtonColor: "#ffffff",
        navBarTextColor: "#ffffff",
        drawUnderNavBar: true,
        tabBarHidden: true,
        statusBarBlur: true, // ios
        statusBarTextColorScheme: 'light',
        statusBarColor: "black",
    };

    constructor(props) {
        super(props);

        this.onPickImagesFromSDCard = this.onPickImagesFromSDCard.bind(this);
        this.onPickImagesFromCamera = this.onPickImagesFromCamera.bind(this);

        let {images, placeDetails} = props;

        if (!placeDetails) {
            placeDetails = {
                user: {
                    id: props.currentUser ? props.currentUser.id : "",
                },
                name: "",
                description: "",
                address: {
                    displayName: "",
                    latitude: 0.0,
                    longitude: 0.0
                },
                category: 0,
                images,
                schedule: {
                    openHours: 0,
                    closeHours: 0,
                    workdays: [0, 1, 2, 3, 4, 5],
                    offdays: [6],
                    note: "",
                },
                food_prices: [],
                ext: {
                    phone: "",
                    email: "",
                    website: "",
                }
            };
            this.isEdited = false;
        } else {
            placeDetails = JSON.parse(JSON.stringify(placeDetails));
            this.isEdited = true;
        }

        this.imagesSources = new ImagesSources();
        this.imagesSources.setStateUpdateHandler(this.updatePlaceDetailsImages.bind(this));

        if (this.isEdited) {
            this.imagesSources.copyImagesFrom(placeDetails.images);
        }

        this.state = {
            placeDetails,
            error: {
                category: null,
                name: null,
                description: null,
                address: null,
                phone: null,
                website: null,
                email: null,
            },
        };
    }

    render() {
        let {
            placeDetails,
            error,
        } = this.state;

        return (
            <KeyboardAwareScrollView style={styles.container}>
                <ImagesGallery
                    images={placeDetails.images}
                    showAddNewItemButton
                    showDeleteItemButton
                    onAddNewItemButtonClick={this.addNewImages.bind(this)}
                    onDeleteItemButtonClick={this.deleteImageAtIndex.bind(this)}
                    navigator={this.props.navigator}
                />
                <CategoriesList
                    categories={Promotions.categories.map(category => res.I18n.t(category.name))}
                    categoryColors={Promotions.categories.map(category => category.color)}
                    title={tr('more_details_input_box_title_categories_list')}
                    error={error.category}
                    value={placeDetails.category}
                    onPress={(_, selectedIndex) => placeDetails.category = selectedIndex}
                />
                <InputBox
                    ref="inputName"
                    onChangeText={name => {
                        placeDetails.name = name;
                        this.setState({placeDetails});
                    }}
                    value={placeDetails.name}
                    title={tr('more_details_input_box_title_input_name')}
                    hint={tr('more_details_input_box_hint_input_name')}
                    error={error.name}
                />
                <InputBox
                    ref={"inputDescription"}
                    onChangeText={description => {
                        placeDetails.description = description;
                        this.setState({placeDetails});
                    }}
                    value={placeDetails.description}
                    title={tr('more_details_input_box_title_input_description')}
                    multiline
                    hint={tr('more_details_input_box_hint_input_description')}
                    error={error.description}
                />
                <InputBox
                    ref="inputAddress"
                    style={{flex: 1}}
                    multiline={true}
                    onChangeText={displayName => {
                        placeDetails.address.displayName = displayName;
                        this.setState({placeDetails});
                    }}
                    editable={false}
                    title={tr('more_details_input_box_title_input_address')}
                    hint={tr('more_details_input_box_hint_input_address')}
                    value={placeDetails.address.displayName}
                    error={error.address}
                    rightButton={
                        <TouchableOpacity
                            style={styles.openMapButton}
                            onPress={this.openLocationChooser.bind(this)}>
                            <Icon
                                size={32}
                                name="add-location"
                                color={Colors.primary}
                            />
                        </TouchableOpacity>
                    }
                />
                <InputBox
                    ref="inputEmail"
                    style={{flex: 1}}
                    onChangeText={email => {
                        placeDetails.ext.email = email;
                        this.setState({placeDetails});
                    }}
                    editable={true}
                    title={tr('more_details_input_box_title_input_email')}
                    keyboardType="email-address"
                    hint={tr('more_details_input_box_hint_input_email')}
                    value={placeDetails.ext.email}
                    error={error.email}
                />
                <InputBox
                    ref="inputWebsite"
                    style={{flex: 1}}
                    onChangeText={website => {
                        placeDetails.ext.website = website;
                        this.setState({placeDetails});
                    }}
                    editable={true}
                    keyboardType={"url"}
                    title={tr('more_details_input_box_title_input_website')}
                    hint={tr('more_details_input_box_hint_input_website')}
                    value={placeDetails.ext.website}
                    error={error.website}
                />
                <InputBox
                    ref="inputPhone"
                    style={{flex: 1}}
                    keyboardType={"phone-pad"}
                    onChangeText={phone => {
                        placeDetails.ext.phone = phone;
                        this.setState({placeDetails});
                    }}
                    editable={true}
                    title={tr('more_details_input_box_title_input_phone_number')}
                    hint={tr('more_details_input_box_hint_input_phone_number')}
                    value={placeDetails.ext.phone}
                    error={error.phone}
                />
                <View style={{height: 8}}/>
                <Button
                    backgroundColor={Colors.primary}
                    title={
                        this.isEdited
                            ? tr('more_details_save_changes_button')
                            : tr('more_details_add_new_place_button')
                    }
                    onPress={this.handleInput.bind(this)}
                />
                {this.isEdited && <View style={{height: 4}}/>}
                {this.isEdited && <Button
                    backgroundColor="red"
                    title={tr('more_details_delete_place_button')}
                    onPress={this.deletePlace.bind(this)}
                />}
                <View style={{height: 8}}/>
            </KeyboardAwareScrollView>
        );
    }

    updatePlaceDetailsImages(queue) {
        const images = queue.reduce(
            (accumulate, value) => {
                if (value.waiting) {
                    return accumulate.concat({waiting: true, url: ""});
                } else if (!isEmpty(value.url)) {
                    return accumulate.concat({url: value.url});
                } else {
                    return accumulate.concat({
                        error: value.error ? value.error.message : "Some problem occurred",
                        url: ""
                    });
                }
            }, []);
        let {placeDetails} = this.state;
        placeDetails.images = images;
        this.setState({placeDetails});
    }

    deleteImageAtIndex(index) {
        Alert.alert(
            tr('more_details_delete_image_alert_title'),
            tr('more_details_delete_image_alert_message'),
            [
                {
                    text: tr('more_details_delete_image_alert_yes_button'),
                    onPress: () => this.imagesSources.removeImageAtIndex(index)
                },
                {text: tr('more_details_delete_image_alert_no_button'), onPress: () => null},
            ],
        );
    }

    async onPickImagesFromCamera() {
        try {
            await this.imagesSources.takeImageFromCamera();
            await this.imagesSources.upload();
        } catch (e) {
            console.log(e);
        }
    }

    async onPickImagesFromSDCard() {
        try {
            await this.imagesSources.pickImagesFromSDCard();
            await this.imagesSources.upload();
        } catch (e) {
            showMessage(tr("more_details_no_images_selected"));
            console.log(e);
        }
    }

    addNewImages() {
        Alert.alert(
            tr('more_details_images_sources_title'),
            tr('more_details_images_sources_message'),
            [
                {text: tr('more_details_images_from_camera'), onPress: this.onPickImagesFromCamera},
                {text: tr('more_details_images_from_sdcard'), onPress: this.onPickImagesFromSDCard},
            ],
        )
    }

    openLocationChooser() {
        let {placeDetails} = this.state;
        RNGooglePlacePicker.show(response => {
            if (response.didCancel) {
                console.log('User cancelled GooglePlacePicker');
            } else if (response.error) {
                showMessage(response.error);
            } else {
                const {
                    longitude,
                    latitude,
                    address: displayName,
                } = response;

                placeDetails.address = {
                    longitude,
                    latitude,
                    displayName,
                };

                this.setState({placeDetails});
            }
        });
    }

    focusOnFirstErrorInputBox() {
        const {error} = this.state;
        if (error.category) {
            // nothing
        } else if (error.name) {
            this.refs.inputName.focus();
        } else if (error.description) {
            this.refs.inputDescription.focus();
        } else if (error.address) {
            this.refs.inputAddress.focus();
        } else if (error.email) {
            this.refs.inputEmail.focus();
        }
    }

    async handleInput() {
        let {placeDetails} = this.state;
        const {currentUser} = this.props;

        if (!this.props.currentUser) {
            showMessage(
                this.isEdited
                    ? tr('more_details_prompt_login_save_changes')
                    : tr('more_details_prompt_login_add_new_place')
            );
            return;
        }

        if (this.imagesSources.isUploading() > 0) {
            showMessage(tr('more_details_images_are_loading'));
            return;
        }

        if (!placeDetails.images || placeDetails.images.length === 0) {
            showMessage(tr('more_details_at_least_one_image_added'));
            return;
        }

        const error = validateInput(
            placeDetails.category,
            placeDetails.name,
            placeDetails.description,
            placeDetails.address,
            placeDetails.ext.email,
        );

        const hasError = !!error.category || !!error.email || !!error.description || !!error.address || !!error.email;

        if (!isEmpty(placeDetails.ext.website)) {
            const urlTokens = placeDetails.ext.website.split("://");
            if (urlTokens.length < 2) {
                placeDetails.ext.website = `http://${urlTokens[0]}`;
            }
        }

        if (hasError) {
            await this.setState({error});
            this.focusOnFirstErrorInputBox();
            showMessage(tr('more_details_input_error_detected'));
        } else {
            try {
                placeDetails.images = placeDetails.images.filter(image => !image.error);
                placeDetails.search_name = placeDetails.name.toLowerCase();
                if (this.isEdited) {
                    await saveChanges(placeDetails);
                    this.props.dispatch(updatePlaceById(placeDetails));
                    // category is changed, move place from old cat to new cat
                    if (placeDetails.category !== this.props.placeDetails.category) {
                        this.props.dispatch(removePlaceFromList(placeDetails.id, [this.props.placeDetails.category]));
                        this.props.dispatch(addPlaceToList(placeDetails, [placeDetails.category]));
                    }
                } else {
                    placeDetails.id = await addNewPlace(placeDetails); // addNewPlace() returns placeId
                    this.setState({placeDetails});
                    this.props.dispatch(addPlaceToList(placeDetails, [currentUser.id, "-1", placeDetails.category]));
                }
                this.close();
            } catch (e) {
                showMessage(e.message);
                console.log('MoreDetails.handleInput: ', e);
            }
        }
    }

    deletePlace() {
        const {
            placeDetails: {id: placeId, category}
        } = this.state;
        const {
            currentUser: {id: userId},
        } = this.props;
        Alert.alert(
            tr('more_details_delete_place_confirm_title'),
            tr('more_details_delete_place_confirm_message'),
            [
                {
                    text: tr('more_details_delete_place_alert_yes_button'),
                    onPress: async () => {
                        try {
                            await deletePlace(placeId);
                            this.props.dispatch(removePlaceFromList(placeId, [userId, "-1", category, "favoritePlacesForCurrentUser"]));
                            this.props.dispatch(removeLikedPlace(placeId));
                            this.close();
                        } catch (e) {
                            showMessage(tr("more_details_delete_place_error_message"));
                            console.log(e);
                        }
                    }
                },
                {
                    text: tr('more_details_delete_place_alert_no_button'),
                    onPress: () => null,
                },
            ],
        );
    }

    close() {
        this.props.navigator.dismissModal({
            animated: true,
            animationType: 'slide-down',
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    openMapButton: {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 16,
    },
    iconContainer: {
        borderRadius: 64,
        borderWidth: 1,
        borderColor: "#3f88cf",
        backgroundColor: "#00002d",
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
    },
});

const mapStateToProps = state => {
    const {user: {currentUser}} = state;
    return {currentUser};
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MoreDetails);
