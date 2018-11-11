import {fetchPlaces} from "../../utils/FirebaseUtils";

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
    if (typeof(query.id) === 'number' && query.id > -1) {
      return query.id;
    } else if (query.userId) {
      return query.userId;
    }
  }
  return "-1";
}

export const loadPromotions = (promotionRef, query) => async (dispatch, getState) => {
  dispatch({type: types.LOAD_PROMOTIONS_REQUESTED});
  try {
    const items = await fetchPlaces(promotionRef, query);
    dispatch({
      type: types.LOAD_PROMOTIONS_SUCCEED,
      error: false,
      payload: {queryId: getQueryId(query), items},
    });
  } catch (e) {
    console.log('LOAD_ALL_PLACES_FAILED', e);
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
