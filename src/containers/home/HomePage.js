import React, { Component } from 'react';
import { connect } from 'react-redux'
import {StripeProvider} from 'react-stripe-elements';

import logo from '../../logo.svg';
import './HomePage.css';
import * as paymentActions from "../../redux/actions/payment";
import {bindActionCreators} from "redux/es/redux";

const mapStateToProps = state => ({
  payment: state.payment
});

const mapDispatchToProps = dispatch => {
  return {
    paymentActions: bindActionCreators(paymentActions, dispatch)
  }
};


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentSession: {
        error: ""
      },
    };
  }

  redirectToCheckout = () => {
    let stripe = Stripe(process.env.REACT_APP_STRIPE_PUBLIC_API_KEY);
    fetch(process.env.REACT_APP_PLATFORM_API + "/api/payment/pay-once")
      .then(
        stripe.redirectToCheckout({
          sessionId: this.props.payment.sessionId
        }).then((result) => {
          this.setState({
            session: {
              error: result.error.message
            }
          })
        })
      )
  };

  render() {
    if (this.state.paymentSession.error) {
      return (
        <div>There was an error</div>
      )
    }

    return (
      <div className="App">
        <script src="https://js.stripe.com/v3/"> </script>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
            <p
              className="App-link"
              onClick={this.redirectToCheckout}
              rel="noopener noreferrer"
            >
              Click to pay Doctors Australia
            </p>
        </header>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
