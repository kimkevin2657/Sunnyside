import update from 'immutability-helper';

const defaultState = {
  experiences: [],
  searches: [],
};

function reducer(state = defaultState, {type, payload}) {
  switch (type) {
    case 'ADD_SEARCH_HISTORY_ITEM': {
      return {
        ...state,
        searches: [payload, ...state.searches],
      };
    }
    case 'ADD_EXPERIENCE_HISTORY_ITEM': {
      return {
        ...state,
        experiences: [payload, ...state.experiences],
      };
    }
    case 'UPDATE_DATE_EXPERIENCE_HISTORY_ITEM': {
      const index = state.experiences.findIndex((i) => i.id === payload.id);
      return update(state, {
        experiences: {
          [index]: {
            date: {$set: payload.date},
          },
        },
      });
    }
    case 'CLEAR_SEARCH_HISTORY': {
      return defaultState;
    }
    default:
      return state;
  }
}

export default reducer;
