const openDrawer = () => {
    return {
        type: 'OPEN',
    };
};

const closeDrawer = () => {
    return {
        type: 'CLOSE',
    };
};

export { openDrawer, closeDrawer };
