import {addComment, fetchComments} from "../../utils/FirebaseUtils";
import {commentComparator} from "../../utils/AggregateUtils";

export const types = {
  LOAD_ALL_COMMENTS_REQUEST: 'LOAD_ALL_COMMENTS_REQUEST',
  LOAD_ALL_COMMENTS_SUCCEED: 'LOAD_ALL_COMMENTS_SUCCEED',
  LOAD_ALL_COMMENTS_FAILED: 'LOAD_ALL_COMMENTS_FAILED',
  ADD_NEW_COMMENT_REQUEST: 'ADD_NEW_COMMENT_REQUEST',
  ADD_NEW_COMMENT_SUCCEED: 'ADD_NEW_COMMENT_SUCCEED',
  ADD_NEW_COMMENT_FAILED: 'ADD_NEW_COMMENT_FAILED',
  UPDATE_COMMENT_REQUEST: 'UPDATE_COMMENT_REQUEST',
  UPDATE_COMMENT_SUCCEED: 'UPDATE_COMMENT_SUCCEED',
  UPDATE_COMMENT_FAILED: 'UPDATE_COMMENT_FAILED',

};

export const loadAllComments = (commentsRef, placeId) => async (dispatch, getState) => {
  dispatch({type: types.LOAD_ALL_COMMENTS_REQUEST});
  try {
    const items = await fetchComments(commentsRef);
    dispatch({
      type: types.LOAD_ALL_COMMENTS_SUCCEED,
      payload: {placeId, items},
      error: false,
    });
  } catch (e) {
    dispatch({
      type: types.LOAD_ALL_COMMENTS_FAILED,
      payload: e,
      error: true,
    });
  }
};

export const addNewComment = (placeId, creatorId, content, commentsRef) => async (dispatch, getState) => {
  dispatch({type: types.ADD_NEW_COMMENT_REQUEST});
  try {
    const comment = await addComment(commentsRef, {creatorId, content});
    dispatch({
      type: types.ADD_NEW_COMMENT_SUCCEED,
      payload: {
        comment,
        placeId,
      },
      error: false,
    });
  } catch (e) {
    dispatch({
      type: types.ADD_NEW_COMMENT_FAILED,
      error: true,
      payload: e,
    });
  }
};

export const updateComments = (placeId, comments) => async (dispatch, getState) => {
  dispatch({type: types.UPDATE_COMMENT_REQUEST});
  try {

    let items = [];
    for (let key in comments) {
      if (comments.hasOwnProperty(key)) {
        items.push({
          id: key,
          ...comments[key]
        });
      }
    }

    items.sort(commentComparator);

    dispatch({
      type: types.UPDATE_COMMENT_SUCCEED,
      payload: {
        comments: items,
        placeId,
      },
      error: false,
    });
  } catch (e) {
    dispatch({
      type: types.UPDATE_COMMENT_FAILED,
      error: true,
      payload: e,
    });
  }

};