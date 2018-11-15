import {toggleVote} from "../../../utils/FirebaseUtils";

export const types = {
  LIKE_FOR_USER_WITH_ID_REQUEST: 'LIKE_FOR_USER_WITH_ID_REQUEST',
  LIKE_FOR_USER_WITH_ID_SUCCEED: 'LIKE_FOR_USER_WITH_ID_SUCCEED',
  LIKE_FOR_USER_WITH_ID_FAILED: 'LIKE_FOR_USER_WITH_ID_FAILED',
  UNLIKE_FOR_USER_WITH_ID_REQUEST: 'UNLIKE_FOR_USER_WITH_ID_REQUEST',
  UNLIKE_FOR_USER_WITH_ID_SUCCEED: 'UNLIKE_FOR_USER_WITH_ID_SUCCEED',
  UNLIKE_FOR_USER_WITH_ID_FAILED: 'UNLIKE_FOR_USER_WITH_ID_FAILED',
};

export const likeForUserWithId = (placeId, userId, oldState) => async (dispatch, getState) => {
  dispatch({type: types.LIKE_FOR_USER_WITH_ID_REQUEST});

  try {
    await toggleVote(placeId, userId, true, oldState);
    dispatch({
      type: types.LIKE_FOR_USER_WITH_ID_SUCCEED,
      error: false,
    });
  } catch (e) {
    dispatch({
      types: types.LIKE_FOR_USER_WITH_ID_FAILED,
      error: true,
      payload: e,
    });
  }
};

export const unlikeForUserWithId = (placeId, userId, oldState) => async (dispatch, getState) => {
  dispatch({type: types.UNLIKE_FOR_USER_WITH_ID_REQUEST});

  try {
    await toggleVote(placeId, userId, false, oldState);
    dispatch({
      type: types.UNLIKE_FOR_USER_WITH_ID_SUCCEED,
      error: false,
    });
  } catch (e) {
    dispatch({
      type: types.UNLIKE_FOR_USER_WITH_ID_FAILED,
      error: true,
      payload: e,
    });
  }
};
