
export const tokenStorageName = "auth.accessToken";

export const setAccessToken = (accessToken) => {
  localStorage.setItem(tokenStorageName, accessToken);
  return accessToken;
};

export const getAccessToken = () => {
  return localStorage.getItem(tokenStorageName);
};

