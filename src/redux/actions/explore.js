const setExplore = (payload) => {
  return {
    type: 'SET_EXPLORE',
    payload,
  };
};

const resetExplore = () => {
  return {
    type: 'RESET_EXPLORE',
    payload: null,
  };
};

const updateExplore = (payload) => {
  return {
    type: 'UPDATE_EXPLORE',
    payload,
  };
};

export {setExplore, resetExplore, updateExplore};
