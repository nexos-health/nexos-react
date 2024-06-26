import * as actions from "../actions/professional"

const professionalInitialState = {
  professionals: null,
  groups: [],
  professionTypes: null,
  active: null,
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
    case actions.UPDATE_PROFESSIONAL_NOTES:
      return {
        ...state,
        professionals: {
          ...state.professionals,
          [action.payload.professionalUid]: {
            ...state.professionals[action.payload.professionalUid],
            "userNotes": action.payload.notes
          }
        }
      };
    case actions.UPDATE_GROUPS:
      return {
        ...state,
        groups: action.payload.groups
      };
    case actions.UPDATE_GROUP:
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.payload.groupUid]: action.payload.groupDetails
        }
      };
    case actions.UPDATE_EDITED_GROUP:
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.payload.groupUid]: {
            ...state.groups[action.payload.groupUid],
            "name": action.payload.groupName,
            "description": action.payload.groupDescription,
          }
        }
      };
    default:
      return state
  }
};

export default professionalReducer;