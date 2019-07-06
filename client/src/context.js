import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isLoggedIn: false,
  draft: null,
  pins: [],
});

export default Context;
