const setConfigParameter = (parameter, value) => {
  return {
    type: 'SET_CONFIG_PARAMETER',
    payload: {[parameter]: value},
  };
};

export {setConfigParameter};
