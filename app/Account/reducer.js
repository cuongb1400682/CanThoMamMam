/**
 * Created by charlie on 3/16/17.
 */

import {types} from "./actions";

export default function reducer(state = {currentUser: null}, action) {
  switch (action.type) {
    case types.USER_LOGIN_REQUEST:
      return {
        loading: true,
        error: false
      };

    case types.USER_LOGIN_RESPONSE:
      if (action.error) {
        return {
          loading: false,
          error: true,
          message: action.payload,
        };
      } else {
        return {
          loading: false,
          error: false,
          currentUser: action.payload,
        };
      }

    case types.USER_LOGOUT_REQUEST:
      return {
        loading: true,
        error: false,
      };

    case types.USER_LOGOUT_RESPONSE:
      if (action.error) {
        return {
          loading: false,
          error: true,
          message: action.message,
        };
      } else {
        return {
          loading: false,
          error: false,
          currentUser: null,
        };
      }

  }

  return state;
}
