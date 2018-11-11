import {types} from "./actions";

const initState = {
  loading: false,
  items: {},
  error: false
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case types.LOAD_PROMOTIONS_REQUESTED:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case types.LOAD_PROMOTIONS_SUCCEED:
      const {queryId, items} = action.payload;
      const newItems = {};
      newItems[queryId] = items;
      return {
        loading: false,
        error: false,
        queryId,
        items: {
          ...state.items,
          ...newItems,
        },
      };
    case types.LOAD_PROMOTION_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
        message: action.payload,
      };
    case types.UPDATE_PLACE_BY_ID: {
      const {payload: {place}} = action;
      for (const id in state.items) {
        if (state.items.hasOwnProperty(id)) {
          let item = state.items[id];
          for (let i = 0; i < item.length; i++) {
            if (item[i].id === place.id) {
              item[i] = place;
            }
          }
          state.items[id] = item;
        }
      }
      return {
        ...state,
        loading: false,
        error: false,
      };
    }
    case types.ADD_PLACE_TO_LIST: {
      const {payload: {place, listQueryIds}} = action;
      listQueryIds.forEach(queryId => {
        if (state.items[queryId]) {
          state.items[queryId] = [...state.items[queryId], place];
        }
      });
      return {
        ...state,
        loading: false,
        error: false,
      };
    }
    case types.REMOVE_PLACE_FROM_LIST: {
      const {payload: {placeId, listQueryIds}} = action;
      listQueryIds.forEach(queryId => {
        if (state.items[queryId]) {
          state.items[queryId] = state.items[queryId].filter(item => item.id !== placeId);
        }
      });
      return {
        ...state,
        loading: false,
        error: false,
      };
    }
  }

  return state;
}
