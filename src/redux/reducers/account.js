import * as actions from "../actions/account"

const accountInitialState = {
  account: null
};

const accountReducer = (state = accountInitialState, action) => {
  switch (action.type) {
    case "RESET_STORE":
      return {
        ...accountInitialState
      };
    case actions.UPDATE_ACCOUNT_DETAILS:
      return {
        ...state,
        accountDetails: action.payload.accountDetails
      };
    default:
      return state
  }
};

export default accountReducer;