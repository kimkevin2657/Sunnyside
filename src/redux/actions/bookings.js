const addBooking = (booking) => {
  return {
    type: 'ADD_BOOKING',
    payload: booking,
  };
};

const clearBookings = () => {
  return {
    type: 'CLEAR_BOOKINGS',
    payload: {},
  };
};

export {addBooking, clearBookings};
