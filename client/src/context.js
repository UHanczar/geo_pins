import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isLoggedIn: false,
  draft: null,
  pins: [],
  currentPin: null,
});

export default Context;
