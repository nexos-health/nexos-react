export const FETCH_PAYMENT_SESSION = "FETCH_PAYMENT_SESSION";
export const UPDATE_PAYMENT_SESSION = "UPDATE_PAYMENT_SESSION";
export const MAKE_PAYMENT = "MAKE_PAYMENT";


export function fetchPaymentSession() {
  return {
    type: FETCH_PAYMENT_SESSION,
    meta: {
      method: 'GET',
      endpoint: "/api/payment/",
      success: updatePaymentSession,
    }
  }
}

function updatePaymentSession(sessionId) {
  return {
    type: UPDATE_PAYMENT_SESSION,
    payload: {
      payment: {
        "sessionId": sessionId
      }
    }
  }
}