import { useState, useEffect } from 'react';
import { GraphQLClient } from "graphql-request";

export const BASE_URL = process.env === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

export const useClient = () => {
  const [idToken, setIdToken] = useState('');

  useEffect(() => {
    const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

    setIdToken(idToken);
  }, []);

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: idToken, },
  });
};
