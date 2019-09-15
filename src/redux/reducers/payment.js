import * as actions from "../actions/payment"

const paymentInitialState = {
  payment: null
};

const paymentReducer = (state = paymentInitialState, action) => {
  switch (action.type) {
    case "RESET_STORE":
      return {
        ...paymentInitialState
      };
    case actions.UPDATE_PAYMENT_SESSION:
      return {
        ...state,
        sessionId: action.payload.sessionId
      };
    default:
      return state
  }
};

export default paymentReducer;