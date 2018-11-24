import {fetchPlaces, fetchPlacesByUserIds} from "../../utils/FirebaseUtils";
import * as categoryUtils from "../../utils/CategoryUtils";

export const types = {
    LOAD_PROMOTIONS_REQUESTED: 'LOAD_PROMOTIONS_REQUESTED',
    LOAD_PROMOTIONS_SUCCEED: 'LOAD_PROMOTIONS_SUCCEED',
    LOAD_PROMOTION_FAILED: 'LOAD_PROMOTION_FAILED',
    UPDATE_PLACE_BY_ID: 'UPDATE_PLACE_BY_ID',
    ADD_PLACE_TO_LIST: 'ADD_PLACE_TO_LIST',
    REMOVE_PLACE_FROM_LIST: 'REMOVE_PLACE_FROM_LIST',
};

export function getQueryId(query) {
    if (query) {
        const hasCategoryId = categoryUtils.hasCategoryId(query);
        const hasUserId = categoryUtils.hasUserId(query);
        if (hasCategoryId && hasUserId) {
            return `${query.userId}/${query.id}`;
        } else if (hasCategoryId) {
            return query.id;
        } else if (hasUserId) {
            return query.userId;
        } else if (query.keyword) {
            return query.keyword;
        } else if (query.which) {
            return "favoritePlacesForCurrentUser";
        } else if (query.userIds) {
            return "subscriptions";
        }
    }
    return "-1";
}

export const loadPromotions = (promotionRef, query) => async (dispatch, getState) => {
    dispatch({type: types.LOAD_PROMOTIONS_REQUESTED});
    try {
        let items = [];
        if (query.userIds instanceof Array) {
            items = await fetchPlacesByUserIds(query.userIds);
        } else {
            items = await fetchPlaces(promotionRef, query);
        }
        dispatch({
            type: types.LOAD_PROMOTIONS_SUCCEED,
            error: false,
            payload: {queryId: getQueryId(query), items},
        });
    } catch (e) {
        dispatch({
            type: types.LOAD_PROMOTION_FAILED,
            error: true,
            payload: e,
        });
    }
};

export const updatePlaceById = (place) => async (dispatch, getState) => {
    dispatch({
        type: types.UPDATE_PLACE_BY_ID,
        payload: {
            place,
        },
    });
};

export const addPlaceToList = (place, listQueryIds = []) => async (dispatch, getState) => {
    dispatch({
        type: types.ADD_PLACE_TO_LIST,
        payload: {
            place,
            listQueryIds,
        },
    });
};

export const removePlaceFromList = (placeId, listQueryIds = []) => async (dispatch, getState) => {
    dispatch({
        type: types.REMOVE_PLACE_FROM_LIST,
        payload: {
            placeId,
            listQueryIds,
        },
    });
};
