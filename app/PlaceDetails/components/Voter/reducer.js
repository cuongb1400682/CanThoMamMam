import {types} from "./actions";

const initState = {
  error: false,
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case types.UNLIKE_FOR_USER_WITH_ID_REQUEST:
    case types.LIKE_FOR_USER_WITH_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case types.UNLIKE_FOR_USER_WITH_ID_SUCCEED: {
      return {
        ...state,
        loading: false,
        error: false,
      };
    }
    case types.LIKE_FOR_USER_WITH_ID_SUCCEED: {
      return {
        ...state,
        loading: false,
        error: false,
      };
    }
    case types.UNLIKE_FOR_USER_WITH_ID_FAILED:
    case types.LIKE_FOR_USER_WITH_ID_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        message: action.payload,
      };
  }
  return initState;
}
