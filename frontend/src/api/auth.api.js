import { fetchClient } from "../utils/fetchClient";

export const loginUser = (data) => {
  return fetchClient("/auth/login", {
    method: "POST",
    body: data,
  });
};

export const signupUser = (data) => {
  return fetchClient("/auth/signup", {
    method: "POST",
    body: data,
  });
};

export const getMe = () => {
  return fetchClient("/auth/me");
};
