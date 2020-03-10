import React from "react";
import "./landing.css";
import { API_CONSTANTS } from "../../constants/api";
import { DataHandle } from "../../utils/dataHandler";
import { GoogleLogin } from "react-google-login";

class Landing extends React.Component {
  handleUserCreate = data => {
    localStorage.setItem("userData", JSON.stringify(data));
    this.props.history.push("/Home");
  };

  handleGoogleLogin = data => {
    const userObject = {
      name: data.name,
      imageUrl: data.imageUrl,
      email: data.email
    };
    DataHandle.postData(
      API_CONSTANTS.CREATE_USER,
      userObject,
      this.handleUserCreate
    );
  };

  responseGoogle = response => {
    console.log(response);
    this.handleGoogleLogin(response.profileObj);
  };
  
  render() {
    return (
      <div className="main-container">
        <div className="center-screen">
          <h3 className="title">Floor Plan Creator</h3>
          <GoogleLogin
            clientId="664040076806-mb6vilt6saaev3hc1i6frvopcl6qqmtv.apps.googleusercontent.com"
            buttonText="Sign In with Google"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={"single_host_origin"}
            className="login"
          />
        </div>
      </div>
    );
  }
}

export default Landing;
