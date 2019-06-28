import React, { Component } from 'react';
import './HomePage.css';


export default class HomePage2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Old",
      surname: "Way"
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleSurnameChange(e) {
    this.setState({
      surname: e.target.value
    });
  }

  render() {
    return (
      <section>
        <div>
          <input
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </div>
        <div>
          <input
            value={this.state.surname}
            onChange={this.handleSurnameChange}
          />
        </div>
      </section>
    )
  }
}
