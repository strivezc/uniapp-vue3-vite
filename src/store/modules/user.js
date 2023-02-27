import { defineStore } from "pinia";
import UserService from "@/api/UserService";
import { getToken, removeToken, clearStorageSync } from "@/utils/auth";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: getToken(),
      name: "",
      userImg: "",
      phone: "",
      userId: "",
      recommendCode: "",
    };
  },
  persist: {
    enabled: true,
    detached: true, // 设置订阅与组件分离
  },
  getters: {
    getToken: (state) => state.token,
    getName: (state) => state.name,
    getUserImg: (state) => state.userImg,
    getPhone: (state) => state.phone,
    getUserId: (state) => state.userId,
    getRecommendCode: (state) => state.recommendCode,
  },
  actions: {
    setRecommendCode(recommendCode) {
      this.recommendCode = recommendCode;
    },
    setToken(token) {
      this.token = token;
    },
    setName(name) {
      this.name = name;
    },
    setUserImg(userImg) {
      this.userImg = userImg;
    },
    setUserId(userId) {
      this.userId = userId;
    },
    setPhone(phone) {
      this.phone = phone;
    },
    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        UserService.logout(this.token)
          .then(() => {
            this.setToken("");
            removeToken();
            clearStorageSync();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // remove token
    resetToken() {
      return new Promise((resolve) => {
        this.setToken("");
        clearStorageSync();
        resolve();
      });
    },
  },
});
