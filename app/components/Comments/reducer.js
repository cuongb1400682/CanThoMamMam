import {types} from "./actions";

const initialState = {
  loading: false,
  error: false,
  items: {},
  message: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_COMMENT_REQUEST:
    case types.LOAD_ALL_COMMENTS_REQUEST:
    case types.ADD_NEW_COMMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        message: '',
      };
    case types.LOAD_ALL_COMMENTS_SUCCEED: {
      const {placeId, items} = action.payload;
      return {
        items: {
          ...state.items,
          [placeId]: items,
        },
        loading: false,
        error: false,
        message: '',
      };
    }
    case types.UPDATE_COMMENT_FAILED:
    case types.LOAD_ALL_COMMENTS_FAILED:
    case types.ADD_NEW_COMMENT_FAILED:
      const {message} = action.payload;
      return {
        ...state,
        loading: false,
        error: true,
        message,
      };
    case types.ADD_NEW_COMMENT_SUCCEED: {
      return {
        ...state,
        loading: false,
        error: false,
        message: '',
      };
    }
    case types.UPDATE_COMMENT_SUCCEED: {
      const {placeId, comments} = action.payload;
      state.items[placeId] = comments;
      return {
        ...state,
        loading: false,
        error: false,
        message: '',
      };
    }
  }
  return state;
}
