const defaultState = {
    isDrawer: false,
};

function reducer(state = defaultState, { type, payload }) {
    switch (type) {
        case 'OPEN': {
            return {
                ...state,
                isDrawer : true,
            };
        }
        case 'CLOSE': {
            return {
                isDrawer: false
            };
        }
        default:
            return state;
    }
}

export default reducer;
