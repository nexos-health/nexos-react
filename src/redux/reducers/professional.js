import * as actions from "../actions/professional"

const professionalInitialState = {
  professionals: null
};

const professionalReducer = (state = professionalInitialState, action) => {
  switch (action.type) {
    case "RESET_STORE":
      return {
        ...professionalInitialState
      };
    case actions.UPDATE_PROFESSIONALS:
      return {
        ...state,
        active: action.payload.professionals
      };
    default:
      return state
  }
};

export default professionalReducer;