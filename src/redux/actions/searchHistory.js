const addSearchHistoryItem = (historyItem) => {
  return {
    type: 'ADD_SEARCH_HISTORY_ITEM',
    payload: historyItem,
  };
};

const addExperienceHistoryItem = (historyItem) => {
  return {
    type: 'ADD_EXPERIENCE_HISTORY_ITEM',
    payload: historyItem,
  };
};

const updateDateExperienceHistoryItem = (id, date) => {
  return {
    type: 'UPDATE_DATE_EXPERIENCE_HISTORY_ITEM',
    payload: {id, date},
  };
};

const clearSearchHistory = () => {
  return {
    type: 'CLEAR_SEARCH_HISTORY',
    payload: {},
  };
};

export {
  addSearchHistoryItem,
  addExperienceHistoryItem,
  updateDateExperienceHistoryItem,
  clearSearchHistory,
};
