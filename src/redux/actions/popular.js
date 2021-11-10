const setPopular = (history) => {
  return {
    type: 'SET_POPULAR',
    payload: history,
  };
};

const clearPupular = () => {
  return {
    type: 'CLEAR_POPULAR',
    payload: {},
  };
};

export {setPopular, clearPupular};
