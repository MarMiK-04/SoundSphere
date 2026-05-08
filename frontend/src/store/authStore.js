import { create } from "zustand";
import { loginUser, signupUser, getMe } from "../api/auth.api.js";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isCheckingAuht : true,

  login: async (data) => {
    set({
      loading: true,
    });

    try {
      const res = await loginUser(data);
      const token = res.token;
      localStorage.setItem("token", token);
      const userRes = await getMe();
      set({
        user: userRes.data,
        loading: false,
      });
      return res;
    } catch (err) {
      set({
        loading: false,
      });
      throw err;
    }
  },
  signup: async (data) => {
    set({
      loading: true,
    });

    try {
      const res = await signupUser(data);
      set({
        loading: false,
      });
      return res;
    } catch (err) {
      set({
        loading: false,
      });
      throw err;
    }
  },

  fetchUser: async () => {
    set({
      loading: true,
      isCheckingAuht : true
    });
    try {
      const res = await getMe();
      set({
        user: res.data,
        loading: false,
        isCheckingAuht : false
      });
      return res;
    } catch (err) {
      localStorage.removeItem("token");
      set({
        user: null,
        loading: false,
        isCheckingAuht : false
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
    });
  },
}));

export default useAuthStore;
