import React, { Component } from 'react';
import { HomePage } from "./home/HomePage";
import Provider from "react-redux/es/components/Provider";

export default class App extends Component {

  render() {
    return (
      <div>
        <HomePage/>
      </div>
    );
  }
}
