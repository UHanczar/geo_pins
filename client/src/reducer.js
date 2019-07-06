const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: payload,
      };
    case 'IS_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: payload,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    case 'CREATE_DRAFT':
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0,
        },
      };
    case 'UPDATE_DRAFT':
      return {
        ...state,
        draft: payload,
      };
    case 'DELETE_DRAFT':
      return {
        ...state,
        draft: null,
      };
    case 'GET_PINS':
      return {
        ...state,
        pins: payload,
      };
    case 'CREATE_PIN':
      const newPin = payload;
      const previousPins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...previousPins, newPin],
      };
    default:
      return state;
  }  
};

export default reducer;
