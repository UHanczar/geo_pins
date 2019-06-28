import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request";
import Typography from "@material-ui/core/Typography";

import Contenxt from '../../context';
import { ME_QUERY } from "../../graphql/queries";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Contenxt);

  const onLoginSuccess = async googleUser => {
    try {
      const userIdToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(`${process.env.REACT_APP_API_URL}`, {
        headers: { authorization: userIdToken },
      });
      const { me } = await client.request(ME_QUERY);

      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() });
    } catch (error) {
      onLoginFailure(error);
    }
  };

  const onLoginFailure = error => {
    console.error(`Login error: ${error}`)
  };

  return (
    <div className={classes.root}>
      <Typography
        component='h1'
        variant='h3'
        gutterBottom
        noWrap
        style={{ color: 'rgb(66, 133, 244)'}}
      >
        Welcome
      </Typography>

      <GoogleLogin
        clientId={process.env.REACT_APP_OATH_CLIENT_ID}
        onSuccess={onLoginSuccess}
        onFailure={onLoginFailure}
        buttonText='Login with Google'
        isSignedIn={true}
        theme='dark'
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
