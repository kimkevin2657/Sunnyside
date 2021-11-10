const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: user,
  };
};

const clearUser = () => {
  return {
    type: 'CLEAR_USER',
    payload: {},
  };
};

export {setUser, clearUser};
