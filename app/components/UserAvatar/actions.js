import {fetchUsersInfo} from "../../utils/FirebaseUtils";

export const types = {
  LOAD_USER_INFO_REQUESTED: 'LOAD_USER_INFO_REQUESTED',
  LOAD_USER_INFO_SUCCEED: 'LOAD_USER_INFO_SUCCEED',
  LOAD_USER_INFO_FAILED: 'LOAD_USER_INFO_FAILED',
  UPDATE_USERS_INFO_REQUESTED: 'UPDATE_USERS_INFO_REQUESTED',
  UPDATE_USERS_INFO_SUCCEED: 'UPDATE_USERS_INFO_SUCCEED',
  UPDATE_USERS_INFO_FAILED: 'UPDATE_USERS_INFO_FAILED',
  REMOVE_LIKED_PLACE: 'REMOVE_LIKED_PLACE',
};

export const loadUserInfo = (usersRef, query) => async (dispatch, getState) => {
  dispatch({type: types.LOAD_USER_INFO_REQUESTED});
  try {
    let items = await fetchUsersInfo(usersRef, query);
    dispatch({
      type: types.LOAD_USER_INFO_SUCCEED,
      error: false,
      payload: {items},
    });
  } catch (e) {
    console.log('LOAD_USER_INFO_FAILED', e);
    console.log("LOAD_USER_INFO_FAILED/getState() = ", getState());
    dispatch({
      type: types.LOAD_USER_INFO_FAILED,
      error: true,
      payload: e,
    });
  }
};

export const updateUsersInfo = (newUsersInfo) => async (dispatch, getState) => {
  dispatch({type: types.UPDATE_USERS_INFO_REQUESTED});
  try {
    dispatch({
      type: types.UPDATE_USERS_INFO_SUCCEED,
      error: false,
      payload: {newUsersInfo},
    });
  } catch (e) {
    console.log('UPDATE_USERS_INFO_FAILED', e);
    dispatch({
      type: types.UPDATE_USERS_INFO_FAILED,
      error: true,
      payload: e,
    });
  }
};

export const removeLikedPlace = (placeId) => async (dispatch, getState) => {
  dispatch({
    type: types.REMOVE_LIKED_PLACE,
    error: false,
    payload: {placeId}
  });
};