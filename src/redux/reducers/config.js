const defaultState = {
    introSlider: 'new',
    enableBiometrics: null,
};

function reducer(state = defaultState, { type, payload }) {
    switch (type) {
        case 'SET_CONFIG_PARAMETER': {
            return {
                ...state,
                ...payload,
            };
        }
        case 'RESET_CONFIG': {
            return defaultState;
        }
        default:
            return state;
    }
}

export default reducer;
