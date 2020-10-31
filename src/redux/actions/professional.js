export const FETCH_PROFESSION_TYPES = "FETCH_PROFESSION_TYPES";
export const UPDATE_PROFESSION_TYPES = "UPDATE_PROFESSION_TYPES";
export const FETCH_PROFESSIONALS = "FETCH_PROFESSIONALS";
export const UPDATE_PROFESSIONALS = "UPDATE_PROFESSIONALS";
export const FETCH_PROFESSIONAL = "FETCH_PROFESSIONAL";
export const UPDATE_PROFESSIONAL_NOTES = "UPDATE_PROFESSIONAL_NOTES";
export const ADD_PROFESSIONALS_TO_GROUP = "ADD_PROFESSIONALS_TO_GROUP";
export const REMOVE_PROFESSIONALS_FROM_GROUP = "REMOVE_PROFESSIONALS_FROM_GROUP";
export const CREATE_GROUP = "CREATE_GROUP";
export const FETCH_GROUPS = "FETCH_GROUPS";
export const FETCH_FAVOURITES = "FETCH_FAVOURITES";
export const FAVOUR_PROFESSIONAL = "FAVOUR_PROFESSIONAL";
export const UNFAVOUR_PROFESSIONAL = "UNFAVOUR_PROFESSIONAL";
export const EDIT_PROFESSIONAL_NOTE = "EDIT_PROFESSIONAL_NOTE";
export const DELETE_GROUP = "DELETE_GROUP";
export const EDIT_GROUP = "EDIT_GROUP";
export const UPDATE_GROUPS = "UPDATE_GROUPS";
export const UPDATE_GROUP = "UPDATE_GROUP";
export const UPDATE_EDITED_GROUP = "UPDATE_EDITED_GROUP";


export function fetchProfessionTypes() {
  return {
    type: FETCH_PROFESSION_TYPES,
    meta: {
      method: 'GET',
      endpoint: `/api/professionals/list_profession_types/`,
      success: updateProfessionTypes,
    }
  }
}

function updateProfessionTypes(data) {
  console.log(data);
  return {
    type: UPDATE_PROFESSION_TYPES,
    payload: {
      professionTypes: data
    }
  }
}

export function fetchProfessionals(professionTypes) {
  let professionTypeIds = professionTypes.map((professionType) => {
    return (professionType.value)
  });
  return {
    type: FETCH_PROFESSIONALS,
    meta: {
      method: 'GET',
      endpoint: `/api/professionals/list_professionals/?professionTypes=${professionTypeIds.join(",")}`,
      success: updateProfessionals,
    }
  }
}

function updateProfessionals(data) {
  return {
    type: UPDATE_PROFESSIONALS,
    payload: {
      professionals: data
    }
  }
}

export function addProfessionalsToGroup(professionals, group) {
  let professionalsList = [...professionals];
  return {
    type: ADD_PROFESSIONALS_TO_GROUP,
    meta: {
      method: 'POST',
      endpoint: "/api/groups/add_professionals/",
      body: {
        group: group,
        professionals: professionalsList
      },
      success: updateGroup,
    }
  }
}

export function removeProfessionalsFromGroup(professionals, group) {
  let professionalsList = [...professionals];
  return {
    type: REMOVE_PROFESSIONALS_FROM_GROUP,
    meta: {
      method: 'DELETE',
      endpoint: "/api/groups/remove_professionals/",
      body: {
        group: group,
        professionals: professionalsList
      },
      success: updateGroup,
    }
  }
}

export function favourProfessional(professional, group) {
  let professionalsList = [professional];
  return {
    type: FAVOUR_PROFESSIONAL,
    meta: {
      method: 'POST',
      endpoint: "/api/groups/add_professionals/",
      body: {
        group: group,
        professionals: professionalsList
      },
      success: updateGroup,
    }
  }
}

export function unfavourProfessional(professional, group) {
  let professionalsList = [professional];
  return {
    type: UNFAVOUR_PROFESSIONAL,
    meta: {
      method: 'DELETE',
      endpoint: "/api/groups/remove_professionals/",
      body: {
        group: group,
        professionals: professionalsList
      },
      success: updateGroup,
    }
  }
}

export function editProfessionalNotes(professional, notes) {
  return {
    type: EDIT_PROFESSIONAL_NOTE,
    meta: {
      method: 'POST',
      endpoint: "/api/users/create_note/",
      body: {
        notes: notes,
        professional: professional
      },
      success: updateProfessional,
    }
  }
}
//
// export function fetchProfessional() {
//   return {
//     type: FETCH_PROFESSIONAL,
//     meta: {
//       method: 'GET',
//       endpoint: "/api/professional/",
//       success: updateProfessional,
//     }
//   }
// }

function updateProfessional(data) {
  return {
    type: UPDATE_PROFESSIONAL_NOTES,
    payload: {
      professionalUid: data.professionalUid,
      notes: data.notes
    }
  }
}

export function fetchGroups() {
  return {
    type: FETCH_GROUPS,
    meta: {
      method: 'GET',
      endpoint: "/api/groups/",
      success: updateGroups,
    }
  }
}

export function fetchFavourites() {
  return {
    type: FETCH_FAVOURITES,
    meta: {
      method: 'GET',
      endpoint: "/api/groups/get_favourites/",
      success: updateGroups,
    }
  }
}

export function createGroup(name, description) {
  return {
    type: CREATE_GROUP,
    meta: {
      method: 'POST',
      endpoint: "/api/groups/",
      body: {
        name: name,
        description: description
      },
      success: updateGroup,
    }
  }
}

export function deleteGroup(value) {
  return {
    type: DELETE_GROUP,
    meta: {
      method: 'DELETE',
      endpoint: "/api/groups/delete_group/",
      body: {
        group: value
      },
      success: updateGroup,
    }
  }
}

export function editGroup(value, name, description) {
  return {
    type: EDIT_GROUP,
    meta: {
      method: 'PUT',
      endpoint: "/api/groups/edit_group/",
      body: {
        group: value,
        name: name,
        description: description
      },
      success: updateEditedGroup,
    }
  }
}


function updateGroups(data) {
  return {
    type: UPDATE_GROUPS,
    payload: {
      groups: data
    }
  }
}

function updateGroup(data) {
  return {
    type: UPDATE_GROUP,
    payload: {
      groupUid: Object.keys(data).pop(),
      groupDetails: Object.values(data).pop()
    }
  }
}

function updateEditedGroup(data) {
  return {
    type: UPDATE_EDITED_GROUP,
    payload: {
      groupUid: data["uid"],
      groupName: data["name"],
      groupDescription: data["description"]
    }
  }
}
