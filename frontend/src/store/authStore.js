import { create } from "zustand";
import { loginUser, signupUser, getMe } from "../api/auth.api.js";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  login: async (data) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await loginUser(data);
      const token = res.token;
      localStorage.setItem("token", token);
      const userRes = await getMe();
      set({
        user: userRes.data,
        token,
        loading: false,
      });
      return res;
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
      throw err;
    }
  },
  signup: async (data) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await signupUser(data);
      set({
        loading: false,
      });
      return res;
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
      throw err;
    }
  },

  fetchUser: async () => {
    set({
      loading: true,
      error: null,
    });
    try {
      const res = await getMe();
      set({
        user: res.data,
        loading: false,
      });
      return res;
    } catch (err) {
      set({
        user: null,
        error: err.message,
        token : null,
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
    });
  },
}));

export default useAuthStore;
