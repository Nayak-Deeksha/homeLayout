import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Profile from "../Profile";
import Button from "../Button";
import Modal from "../Modal";
import Input from "../InputField";

class HomePage extends React.Component {
  state = {
    show: false,
    blueprintName: "",
    width: "",
    height: "",
    blueprints: [],
    selectedBlueprint: ""
  };

  componentDidMount() {
    let keys = Object.keys(localStorage);
    keys = keys.filter(elem => elem !== "userData");
    this.setState({ blueprints: keys });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  showModal = e => {
    this.setState({
      show: !this.state.show
    });
  };
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    return (
      <div className="Dashboard">
        <h1 className="heading">Welcome to Floor Plan Creator</h1>
        <Profile />
        <div className="blueprints">
          <div className="create-blueprint">
            <div className="new-blueprint" onClick={this.showModal}>
              CREATE NEW BLUEPRINT
            </div>
          </div>
          <hr className="page-divider"></hr>

          <div className="saved-blueprints">
            <div className="saved-msg">Your Blueprints:</div>
            {this.state.blueprints.map((blueprint, i) => (
              <Link to={`/blueprint/${blueprint}`}>
                <div key={i} className="blueprint">
                  <div className="blueprint-text">{blueprint}</div>
                </div>
              </Link>
            ))}
          </div>
          <Modal onClose={this.showModal} show={this.state.show}>
            <Input
              className="home-input"
              type="text"
              name="blueprintName"
              value={this.state.blueprintName}
              onChange={this.handleChange}
              placeholder="Blueprint Name"
            ></Input>
            <Input
              className="home-input"
              type="number"
              name="width"
              value={this.state.width}
              onChange={this.handleChange}
              placeholder="Home Width"
            ></Input>
            <Input
              className="home-input"
              type="number"
              name="height"
              value={this.state.height}
              onChange={this.handleChange}
              placeholder="Home Height"
            ></Input>
            <Link
              to={{
                pathname: `/blueprint/${this.state.blueprintName}`,
                state: this.state
              }}
            >
              <Button
                type="submit"
                className="home-button"
                text="SUBMIT"
                disabled={
                  !(
                    this.state.width &&
                    this.state.height &&
                    this.state.blueprintName
                  )
                }
              ></Button>
            </Link>
          </Modal>
        </div>
      </div>
    );
  }
}
export default HomePage;
