const setCategories = (categories) => {
  return {
    type: 'SET_CATEGORIES',
    payload: categories,
  };
};

const clearCategories = () => {
  return {
    type: 'CLEAR_CATEGORIES',
    payload: {},
  };
};

export {setCategories, clearCategories};
