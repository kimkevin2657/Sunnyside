const defaultState = [];

function reducer(state = defaultState, {type, payload}) {
  switch (type) {
    case 'ADD_BOOKMARK': {
      return [...state, payload];
    }
    case 'DELETE_BOOKMARK': {
      return state.filter((b) => b.id !== payload);
    }
    case 'CLEAR_BOOKMARKS': {
      return defaultState;
    }
    default:
      return state;
  }
}

export default reducer;
