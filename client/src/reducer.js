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
    default:
      return state;
  }  
};

export default reducer;
