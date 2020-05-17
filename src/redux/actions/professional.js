export const FETCH_PROFESSIONALS = "FETCH_PROFESSIONALS";
export const UPDATE_PROFESSIONALS = "UPDATE_PROFESSIONALS";
export const FETCH_PROFESSIONAL = "FETCH_PROFESSIONAL";
export const UPDATE_PROFESSIONAL = "UPDATE_PROFESSIONAL";
export const FAVOURITE_PROFESSIONAL = "FAVOURITE_PROFESSIONAL";


export function fetchProfessionals() {
  return {
    type: FETCH_PROFESSIONALS,
    meta: {
      method: 'GET',
      endpoint: "/api/professionals/",
      success: updateProfessionals,
    }
  }
}

function updateProfessionals(data) {
  return {
    type: UPDATE_PROFESSIONALS,
    payload: {
      professionals: data.results
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
      currentProfessional: data.results
    }
  }
}

// function favouriteProfessional(data) {
//   return {
//     type: UPDATE_PROFESSIONALS,
//     payload: {
//       professionals: data.results
//     },
//     success:
//   }
// }