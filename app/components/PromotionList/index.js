import React, {Component} from "react";
import {FlatList, View} from "react-native";
import {connect} from "react-redux";
import {Tile} from "react-native-elements";
import {database} from '../../../app/utils/FirebaseUtils';
import {getQueryId, loadPromotions} from "./actions";
import EmptyPromotionList from '../../../app/components/PromotionList/components/EmptyPromotionList/index';
import PropTypes from "prop-types";
import CreatorAvatar from "./components/CreatorAvatar/CreatorAvatar";
import {objectDiffer} from "../../utils/objects";

class PromotionList extends Component {
    static propTypes = {
        query: PropTypes.object,
        onPromotionPress: PropTypes.func,
        showsCreatorAvatar: PropTypes.bool
    };

    static defaultProps = {
        showsCreatorAvatar: false
    };

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.navigateToPlaceDetails = this.navigateToPlaceDetails.bind(this);
        this.loadPlacesList = this.loadPlacesList.bind(this);
    }

    loadPlacesList(placesRef, query) {
        this.props.dispatch(loadPromotions(placesRef, query));
    }

    componentDidMount() {
        this.promotionsRef = database.ref("promotions");
        const {query} = this.props;
        this.loadPlacesList(this.promotionsRef, query);
    }

    componentWillUnmount() {
        this.promotionsRef.off();
    }

    renderRow({item: promotion = {}}) {
        return (
            <View style={{
                width: "100%",
                height: 200
            }}>
                {this.props.showsCreatorAvatar && promotion.user && promotion.user.id &&
                <CreatorAvatar
                    creatorId={promotion.user.id}
                    style={{
                        position: "absolute",
                        zIndex: 1000,
                        right: 16,
                        bottom: 16,
                        shadowColor: "#fff",
                        shadowOpacity: 0.2,
                        shadowOffset: {
                            width: 2,
                            height: 2
                        }
                    }}
                />}
                <Tile
                    imageSrc={{uri: promotion.images[0].url}}
                    activeOpacity={0.8}
                    height={200}
                    featured
                    title={promotion.name}
                    caption={promotion.address.displayName}
                    onPress={() => {
                        this.navigateToPlaceDetails(promotion)
                    }}
                />
            </View>
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if (nextProps.query !== this.props.query) {
        //     if (nextProps.query.keyword !== this.props.query.keyword) {
        //         this.loadPlacesList(this.promotionsRef, nextProps.query)
        //     }
        // }

        if (objectDiffer(nextProps.query, this.props.query)) {
            this.loadPlacesList(this.promotionsRef, nextProps.query)
        }
    }

    navigateToPlaceDetails(place) {
        const {onPromotionPress} = this.props;

        if (onPromotionPress) {
            onPromotionPress(place)
        } else {
            this.props.navigator.push({
                screen: "PlaceDetails",
                passProps: {place},
            });
        }
    }

    render() {
        const {query, places: {items, loading}} = this.props;
        const queryId = getQueryId(query);
        const data = items[queryId] ? items[queryId] : [];

        if (!loading && data.length === 0) {
            return <EmptyPromotionList/>;
        }

        return (
            <FlatList
                data={data}
                refreshing={loading}
                onRefresh={this.loadPlacesList.bind(this, this.promotionsRef, query)}
                keyExtractor={item => item.id}
                renderItem={this.renderRow}
            />
        );
    }
}

const mapDispatchToProps = (dispatch) => ({dispatch});

const mapStateToProps = (state) => {
    const {places} = state;
    return {places};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PromotionList);
