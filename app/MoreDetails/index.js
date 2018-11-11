import React, {Component} from "react";
import {Alert, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {addNewPlace, deletePlace, saveChanges} from "../utils/FirebaseUtils";
import {Button, Icon, Tile} from 'react-native-elements';
import RNGooglePlacePicker from 'react-native-google-place-picker';
import InputBox from "./InputBox";
import ImagesGallery from "../components/ImagesGallery/index";
import {validateInput} from "../utils/InputValidationUtils";
import CategoriesList from "./CategoriesList";
import Promotions from "../Promotions/index";
import {ImageSources} from "../utils/ImageSourcesUtils";
import {addPlaceToList, removePlaceFromList, updatePlaceById} from "../components/PromotionList/actions";
import {showMessage} from "../../app/utils/ErrorHandlers/index";
import Colors from "../res/colors/index";
import * as res from "../res/index";

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

    this.addNewlyUploadedPhotosToList = this.addNewlyUploadedPhotosToList.bind(this);
    this.onPickImagesFromSDCard = this.onPickImagesFromSDCard.bind(this);
    this.onPickImagesFromCamera = this.onPickImagesFromCamera.bind(this);
    this.isImageUploading = false;

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
        ext: {
          phone: "",
          email: "",
          website: "",
        }
      };
      this.isEdited = false;
    } else {
      placeDetails = JSON.parse(JSON.stringify(placeDetails)); // make a copy of placeDetails from props
      images = placeDetails.images;
      this.isEdited = true;
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
      <ScrollView style={styles.container}>
        <ImagesGallery
          images={placeDetails.images}
          showAddNewItemButton
          onAddNewItemButtonClick={this.onPickImagesFromSDCard.bind(this)}
          showDeleteItemButton
          onDeleteItemButtonClick={this.deleteImageAtIndex.bind(this)}
          navigator={this.props.navigator}
        />
        <CategoriesList
          categories={Promotions.categories.map(category => res.I18n.t(category.name))}
          categoryColors={Promotions.categories.map(category => category.color)}
          title="categories"
          error={error.category}
          value={placeDetails.category}
          onPress={(_, selectedIndex) => {
            placeDetails.category = selectedIndex;
          }}
        />
        <InputBox
          ref="inputName"
          onChangeText={name => {
            placeDetails.name = name;
            this.setState({placeDetails});
          }}
          value={placeDetails.name}
          title="name"
          hint="Please enter name of place"
          error={error.name}
        />
        <InputBox
          ref={"inputDescription"}
          onChangeText={description => {
            placeDetails.description = description;
            this.setState({placeDetails});
          }}
          value={placeDetails.description}
          title="description"
          multiline
          hint="Leave some description for place"
          error={error.description}
        />
        <InputBox
          ref="inputAddress"
          style={{flex: 1}}
          onChangeText={displayName => {
            placeDetails.address.displayName = displayName;
            this.setState({placeDetails});
          }}
          editable={false}
          title="address"
          hint="1, Wall Street, New York, US"
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

        <View style={{height: 8}}/>
        <Button
          backgroundColor={Colors.primary}
          title={
            this.isEdited
              ? 'SAVE CHANGES'
              : 'ADD NEW PLACE'
          }
          onPress={this.handleInput.bind(this)}
        />

        {this.isEdited && <View style={{height: 4}}/>}
        {this.isEdited && <Button
          backgroundColor="red"
          title="DELETE THIS PLACE"
          onPress={this.deletePlace.bind(this)}
        />}
        <View style={{height: 8}}/>
      </ScrollView>
    );
  }

  deleteImageAtIndex(index) {
    Alert.alert(
      'Delete Image',
      'Do you really want to delete this image?',
      [
        {
          text: 'Yes', onPress: () => {
          const {placeDetails} = this.state;
          placeDetails.images.splice(index, 1);
          this.setState({placeDetails});
        }
        },
        {text: 'No', onPress: () => null},
      ],
    );
  }

  async onPickImagesFromCamera() {
    try {
      const imageSources = await new ImageSources()
        .pickImagesFromCamera();
      this.addNewlyUploadedPhotosToList(await imageSources.startUploading());
    } catch (e) {
      console.log(e);
    }
  }

  async onPickImagesFromSDCard() {
    try {
      const imageSources = await new ImageSources()
        .beforeUploading(() => this.isImageUploading = true)
        .inUploading(uploadedImage => {
          this.addNewlyUploadedPhotosToList([uploadedImage])
        })
        .afterUploading((_, nSuccess) => {
          if (nSuccess === 0) {
            showMessage("No image was uploaded");
          } else {
            showMessage(`Total ${nSuccess} image${nSuccess > 1 ? 's were' : ' was'} uploaded`);
          }
          this.isImageUploading = false;
        })
        .pickImagesFromSDCard();
      await imageSources.startUploading();
    } catch (e) {
      showMessage("There is no uploaded image");
      console.log(e);
    }
  }

  addNewlyUploadedPhotosToList(newImages) {
    const {placeDetails} = this.state;
    placeDetails.images = [...placeDetails.images, ...newImages];
    this.setState({placeDetails});
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
    }
  }

  async handleInput() {
    let {placeDetails} = this.state;
    const {currentUser} = this.props;

    if (!this.props.currentUser) {
      showMessage(`Please login before ${this.isEdited ? "save changes" : "add this place"}`);
      return;
    }

    if (this.isImageUploading) {
      showMessage("Please wait after uploading images");
      return;
    }

    if (!placeDetails.images || placeDetails.images.length === 0) {
      showMessage("There must be at least 1 image for this place");
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

    if (hasError) {
      await this.setState({error});
      this.focusOnFirstErrorInputBox();
      showMessage('Some invalid inputs are detected!');
    } else {
      try {
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
      'Delete Place',
      'Deleted place cannot be restored. Are you sure?',
      [
        {
          text: 'Yes', onPress: async () => {
          try {
            await deletePlace(placeId);
            this.props.dispatch(removePlaceFromList(placeId, [userId, "-1", category]));
            this.close();
          } catch (e) {
            showMessage("Some problem during process of deleting this place");
            console.log(e);
          }
        }
        },
        {text: 'No', onPress: () => null},
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
