export const LOGIN = "LOGIN";
export const UPDATE_ACCOUNT_DETAILS = "UPDATE_ACCOUNT_DETAILS";


export function login() {
  return {
    type: LOGIN,
    meta: {
      method: 'GET',
      endpoint: `/api/account/login`,
      success: updateAccountData,
    }
  }
}

function updateAccountData(data) {
  console.log(data);
  return {
    type: UPDATE_ACCOUNT_DETAILS,
    payload: {
      accountDetails: data
    }
  }
}