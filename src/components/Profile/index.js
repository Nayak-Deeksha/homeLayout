import React from "react";
import "./profile.css";
import { withRouter } from "react-router-dom";
import Button from "../Button";

class Profile extends React.Component {
  state = {
    user: {}
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("userData"));
    this.setState({ user });
  }

  logout = () => {
    this.props.history.push("/");
    localStorage.clear();
  };

  render() {
    return (
      <div className="profile">
        <div>
          <img
            src={this.state.user.imageUrl}
            alt="user-profile"
            className="profile-picture"
          />
        </div>
        <div className="username">{this.state.user.name}</div>
        <div className="signout-container"></div>
        <Button
          type="button"
          onClick={this.logout}
          text="LOGOUT"
          className="sign-out"
        />
      </div>
    );
  }
}

export default withRouter(Profile);
