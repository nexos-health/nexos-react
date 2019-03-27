import React, { Component } from 'react';
import { connect } from 'react-redux'
import logo from '../../logo.svg';
import './HomePage.css';
import * as professionalActions from "../../redux/actions/professional";
import {bindActionCreators} from "redux/es/redux";

const mapStateToProps = state => ({
  professionals: state.professionals.active
});

const mapDispatchToProps = dispatch => {
  return {
    professionalActions: bindActionCreators(professionalActions, dispatch)
  }
};


class HomePage extends Component {
  componentDidMount = () => {
    console.log("HEllo1");
    this.props.professionalActions.fetchProfessionals();
    console.log("HEllo2");
  };

  render() {
    if (this.props.professionals) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <div>{this.props.professionals[0].first_name} {this.props.professionals[0].last_name}</div>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      );
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
