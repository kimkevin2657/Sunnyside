const defaultState = {
  uid: '',
  accessToken: '',
  refreshToken : '',
  userName: '',
  fcmToken: '',
  email: '',
  useLock: "N",
  pinPassword : "",
  lockType : "pin",
  moneyType: "SGD",
};

function reducer(state = defaultState, {type, payload}) {
  switch (type) {
    case 'SET_USER': {
      return {
        ...state,
        ...payload,
      };
    }
    case 'CLEAR_USER': {
      return defaultState;
    }
    default:
      return state;
  }
}

export default reducer;
