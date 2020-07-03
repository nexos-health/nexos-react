import fetch from 'cross-fetch'
import { getAccessToken } from "../../utils/authentication";

const fetchMiddleware = store => next => action => {
  next(action); // ensures the action is evaluated

  let options = {};
  const accessToken = getAccessToken();
  console.log("accessToken", accessToken);

  options.headers = action.meta.headers || {"Content-Type": "application/json"};
  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  }
  // options.mode = "same-origin";

  switch (action.meta.method) {
    case "PUT":
    case "POST":
      action.meta.method
        ? options.method = action.meta.method.toLowerCase()
        : options.method = "post";

      if (action.meta.body || options.headers["Accept"] === "application/json") {
        options.body = JSON.stringify(action.meta.body);
      } else {
        options.body = action.meta.body;
      }

      break;
    default:
      options.method = 'get'
  }

  let endpoint = action.meta.endpoint.startsWith("http://")
    ? action.meta.endpoint
    : process.env.REACT_APP_DJANGO + action.meta.endpoint;

  console.log(endpoint);

  fetch(endpoint, options)
    .then((response) => {
      console.log("RESP", response);
      if ([200, 201].indexOf(response.status) < 0) {
        let error = new Error();
        error.message = "Didn't receive 200 or 201 status";
        throw error
      }
      return response.json()
    })
    .then((json) => {
      if (action.meta.success) {
        store.dispatch(action.meta.success(json))
      }
    })
    .catch(error => {
      if (action.meta.error) {
        store.dispatch(action.meta.error(error))
      }
    })
};

export default fetchMiddleware