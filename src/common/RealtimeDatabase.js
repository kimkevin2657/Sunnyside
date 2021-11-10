import database from '@react-native-firebase/database';
import {store} from '@redux/store';

const RealtimeDatabase = (() => {
  return {
    startListening: () => {
      const {user} = store.getState();
      /* Listening for new bookmark */
      database()
        .ref(`bookmarks/${user.uid}`)
        .orderByChild('created')
        .on('child_added', (snapshot) => {
          const newBookmark = snapshot.val();
          const {bookmarks} = store.getState();
          const exist = bookmarks.some((b) => b.id === newBookmark.id);
          // Add only if you are on another device (the bookmark doesn't exist)
          if (!exist) {
            store.dispatch({
              type: 'ADD_BOOKMARK',
              payload: newBookmark,
            });
          }
        });
      /* Listening for deleted bookmark */
      database()
        .ref(`bookmarks/${user.uid}`)
        .on('child_removed', (snapshot) => {
          const removedBookmark = snapshot.val();
          const {bookmarks} = store.getState();
          const exist = bookmarks.some((b) => b.id === removedBookmark.id);
          // Delete only if you are on another device (the bookmark already exists)
          if (exist) {
            store.dispatch({
              type: 'DELETE_BOOKMARK',
              payload: removedBookmark.id,
            });
          }
        });
      /* Listening for new booking */
      database()
        .ref(`bookings/${user.uid}`)
        .orderByChild('created')
        .on('child_added', (snapshot) => {
          const newBooking = snapshot.val();
          const {bookings} = store.getState();
          const exist = bookings.some((b) => b.id === newBooking.id);
          // Add only if you are on another device (the booking doesn't exist)
          if (!exist) {
            store.dispatch({
              type: 'ADD_BOOKING',
              payload: newBooking,
            });
          }
        });
    },
    stopListening: () => {
      const {user} = store.getState();
      /* Stop listening for bookmarks */
      database().ref(`bookmarks/${user.uid}`).off();
      /* Stop listening for bookings */
      database().ref(`bookings/${user.uid}`).off();
    },
  };
})();

export default RealtimeDatabase;
