const defaultState = [];

function reducer(state = defaultState, {type, payload}) {
  switch (type) {
    case 'ADD_BOOKING': {
      return [...state, payload];
    }
    case 'CLEAR_BOOKINGS': {
      return defaultState;
    }
    default:
      return state;
  }
}

export default reducer;
