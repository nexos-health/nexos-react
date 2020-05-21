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
    case actions.UPDATE_PROFESSION_TYPES:
      return {
        ...state,
        professionTypes: action.payload.professionTypes
      };
    case actions.UPDATE_PROFESSIONALS:
      return {
        ...state,
        professionals: action.payload.professionals
      };
    case actions.UPDATE_PROFESSIONAL:
      return {
        ...state,
        active: action.payload.currentProfessional
      };
    default:
      return state
  }
};

export default professionalReducer;