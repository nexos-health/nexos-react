export const FETCH_PROFESSION_TYPES = "FETCH_PROFESSION_TYPES";
export const UPDATE_PROFESSION_TYPES = "UPDATE_PROFESSION_TYPES";
export const FETCH_PROFESSIONALS = "FETCH_PROFESSIONALS";
export const UPDATE_PROFESSIONALS = "UPDATE_PROFESSIONALS";
export const FETCH_PROFESSIONAL = "FETCH_PROFESSIONAL";
export const UPDATE_PROFESSIONAL = "UPDATE_PROFESSIONAL";
export const ADD_PROFESSIONALS_TO_GROUP = "ADD_PROFESSIONALS_TO_GROUP";
export const CREATE_GROUP = "CREATE_GROUP";
export const FETCH_GROUPS = "FETCH_GROUPS";
export const UPDATE_GROUPS = "UPDATE_GROUPS";


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

export function addProfessionalsToGroup(professionals, groupUid) {
  let professionalUids = professionals.map((professional) => {
    return (professional.uid)
  });
  return {
    type: ADD_PROFESSIONALS_TO_GROUP,
    meta: {
      method: 'POST',
      endpoint: `/api/groups/`,
      body: {
        group: groupUid,
        professionals: professionalUids
      },
      success: updateGroups,
    }
  }
}

export function fetchProfessional() {
  return {
    type: FETCH_PROFESSIONAL,
    meta: {
      method: 'GET',
      endpoint: "/api/professional/",
      success: updateProfessional,
    }
  }
}

function updateProfessional(data) {
  return {
    type: UPDATE_PROFESSIONAL,
    payload: {
      currentProfessional: data
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
      success: updateGroups,
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

function updateGroups(data) {
  return {
    type: UPDATE_GROUPS,
    payload: {
      groups: data
    }
  }
}
