import React from "react";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  query{
    me {
      _id
      name
      email
      picture
    }
  }
`;

const Login = ({ classes }) => {
  const onLoginSuccess = async googleUser => {
    const userIdToken = googleUser.getAuthResponse().id_token;
    console.log('APIURL', process.env);
    const client = new GraphQLClient(`${process.env.REACT_APP_API_URL}`, {
      headers: { authorization: userIdToken },
    });

    const data = await client.request(ME_QUERY);
    console.log({ data });
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_OATH_CLIENT_ID}
      onSuccess={onLoginSuccess}
      isSignedIn={true}
    />
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
