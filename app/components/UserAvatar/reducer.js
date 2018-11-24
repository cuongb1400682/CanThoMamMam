import {types} from "./actions";

const initState = {
  loading: false,
  items: {},
  error: false
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case types.UPDATE_USERS_INFO_REQUESTED:
    case types.LOAD_USER_INFO_REQUESTED:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case types.LOAD_USER_INFO_SUCCEED:
      const {items} = action.payload;
      return {
        items: {
          //...state.items,
          ...items,
        },
        loading: false,
        error: false,
      };
    case types.UPDATE_USERS_INFO_FAILED:
    case types.LOAD_USER_INFO_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        message: action.payload,
      };
    case types.UPDATE_USERS_INFO_SUCCEED:
      const {newUsersInfo} = action.payload;
      state.items = newUsersInfo;
      return {
        ...state,
        loading: false,
        error: false,
        message: '',
      };
    case types.REMOVE_LIKED_PLACE: {
      const {placeId} = action.payload;
      let usersInfo = state.items;
      for (let userId in usersInfo) {
        if (usersInfo.hasOwnProperty(userId) && usersInfo[userId].hasOwnProperty("likedPlaces")) {
          delete usersInfo[userId].likedPlaces[placeId];
        }
      }
      return {
        items: usersInfo,
        loading: false,
        error: false,
        message: '',
      };
    }
    default:
      return state;
  }
}
