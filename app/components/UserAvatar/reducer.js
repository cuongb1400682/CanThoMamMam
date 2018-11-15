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
      console.log("reducer: received new UserInfo");
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
      console.log("reducer(UPDATE_USERS_INFO_SUCCEED): received new UserInfo: newUsersInfo = ", JSON.stringify(newUsersInfo));
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
      console.log("in reducer/types.REMOVE_LIKED_PLACE: usersInfo = ", Object.getOwnPropertyNames(usersInfo));
      for (let userId in usersInfo) {
        if (usersInfo.hasOwnProperty(userId) && usersInfo[userId].hasOwnProperty("likedPlaces")) {
          delete usersInfo[userId].likedPlaces[placeId];
        }
      }
      //console.log(usersInfo);
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
