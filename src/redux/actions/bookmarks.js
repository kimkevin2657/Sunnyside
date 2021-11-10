const addBookmark = (bookmark) => {
  return {
    type: 'ADD_BOOKMARK',
    payload: bookmark,
  };
};

const deleteBookmark = (id) => {
  return {
    type: 'DELETE_BOOKMARK',
    payload: id,
  };
};

const clearBookmarks = () => {
  return {
    type: 'CLEAR_BOOKMARKS',
    payload: {},
  };
};

export {addBookmark, deleteBookmark, clearBookmarks};
