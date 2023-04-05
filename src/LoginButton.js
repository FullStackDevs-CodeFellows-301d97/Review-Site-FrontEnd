import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
    <Container>
      <button className="loginButton" onClick={() => loginWithRedirect()}>Log In</button>;
      
      </Container>
    </>
  )
};

export default LoginButton;